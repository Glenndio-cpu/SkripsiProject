import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { FaPaperPlane, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { sendConsultationEmail } from '../lib/emailService';
import { getGeminiResponse, isGeminiConfigured, type ChatMessage } from '../lib/gemini';
import { trackConsultation } from '../lib/userActivityTracking';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Konsultasi = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Halo! Saya Chatbot Puskesmas Wori. Bagaimana saya bisa membantu Anda dengan pertanyaan seputar kesehatan dan pencegahan penyakit menular hari ini?' 
    }
  ]);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [summaryToSend, setSummaryToSend] = useState('');
  const [emailData, setEmailData] = useState({ name: '', email: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isApiConfigured, setIsApiConfigured] = useState(true);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check login status and API configuration
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      setIsUserLoggedIn(!!user);
    };
    
    checkLoginStatus();
    setIsApiConfigured(isGeminiConfigured());
    
    // Listen for login/logout events
    window.addEventListener('userUpdated', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('userUpdated', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Scroll handling
  useEffect(() => {
    // Focus input on initial load
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Scroll chat container to bottom for new messages
    if (chatContainerRef.current && conversation.length > 1) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const analyzeQuery = (message: string): { 
    isHealthRelated: boolean; 
    isClear: boolean;
    isEmergency: boolean;
  } => {
    const healthKeywords = [
      'sakit', 'penyakit', 'gejala', 'obat', 'dokter', 'rumah sakit', 'konsumsi', 'mengonsumsi',
      'demam', 'batuk', 'pilek', 'diare', 'mual', 'pusing', 'vaksin', 'alergi',
      'pengobatan', 'klinik', 'kesehatan', 'infeksi', 'virus', 'bakteri',
      'diabetes', 'darah tinggi', 'jantung', 'paru-paru', 'imun', 'sehat', 'tolong', 'racun', 'keracunan',
      'perawatan', 'cara', 'mengobati', 'mengatasi', 'mencegah', 'terkena', 'terserang',
      'flu', 'tbc', 'covid', 'corona', 'ispa', 'pencegahan', 'penularan', 'menular'
    ];
    
    const emergencyKeywords = ['darurat', 'gawat', 'kritis', 'emergency', 'sesak', 'tidak sadar'];
    
    const isHealth = healthKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const isEmergency = emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const words = message.trim().toLowerCase().split(/\s+/);
    // Lebih fleksibel: minimal 2 kata atau ada keyword kesehatan
    const isClear = words.length >= 2 || isHealth;
    
    return { 
      isHealthRelated: isHealth, 
      isClear: isClear,
      isEmergency: isEmergency
    };
  };

  const formatAIResponse = (response: string): string => {
    // Clean unwanted markers dan format ulang
    let formatted = response
      .replace(/\*\*\*/g, '')     // Remove triple asterisks
      .replace(/\*\*/g, '')       // Remove double asterisks (bold)
      .replace(/\*/g, '')         // Remove single asterisks
      .replace(/__|__/g, '')      // Remove underscores
      .trim();

    // Normalize line breaks
    formatted = formatted
      .replace(/\r\n/g, '\n')      // Windows to Unix
      .replace(/\n{4,}/g, '\n\n')  // Max 2 line breaks
      .trim();

    // Format section headers - ensure they end with just text, no colons at end
    formatted = formatted
      .replace(/(Pengobatan|Perawatan|Rekomendasi|Manfaat|Risiko|Resiko|Pencegahan|Penyebab|Gejala|Diagnosis|Komplikasi|Tanda|Ciri|Obat|Terapi|Penanganan|Penularan|Definisi|Cara|Langkah)\s*:/gi, '\n\n$1:\n');

    // Format bullet points - convert all to consistent •
    formatted = formatted
      .replace(/^\s*[\*\-]\s+/gm, '• ')    // Convert * or - to •
      .replace(/^\s*•\s+/gm, '• ');         // Normalize •

    // Clean up numbered lists
    formatted = formatted
      .replace(/^(\d+)[\.\)]\s*/gm, '$1. '); // Normalize to "1. "

    // Remove extra spaces
    formatted = formatted
      .replace(/  +/g, ' ')        // Multiple spaces to single
      .replace(/\n /g, '\n')       // Space after newline
      .replace(/ \n/g, '\n')       // Space before newline
      .trim();

    // Final cleanup
    formatted = formatted
      .replace(/\n{3,}/g, '\n\n')  // Max 2 line breaks
      .replace(/^\n+/, '')          // Remove leading newlines
      .replace(/\n+$/, '');         // Remove trailing newlines

    return formatted;
  };

  const validateHealthResponse = (response: string): boolean => {
    if (!analyzeQuery(response).isHealthRelated) return false;
    const requiredSections = ['Rekomendasi:', 'Pencegahan:'];
    return requiredSections.every(section => response.includes(section));
  };

  const extractSummary = (content: string): string | null => {
    const summaryMatch = content.match(/Rangkuman:([\s\S]*?)(?=\n\n|$)/i);
    if (!summaryMatch) return null;

    return summaryMatch[1]
      .split('\n')
      .map(line => line.replace(/^[•-]\s*/, '').trim())
      .filter(line => line)
      .join('\n');
  };

  const prepareWhatsAppMessage = () => {
    const lastAssistantMessage = conversation
      .filter(msg => msg.role === 'assistant')
      .pop()?.content || '';
    
    const summary = extractSummary(lastAssistantMessage);

    if (!summary) {
      toast({
        title: "Tidak ada rangkuman",
        description: "Tidak ditemukan rangkuman konsultasi untuk dikirim.",
        variant: "destructive"
      });
      return;
    }

    setSummaryToSend(summary);
    setShowWhatsAppModal(true);
  };

  const handleShareViaEmail = () => {
    const summary = conversation
      .map((msg) => `${msg.role === 'user' ? 'Anda' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    if (!summary.trim()) {
      toast({
        title: "Tidak ada ringkasan",
        description: "Tidak ditemukan rangkuman konsultasi untuk dikirim.",
        variant: "destructive"
      });
      return;
    }

    setSummaryToSend(summary);
    setShowEmailModal(true);
  };

  const sendToWhatsApp = () => {
    const phoneNumber = "+6289657398733";
    const message = `Berikut ringkasan konsultasi Anda dengan ViralCare AIDE:\n\n${summaryToSend}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setShowWhatsAppModal(false);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.name || !emailData.email) {
      alert('Nama dan email harus diisi!');
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.email)) {
      alert('Format email tidak valid!');
      return;
    }

    setIsSendingEmail(true);

    try {
      // Extract symptoms dari conversation
      const userMessages = conversation
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n');

      const emailSent = await sendConsultationEmail({
        user_name: emailData.name,
        user_email: emailData.email,
        symptoms: userMessages,
        consultation_summary: summaryToSend
      });

      if (emailSent) {
        alert('✅ Notifikasi berhasil dikirim ke admin! Anda akan segera dihubungi via email.');
        setShowEmailModal(false);
        setEmailData({ name: '', email: '' });
      } else {
        alert('⚠️ Email service belum dikonfigurasi. Silakan gunakan WhatsApp untuk mengirim ringkasan.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Gagal mengirim email. Silakan coba lagi atau gunakan WhatsApp.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🚀 handleSendMessage called with message:", message);
    
    if (!message.trim()) {
      toast({
        title: "Pesan kosong",
        description: "Silakan ketik pertanyaan Anda terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const userMessage = message;
    setMessage('');
    
    console.log("👤 User message:", userMessage);
    
    // Tambahkan pesan user ke conversation
    const newConversation: Message[] = [...conversation, { role: 'user', content: userMessage }];
    setConversation(newConversation);
    setIsLoading(true);
    
    console.log("💬 Conversation updated, loading state:", true);

    try {
      const { isHealthRelated, isClear } = analyzeQuery(userMessage);
      console.log("🔍 Query analysis:", { isHealthRelated, isClear });

      // Validasi lebih fleksibel untuk user yang sudah login
      // Jika sudah login (mode konsultasi), cukup cek apakah pertanyaan jelas
      // Jika belum login (mode public), harus terkait kesehatan
      if (!isClear) {
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: 'Maaf, pertanyaan Anda kurang jelas. Mohon ajukan pertanyaan yang lebih spesifik agar saya dapat membantu dengan baik.' 
        }]);
        setIsLoading(false);
        return;
      }

      // Untuk user yang belum login, validasi harus terkait kesehatan
      if (!isUserLoggedIn && !isHealthRelated) {
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: 'Untuk konsultasi medis dan informasi penyakit, silakan login terlebih dahulu. Saat ini saya hanya dapat membantu dengan informasi umum Puskesmas seperti jam layanan, lokasi, pendaftaran, kontak, dan jadwal imunisasi.' 
        }]);
        setIsLoading(false);
        return;
      }

      // Filter hanya pesan user dan assistant yang bukan greeting
      // Gemini API memerlukan pesan pertama harus dari 'user'
      const chatMessages: ChatMessage[] = newConversation
        .filter((msg, index) => {
          // Hapus pesan greeting pertama (index 0) jika itu assistant message
          if (index === 0 && msg.role === 'assistant') {
            return false;
          }
          return true;
        })
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      console.log("📤 Sending messages to Gemini:", chatMessages.length, "messages");

      // Panggil Gemini 2.0 Flash
      const aiResponse = await getGeminiResponse(chatMessages);
      console.log("✅ Received response from Gemini:", aiResponse?.substring(0, 100));

      // Format respons
      const formattedResponse = formatAIResponse(aiResponse);
      console.log("✅ Formatted response:", formattedResponse?.substring(0, 100));

      // Tambahkan respons AI ke conversation
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: formattedResponse
      }]);

      // Track consultation jika user sudah login
      if (isUserLoggedIn) {
        trackConsultation();
      }

    } catch (error: any) {
      console.error('❌ Error in handleSendMessage:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Handle error message
      let errorMessage = "Gagal memproses permintaan. Silakan coba lagi.";
      let errorDetail = "";
      
      if (error.message?.includes("API key") || error.message?.includes("dikonfigurasi")) {
        errorMessage = "⚠️ Chatbot Belum Dikonfigurasi";
        errorDetail = "Silakan hubungi administrator untuk mengaktifkan layanan AI chatbot.\n\nUntuk konsultasi langsung:\n📞 WhatsApp: +62 896-5739-8733\n📧 Email: puskesmaswori@gmail.com";
      } else if (error.message?.includes("quota")) {
        errorMessage = "Layanan sedang sibuk. Silakan coba lagi dalam beberapa saat.";
        errorDetail = "Jika mendesak, hubungi:\n📞 +62 896-5739-8733";
      } else if (error.message?.includes("SAFETY")) {
        errorMessage = "Pertanyaan Anda tidak dapat diproses. Silakan coba pertanyaan lain.";
        errorDetail = "Pastikan pertanyaan Anda sesuai dengan topik kesehatan dan pencegahan penyakit.";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Koneksi internet bermasalah.";
        errorDetail = "Silakan periksa koneksi internet Anda dan coba lagi.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Tampilkan pesan error yang lebih ramah ke user
      const fullErrorMessage = errorDetail 
        ? `${errorMessage}\n\n${errorDetail}`
        : `Maaf, terjadi kesalahan: ${errorMessage}\n\nSilakan coba lagi atau hubungi Puskesmas Wori di +62 896-5739-8733 untuk bantuan langsung.`;

      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: fullErrorMessage
      }]);
    } finally {
      setIsLoading(false);
      console.log("✅ handleSendMessage completed, loading state:", false);
    }
  };

  const FormattedMessage = ({ content }: { content: string }) => {
    // Split content into lines first
    const allLines = content.split('\n').filter(line => line.trim() !== '');
    let currentHeaderNumber = 0;
    let subItemCounter = 0;

    return (
      <div className="space-y-2">
        {allLines.map((line, lineIndex) => {
          // Clean ALL formatting markers from the line
          let trimmedLine = line.trim()
            .replace(/\*\*\*/g, '')  // Remove triple asterisks
            .replace(/\*\*/g, '')    // Remove double asterisks
            .replace(/\*/g, '')      // Remove single asterisks  
            .replace(/__|__/g, '')   // Remove underscores
            .trim();
          
          // Remove numbering from Gemini if pattern is: "number. CapitalLetter..."
          // This preserves "1. +62..." but removes "1. Fokus..."
          if (/^\d+\.\s+[A-Z]/.test(trimmedLine)) {
            trimmedLine = trimmedLine.replace(/^\d+\.\s+/, '');
          }
          
          // Skip empty lines
          if (!trimmedLine) return null;
          
          // Header detection - dengan berbagai variasi
          const isHeader = trimmedLine.match(/^(Pengobatan|Perawatan|Rekomendasi|Manfaat|Risiko|Resiko|Pencegahan|Penyebab|Gejala|Diagnosis|Komplikasi|Tanda|Ciri|Obat|Terapi|Penanganan|Penularan|Definisi|Apa itu|Cara|Langkah)[:\s]/i);
          
          // Important note detection
          const isImportant = trimmedLine.match(/^(Penting|Catatan|Perhatian|Ingat|Warning|Peringatan)[:\s!]/i);
          
          // Question detection
          const isQuestion = trimmedLine.match(/^(Kapan|Mengapa|Bagaimana|Apa|Siapa|Di mana|Berapa).*\?$/i);
          
          // Bold text detection (ends with :)
          const isBoldText = trimmedLine.endsWith(':') && trimmedLine.length < 80;
          
          // Line pertama yang panjang (greeting) - TANPA NOMOR
          const isFirstLine = lineIndex === 0 && trimmedLine.length > 50;
          
          // Disclaimer atau kalimat sebelum penutup - TANPA NOMOR
          const isDisclaimer = trimmedLine.match(/^(Meskipun|Namun|Perlu diingat|Harap diingat|Catatan penting|Disclaimer)/i);
          
          // Line terakhir (closing) - TANPA NOMOR
          // Deteksi kalimat penutup yang umum dari chatbot
          const isLastLine = lineIndex === allLines.length - 1 && (
            trimmedLine.match(/^(Semoga|Jika|Jangan|Tetap|Cepat|Salam|Sebagai|Saya|Terima kasih|Silakan|Jangan ragu|Ingat)/i) ||
            trimmedLine.match(/(siap membantu|pertanyaan lain|butuhkan|memerlukan)/i)
          );
          
          if (isHeader) {
            currentHeaderNumber++;
            subItemCounter = 0;
            return (
              <div 
                key={lineIndex}
                className="mt-6 first:mt-0"
              >
                <h3 className="font-bold text-healthcare-700 text-lg pb-2 border-b-2 border-healthcare-300 mb-3">
                  <span className="text-healthcare-600 mr-2">{currentHeaderNumber}.</span>
                  {trimmedLine.replace(/:\s*$/, '')}
                </h3>
              </div>
            );
          }
          
          if (isImportant) {
            return (
              <div 
                key={lineIndex}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg my-3"
              >
                <p className="text-yellow-800 font-semibold text-sm flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{trimmedLine}</span>
                </p>
              </div>
            );
          }
          
          if (isQuestion) {
            return (
              <div 
                key={lineIndex}
                className="font-semibold text-healthcare-700 mt-4 mb-2 flex items-start gap-2"
              >
                <span className="text-healthcare-600">❓</span>
                <span>{trimmedLine}</span>
              </div>
            );
          }
          
          // Bold text - TIDAK DIBERI NOMOR
          if (isBoldText) {
            return (
              <p 
                key={lineIndex}
                className="font-semibold text-gray-900 mt-3 mb-1 ml-6"
              >
                {trimmedLine}
              </p>
            );
          }
          
          // Line pertama (greeting panjang) - TIDAK DIBERI NOMOR
          if (isFirstLine) {
            return (
              <p 
                key={lineIndex}
                className="text-gray-800 leading-relaxed mb-3"
              >
                {trimmedLine}
              </p>
            );
          }
          
          // Disclaimer - TIDAK DIBERI NOMOR
          if (isDisclaimer) {
            return (
              <p 
                key={lineIndex}
                className="text-gray-700 leading-relaxed mt-4 italic"
              >
                {trimmedLine}
              </p>
            );
          }
          
          // Line terakhir (closing) - TIDAK DIBERI NOMOR
          if (isLastLine) {
            return (
              <p 
                key={lineIndex}
                className="text-gray-800 leading-relaxed mt-4 italic"
              >
                {trimmedLine}
              </p>
            );
          }
          
          // SEMUA LINE LAINNYA DIBERI NOMOR
          subItemCounter++;
          return (
            <div 
              key={lineIndex}
              className="flex items-start gap-3 ml-6 my-2"
            >
              <span className="font-semibold text-healthcare-600 min-w-[1.5rem]">
                {subItemCounter}.
              </span>
              <p className="text-gray-800 leading-relaxed flex-1">
                {trimmedLine}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout hideAIAssistant={true}>
      <div className="animate-fade-in max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-healthcare-800">Konsultasi Kesehatan</h1>
          
          {/* Mode Badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
            isUserLoggedIn 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            <span className="text-lg">{isUserLoggedIn ? '💬' : 'ℹ️'}</span>
            <span>Mode: {isUserLoggedIn ? 'Konsultasi' : 'Info Puskesmas'}</span>
          </div>
        </div>

        {/* API Configuration Warning */}
        {!isApiConfigured && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-2 text-lg">Chatbot AI Belum Dikonfigurasi</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  API Key Gemini belum diatur. Chatbot tidak dapat memberikan respons AI.
                </p>
                <div className="bg-yellow-100 border border-yellow-300 rounded p-3 mb-3 text-sm">
                  <p className="font-semibold text-yellow-900 mb-2">📋 Untuk Admin/Developer:</p>
                  <ol className="list-decimal list-inside space-y-1 text-yellow-800 ml-2">
                    <li>Buka: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">Google AI Studio</a></li>
                    <li>Login & klik "Create API Key" (GRATIS)</li>
                    <li>Copy API key yang dihasilkan</li>
                    <li>Edit file <code className="bg-yellow-200 px-1 rounded">.env</code> di root project</li>
                    <li>Tambahkan: <code className="bg-yellow-200 px-1 rounded">VITE_GEMINI_API_KEY=your_key</code></li>
                    <li>Restart development server</li>
                  </ol>
                </div>
                <div className="bg-white border border-yellow-300 rounded p-3 text-sm">
                  <p className="font-semibold text-yellow-900 mb-1">📞 Untuk sementara, hubungi langsung:</p>
                  <p className="text-yellow-800">
                    WhatsApp: <a href="https://wa.me/6289657398733" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-yellow-900">+62 896-5739-8733</a><br/>
                    Email: <a href="mailto:puskesmaswori@gmail.com" className="font-semibold underline hover:text-yellow-900">puskesmaswori@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info banner untuk user yang belum login */}
        {!isUserLoggedIn && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Mode Terbatas</h3>
                <p className="text-sm text-blue-800">
                  Saat ini Anda hanya dapat bertanya tentang informasi Puskesmas (jam layanan, lokasi, pendaftaran, dll). 
                  <strong> Silakan login untuk mengakses konsultasi medis dan informasi penyakit.</strong>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Chatbot Container */}
        <div 
          ref={chatContainerRef}
          className="bg-white rounded-lg shadow-lg p-6 mb-6 h-[60vh] overflow-y-auto"
        >
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}
            >
              <div
                className={`inline-block rounded-lg px-4 py-3 max-w-[90%] ${
                  msg.role === 'user'
                    ? 'bg-healthcare-600 text-white'
                    : 'bg-gray-100 border border-gray-200 text-gray-800'
                }`}
              >
                <FormattedMessage content={msg.content} />
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="mb-4">
              <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700">
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input and Send to WhatsApp */}
        <form onSubmit={handleSendMessage} className="mb-4">
          <div className="flex gap-2 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pertanyaan seputar kesehatan Anda..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-healthcare-500"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              className="bg-healthcare-600 text-white px-4 py-3 rounded-lg"
              whileHover={{ backgroundColor: '#2563eb' }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || !message.trim()}
            >
              <FaPaperPlane />
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={prepareWhatsAppMessage}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaWhatsapp className="text-lg mr-2" />
              <span>Kirim ke WhatsApp</span>
            </motion.button>
            
            <motion.button
              type="button"
              onClick={handleShareViaEmail}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEnvelope className="text-lg mr-2" />
              <span>Kirim ke Email Admin</span>
            </motion.button>
          </div>
          
          {/* Disclaimer - Outside of chat */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300 text-sm text-gray-700">
            <p className="font-bold mb-1">PENTING:</p>
            <p>Informasi ini hanya bersifat informatif dan bukan pengganti nasihat medis profesional. Selalu konsultasikan dengan dokter atau tenaga medis yang berkualifikasi untuk diagnosis dan pengobatan.</p>
          </div>
        </form>

        {/* WhatsApp Confirmation Modal */}
        {showWhatsAppModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Konfirmasi Pengiriman</h3>
              <p className="mb-4">Anda akan mengirim ringkasan konsultasi ke WhatsApp. Lanjutkan?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={sendToWhatsApp}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Lanjutkan ke WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Confirmation Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">📧 Kirim ke Email Admin</h3>
              <p className="mb-4 text-gray-600">
                Masukkan data Anda untuk mengirim notifikasi konsultasi ke admin Puskesmas Wori Online.
              </p>
              
              <form onSubmit={handleSendEmail}>
                <div className="mb-4">
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={emailData.name}
                    onChange={(e) => setEmailData({...emailData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Anda
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    value={emailData.email}
                    onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                  ℹ️ Admin akan menghubungi Anda via email untuk konsultasi lebih lanjut.
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailModal(false);
                      setEmailData({ name: '', email: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={isSendingEmail}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    disabled={isSendingEmail}
                  >
                    {isSendingEmail ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <FaEnvelope className="mr-2" />
                        Kirim Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Konsultasi;