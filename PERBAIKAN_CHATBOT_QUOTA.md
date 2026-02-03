# Perbaikan Chatbot - Masalah Quota API

## 🔍 Masalah yang Ditemukan

Chatbot terus menampilkan pesan "Koneksi internet bermasalah" padahal internet berfungsi dengan baik.

### Penyebab Sebenarnya:

1. **Quota API Gemini Habis** (Error 429 - Too Many Requests)
   - API key sudah mencapai batas penggunaan gratis
   - Semua request ditolak dengan error 429

2. **Model yang Tidak Tersedia**
   - Model `gemini-2.0-flash-exp` sudah deprecated
   - Perlu menggunakan model yang lebih stabil

3. **Error Handling Kurang Spesifik**
   - Semua error ditangkap dan ditampilkan sebagai "koneksi internet bermasalah"
   - Error 429 (quota) tidak terdeteksi dengan baik

## ✅ Perbaikan yang Dilakukan

### 1. Update Model Gemini
**File**: `src/lib/gemini.ts`

```typescript
// Dari:
const MODEL_NAME = "gemini-2.0-flash-exp";

// Menjadi:
const MODEL_NAME = "gemini-2.0-flash";
```

### 2. Perbaiki Error Handling di gemini.ts
**File**: `src/lib/gemini.ts`

Menambahkan deteksi spesifik untuk:
- Error 429 (Quota habis)
- Error 404 (Model tidak tersedia)
- Error API key invalid
- Error SAFETY

```typescript
// Error 429 - Too Many Requests (Quota habis)
if (error.status === 429 || error.message?.includes("429") || error.message?.includes("Too Many Requests")) {
  throw new Error("QUOTA_EXCEEDED: Quota API Gemini habis. Silakan coba lagi dalam beberapa menit atau hubungi administrator.");
}

// Error 404 - Model tidak ditemukan
if (error.status === 404 || error.message?.includes("404") || error.message?.includes("not found")) {
  throw new Error("MODEL_ERROR: Model AI tidak tersedia. Sistem sedang dalam pemeliharaan.");
}
```

### 3. Perbaiki Error Handling di Konsultasi.tsx
**File**: `src/pages/Konsultasi.tsx`

Menambahkan deteksi dan pesan yang lebih spesifik:

```typescript
else if (error.message?.includes("QUOTA_EXCEEDED") || error.message?.includes("429") || error.message?.includes("Too Many Requests")) {
  errorMessage = "⏳ Quota API Habis";
  errorDetail = "Layanan chatbot AI telah mencapai batas penggunaan. Silakan coba lagi dalam beberapa menit atau hubungi admin untuk upgrade quota.\n\nUntuk konsultasi langsung:\n📞 WhatsApp: +62 896-5739-8733\n📧 Email: puskesmaswori@gmail.com";
}
```

## 🚀 Solusi untuk Mengatasi Quota Habis

### Opsi 1: Tunggu Reset Quota (GRATIS)
- Quota API gratis akan reset setiap hari/bulan
- Cek di: https://ai.dev/rate-limit

### Opsi 2: Upgrade ke API Key Berbayar
1. Buka [Google AI Studio](https://aistudio.google.com/apikey)
2. Buat API key baru dengan billing enabled
3. Update API key di file `.env`:
   ```
   VITE_GEMINI_API_KEY=your_new_api_key_here
   ```
4. Restart dev server: `npm run dev`

### Opsi 3: Generate API Key Baru (GRATIS)
1. Buka [Google AI Studio](https://aistudio.google.com/apikey)
2. Buat project baru
3. Generate API key baru (setiap key punya quota sendiri)
4. Update di `.env`
5. Restart dev server

### Opsi 4: Implementasi Rate Limiting
Tambahkan delay antar request untuk menghemat quota:

```typescript
// Tambahkan delay 1 detik antar request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
await delay(1000);
```

## 📊 Monitoring Quota

Cek penggunaan quota Anda di:
- https://ai.dev/rate-limit
- Google AI Studio Dashboard

## 🧪 Testing

Untuk test API key dan model yang tersedia:

```bash
# Test model tersedia
node list-models.js

# Test API dengan model tertentu
node test-api-simple.js
```

## ⚠️ Pesan Error Sekarang

Setelah perbaikan, user akan melihat pesan yang lebih jelas:

- ✅ **Quota Habis**: "⏳ Quota API Habis - Layanan chatbot AI telah mencapai batas penggunaan..."
- ✅ **Model Error**: "🔧 Model AI Tidak Tersedia - Sistem sedang dalam pemeliharaan..."
- ✅ **Network Error**: "🌐 Koneksi Internet Bermasalah - Silakan periksa koneksi..."
- ✅ **API Key Invalid**: "⚠️ Chatbot Belum Dikonfigurasi..."

## 📝 Catatan Penting

1. **API Key di `.env` masih valid** - hanya quota-nya yang habis
2. **Model sudah diupdate** - dari experimental ke stable
3. **Error handling lebih baik** - error ditampilkan dengan jelas
4. **Kontak darurat tersedia** - WhatsApp dan Email jika chatbot tidak tersedia

## 👤 Kontak Support

Jika chatbot tetap tidak berfungsi:
- 📞 WhatsApp: +62 896-5739-8733
- 📧 Email: puskesmaswori@gmail.com
- 🏥 Kunjungi: Puskesmas Wori, Jl. Raya Wori
