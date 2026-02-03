import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type ChatMode = "public" | "consultation";

// Ambil API key dari environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey) {
  console.warn(
    "⚠️ VITE_GEMINI_API_KEY belum diset di file .env\n" +
    "Silakan:\n" +
    "1. Buat file .env di root project\n" +
    "2. Tambahkan: VITE_GEMINI_API_KEY=your_api_key_here\n" +
    "3. Dapatkan API key gratis di: https://makersuite.google.com/app/apikey\n" +
    "4. Restart dev server setelah menambahkan .env"
  );
}

// Inisialisasi Gemini AI dengan model 2.0 Flash
const genAI = new GoogleGenerativeAI(apiKey);

// Gunakan model gemini-2.0-flash-exp (experimental) atau gemini-2.0-flash
const MODEL_NAME = "gemini-2.0-flash-exp";

/**
 * System prompt untuk mode publik (belum login)
 * Hanya menjawab informasi umum tentang Puskesmas
 */
const PUBLIC_SYSTEM_PROMPT = `Anda adalah asisten informasi Puskesmas Wori Online.

TUGAS ANDA:
- Menjawab pertanyaan tentang informasi Puskesmas Wori
- Memberikan informasi jam layanan, alamat, lokasi, dan rute
- Menjelaskan cara menggunakan website/aplikasi
- Informasi kontak dan WhatsApp Puskesmas
- Informasi biaya, administrasi, dan persyaratan layanan
- Layanan yang tersedia di Puskesmas
- Alur pendaftaran dan antrian
- Jadwal imunisasi dan vaksinasi
- Cara membuat akun, login, dan register

BATASAN ANDA:
- JANGAN memberikan konsultasi medis
- JANGAN mendiagnosis penyakit atau gejala
- JANGAN memberikan rekomendasi obat
- JANGAN menjawab pertanyaan tentang penyakit spesifik
- Jika ditanya tentang kesehatan/penyakit, minta user untuk login terlebih dahulu

RESPONS SAAT DITANYA MEDIS:
"Untuk konsultasi medis dan informasi penyakit, silakan login terlebih dahulu. Saat ini saya hanya dapat membantu dengan informasi umum Puskesmas seperti jam layanan, lokasi, pendaftaran, kontak, dan jadwal imunisasi."

GAYA KOMUNIKASI:
- Ramah dan sopan
- Singkat dan jelas
- Bahasa Indonesia yang baik`;

/**
 * System prompt untuk mode konsultasi (sudah login)
 */
const CONSULTATION_SYSTEM_PROMPT = `Anda adalah Chatbot Pendamping Puskesmas Desa Wori yang ahli dalam kesehatan dan pencegahan penyakit menular.

IDENTITAS ANDA:
- Jika ditanya "Siapa Anda?" atau "Apa itu chatbot ini?", jawab: "Saya adalah Chatbot Pendamping Puskesmas Desa Wori"
- JANGAN PERNAH menyebut diri sebagai "Asisten Virtual" atau "AI Assistant"
- SELALU gunakan identitas "Chatbot Pendamping Puskesmas Desa Wori"

PERAN ANDA:
- Memberikan informasi tentang penyakit menular (influenza, TB, demam berdarah, COVID-19, ISPA, dll)
- Menjelaskan gejala, cara penularan, dan pencegahan penyakit
- Memberikan saran kesehatan umum yang dapat dipercaya
- Mendorong konsultasi dengan tenaga medis profesional untuk diagnosis

BATASAN ANDA:
- JANGAN mendiagnosis penyakit secara pasti
- JANGAN meresepkan obat spesifik atau dosis
- JANGAN menggantikan konsultasi medis profesional
- Selalu sarankan untuk berkonsultasi dengan dokter jika gejala serius

GAYA KOMUNIKASI:
- Ramah, empati, dan mudah dipahami
- Gunakan bahasa Indonesia yang baik
- Berikan penjelasan yang jelas dan terstruktur dengan poin-poin
- Jika tidak yakin, akui keterbatasan dan sarankan konsultasi profesional

FOKUS UTAMA:
- Pencegahan penyakit menular
- Edukasi kesehatan masyarakat
- Promosi pola hidup sehat
- Informasi layanan Puskesmas Wori

CONTOH JAWABAN:
Jika ditanya "Siapa Anda?", jawab:
"Saya adalah Chatbot Pendamping Puskesmas Desa Wori, di sini untuk membantu Anda dengan informasi kesehatan, pencegahan penyakit menular, dan layanan Puskesmas Wori."`;

/**
 * Konversi role untuk Gemini API
 */
