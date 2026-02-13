# 🔧 Panduan Perbaikan Chatbot - Error API Key

## ❌ Masalah
Chatbot mengalami error karena **API Key Gemini belum dikonfigurasi**.

## ✅ Solusi Lengkap

### Langkah 1: Dapatkan API Key Gemini (GRATIS)

1. **Buka browser** dan kunjungi salah satu link berikut:
   - https://aistudio.google.com/app/apikey
   - ATAU https://makersuite.google.com/app/apikey

2. **Login** dengan akun Google Anda

3. **Klik tombol "Create API Key"** atau "Get API Key"

4. **Pilih "Create API key in new project"** (atau pilih project yang sudah ada)

5. **Copy API Key** yang muncul (format seperti: `AIzaSyAaBbCcDdEe...`)

### Langkah 2: Tambahkan API Key ke File .env

1. **Buka file `.env`** di root project Anda:
   ```
   AI-Kesehatan-ViralCare-AIDE\.env
   ```

2. **Edit baris ke-3**, ganti dari:
   ```env
   VITE_GEMINI_API_KEY=
   ```
   
   Menjadi:
   ```env
   VITE_GEMINI_API_KEY=API_KEY_ANDA_DISINI
   ```
   
   **Contoh** (jangan gunakan key ini, gunakan key Anda sendiri!):
   ```env
   VITE_GEMINI_API_KEY=AIzaSyAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq
   ```

3. **Simpan file** (Ctrl+S)

### Langkah 3: Restart Development Server

**PENTING:** Server harus di-restart agar perubahan .env terbaca!

1. Di terminal PowerShell yang sedang menjalankan server:
   - Tekan **Ctrl+C** untuk menghentikan server
   
2. Tunggu sampai proses berhenti

3. Jalankan ulang server:
   ```powershell
   npm run dev
   ```

4. Tunggu sampai server running (biasanya di http://localhost:5173)

### Langkah 4: Test Chatbot

1. **Buka browser** ke http://localhost:5173

2. **Login** ke aplikasi (jika belum)

3. **Buka halaman Konsultasi**

4. **Ketik pesan test**, misalnya:
   ```
   Apa gejala demam berdarah?
   ```

5. **Chatbot seharusnya merespons** dengan baik!

---

## 🎯 Checklist Perbaikan

- [ ] API Key sudah didapat dari Google AI Studio
- [ ] API Key sudah ditambahkan ke file .env
- [ ] File .env sudah disimpan
- [ ] Development server sudah di-restart
- [ ] Browser sudah di-refresh
- [ ] Chatbot sudah berhasil merespons

---

## ⚠️ Troubleshooting

### Error "API key Gemini tidak valid"
- **Solusi:** Cek kembali API key, pastikan tidak ada spasi atau karakter tambahan
- Pastikan format: `VITE_GEMINI_API_KEY=AIzaSy...` (tanpa spasi sebelum/sesudah)

### Error "quota API Gemini habis"
- **Solusi:** API gratis Gemini memiliki limit. Tunggu beberapa saat atau buat API key baru
- Free tier: 60 requests per minute

### Chatbot masih error setelah restart
- **Solusi:** 
  1. Hard refresh browser: Ctrl+Shift+R
  2. Clear cache browser
  3. Cek console browser (F12) untuk error detail
  4. Pastikan .env berada di root folder yang sama dengan package.json

### File .env tidak terbaca
- **Solusi:**
  1. Pastikan nama file PERSIS `.env` (tanpa .txt atau ekstensi lain)
  2. File harus di root project (sejajar dengan package.json)
  3. Restart VSCode jika perlu
  4. Restart terminal baru

---

## 📝 Catatan Penting

1. **API Key GRATIS** dari Google Gemini
2. **Jangan share** API key Anda ke publik
3. **File .env** sudah otomatis di-ignore di Git (tidak akan ter-upload)
4. **Restart server** WAJIB setelah edit .env
5. Model yang digunakan: `gemini-2.0-flash-exp` (gratis dan powerful)

---

## 🎉 Setelah Berhasil

Chatbot akan:
- ✅ Merespons pertanyaan kesehatan
- ✅ Memberikan informasi penyakit menular
- ✅ Menyediakan saran pencegahan
- ✅ Tracking konsultasi otomatis
- ✅ Fitur share via WhatsApp & Email

---

## 📞 Butuh Bantuan?

Jika masih mengalami masalah:
1. Screenshot error yang muncul
2. Cek console browser (F12 → Console tab)
3. Cek terminal untuk error log
4. Pastikan semua langkah di atas sudah diikuti dengan benar

**Happy Coding! 🚀**