function toGeminiRole(role: ChatMessage["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

/**
 * Deteksi apakah user sudah login
 */
function isLoggedIn(): boolean {
  try {
    return !!localStorage.getItem("user");
  } catch {
    return false;
  }
}

/**
 * Filter apakah pertanyaan diperbolehkan di mode publik
 */
function isPublicAllowed(text: string): boolean {
  const allowedTopics = [
    /jam|buka|tutup|operasional/i,
    /lokasi|alamat|rute|maps|arah/i,
    /kontak|telepon|whats?app|wa|hubungi/i,
    /layanan|fitur|fasilitas/i,
    /pendaftaran|daftar|antrian|booking/i,
    /jadwal|vaksin|imunisasi/i,
    /biaya|gratis|administrasi|tarif/i,
    /akun|login|register|daftar\s+akun|masuk/i,
    /privasi|syarat|ketentuan/i,
    /cara\s+pakai|cara\s+gunakan|tutorial/i
  ];

  const blockedTopics = [
    /gejala|diagnos|sakit/i,
    /obat|dosis|resep|medicine/i,
    /penyakit|flu|demam|dbd|covid|asma|batuk|pilek|diare|muntah/i,
    /hipertensi|diabetes|kanker|jantung|stroke/i,
    /tb|malaria|hiv|aids|hepatitis/i,
    /alergi|sesak|pusing|nyeri|lemas/i
  ];

  // Jika mengandung topik yang diblokir, tolak
  if (blockedTopics.some(regex => regex.test(text))) {
    return false;
  }

  // Jika mengandung topik yang diperbolehkan, izinkan
  return allowedTopics.some(regex => regex.test(text));
}

/**
 * Kirim percakapan ke Gemini 2.0 Flash dan dapatkan respons
 * @param messages - Array pesan percakapan
 * @param mode - Mode chat: "public" (belum login) atau "consultation" (sudah login)
 * @returns Promise dengan teks respons dari AI
 */
export async function getGeminiResponse(
  messages: ChatMessage[],
  mode?: ChatMode
): Promise<string> {
  if (!apiKey) {
    // Fallback response jika API key belum dikonfigurasi
    return `⚠️ **Chatbot Belum Dikonfigurasi**

Maaf, layanan chatbot AI belum dikonfigurasi dengan benar.

**Untuk Admin/Developer:**
1. Dapatkan API Key GRATIS dari: https://aistudio.google.com/app/apikey
2. Buat file \`.env\` di root project
3. Tambahkan: \`VITE_GEMINI_API_KEY=your_api_key_here\`
4. Restart development server

**Untuk sementara, Anda dapat:**
📞 Hubungi langsung: +62 896-5739-8733 (WhatsApp)
📧 Email: puskesmaswori@gmail.com
🏥 Kunjungi: Puskesmas Wori, Jl. Raya Wori

Terima kasih atas pengertiannya! 🙏`;
  }

  // Tentukan mode efektif berdasarkan status login jika tidak dispesifikasi
  const effectiveMode: ChatMode = mode ?? (isLoggedIn() ? "consultation" : "public");
  
  // Pesan terakhir dari user
  const lastMessage = messages[messages.length - 1];

  // Jika mode publik dan pertanyaan tentang medis, tolak langsung
  if (effectiveMode === "public" && !isPublicAllowed(lastMessage.content)) {
    return "Untuk konsultasi medis dan informasi penyakit, silakan login terlebih dahulu. Saat ini saya hanya dapat membantu dengan informasi umum Puskesmas seperti jam layanan, lokasi, pendaftaran, kontak, dan jadwal imunisasi.";
  }

  try {
    // Pilih system prompt berdasarkan mode
    const systemPrompt = effectiveMode === "public" 
      ? PUBLIC_SYSTEM_PROMPT 
      : CONSULTATION_SYSTEM_PROMPT;

    console.log("🤖 Gemini API Call:", {
      mode: effectiveMode,
      apiKeyConfigured: !!apiKey,
      apiKeyLength: apiKey?.length,
      messagesCount: messages.length
    });

    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: systemPrompt
    });

    // Konversi history percakapan (semua pesan kecuali yang terakhir)
    const history = messages.slice(0, -1).map((msg) => ({
      role: toGeminiRole(msg.role),
      parts: [{ text: msg.content }],
    }));

    // Pesan terakhir dari user
    const lastMessage = messages[messages.length - 1];

    console.log("📤 Sending to Gemini:", lastMessage.content);

    // Mulai chat dengan history
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7, // Kreativitas sedang
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Kirim pesan user dan dapatkan respons
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini Response received:", text.substring(0, 100) + "...");

    return text;
  } catch (error: any) {
    console.error("❌ Error calling Gemini API:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    
    // Handle berbagai jenis error
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key not valid")) {
      throw new Error("API key Gemini tidak valid. Silakan periksa kembali di file .env");
    }
    
    if (error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Quota API Gemini habis. Silakan coba lagi nanti atau upgrade quota.");
    }
    
    if (error.message?.includes("SAFETY")) {
      throw new Error("Respons ditolak karena alasan keamanan. Silakan coba pertanyaan lain.");
    }
    
    throw new Error(`Gagal menghubungi AI: ${error.message || "Unknown error"}`);
  }
}

/**
 * Cek apakah Gemini API sudah dikonfigurasi dengan benar
 */
export function isGeminiConfigured(): boolean {
  return !!apiKey && apiKey.length > 0;
}

/**
 * Generate respons singkat untuk pertanyaan umum tanpa context
 */
export async function getQuickResponse(question: string): Promise<string> {
  return getGeminiResponse([
    { role: "user", content: question }
  ]);
}
