# 🔍 DEBUG CHATBOT - Langkah Troubleshooting

## ⚠️ Masalah: Chatbot Error "Gagal memproses permintaan"

### 🎯 Langkah 1: CEK CONSOLE BROWSER

1. **Buka Developer Tools:**
   - Tekan `F12` atau `Ctrl + Shift + I`
   - Atau klik kanan → Inspect → Console tab

2. **Cari Error Message:**
   - Lihat apakah ada error merah di console
   - Cari pesan yang dimulai dengan ❌ atau "Error calling Gemini API"

3. **Screenshot error** dan kirim ke saya

---

### 🎯 Langkah 2: PASTIKAN SERVER SUDAH DI-RESTART

**SANGAT PENTING!** File `.env` hanya dibaca saat server start.

1. Di terminal PowerShell:
   ```powershell
   # Tekan Ctrl+C untuk stop server
   # Tunggu sampai proses berhenti
   
   # Start ulang
   npm run dev
   ```

2. Tunggu sampai muncul:
   ```
   ➜  Local:   http://localhost:5173/
   ```

3. **Hard Refresh Browser:**
   ```
   Ctrl + Shift + R
   ```

---

### 🎯 Langkah 3: VERIFIKASI API KEY

1. **Cek file .env:**
   ```bash
   # Buka: .env
   # Pastikan ada:
   VITE_GEMINI_API_KEY=AIzaSyDqyJS7p-j4kmkWeDwx9zaya7P0Or4McoY
   ```

2. **Pastikan:**
   - ✅ Tidak ada spasi sebelum/sesudah `=`
   - ✅ Tidak ada tanda kutip (`"` atau `'`)
   - ✅ File bernama `.env` (bukan `.env.txt` atau lainnya)
   - ✅ File di root project (sejajar dengan `package.json`)

---

### 🎯 Langkah 4: TEST API KEY DI CONSOLE

Setelah server restart & browser refresh:

1. Buka Console (F12)
2. Ketik pertanyaan di chatbot
3. Lihat console log:
   ```
   🤖 Gemini API Call: {...}
   📤 Sending to Gemini: ...
   ✅ Gemini Response received: ...
   ```

4. Jika muncul ❌ error, screenshot error tersebut

---

### 🎯 Langkah 5: COMMON ERRORS & SOLUTIONS

#### Error: "API key not valid"
**Penyebab:** API key salah atau tidak valid
**Solusi:**
1. Buka https://aistudio.google.com/app/apikey
2. Cek API key Anda
3. Jika perlu, buat API key baru
4. Update di file .env
5. Restart server

#### Error: "quota" atau "RESOURCE_EXHAUSTED"
**Penyebab:** Quota API habis
**Solusi:**
1. Free tier Gemini: 60 requests/minute
2. Tunggu 1 menit
3. Atau buat API key baru

#### Error: "Failed to fetch" atau "Network error"
**Penyebab:** Koneksi internet atau CORS issue
**Solusi:**
1. Cek koneksi internet
2. Coba restart browser
3. Clear cache browser

#### Error: "SAFETY"
**Penyebab:** Content filter Gemini
**Solusi:**
1. Coba pertanyaan lain yang lebih general
2. Hindari kata-kata yang sensitive

---

### 🎯 Langkah 6: VERIFIKASI LENGKAP

Jalankan checklist ini:

```powershell
# 1. Cek file .env ada dan terisi
cat .env
# Harus muncul: VITE_GEMINI_API_KEY=AIzaSy...

# 2. Restart server
# Ctrl+C lalu:
npm run dev

# 3. Buka browser
# http://localhost:5173

# 4. Buka Console (F12)

# 5. Login ke aplikasi

# 6. Buka halaman Konsultasi

# 7. Ketik pertanyaan sederhana
# Contoh: "apa itu diare?"

# 8. Lihat Console untuk log
```

---

### 🎯 Langkah 7: MANUAL TEST API KEY

Jika masih error, test API key secara manual:

1. Buka https://aistudio.google.com/app/prompts/new_chat
2. Login dengan akun yang sama
3. Ketik pertanyaan test
4. Jika bisa chat → API key valid
5. Jika tidak bisa → API key bermasalah, buat baru

---

## 📞 Jika Masih Bermasalah

Kirim informasi berikut:

1. **Screenshot error** dari Console (F12)
2. **Screenshot file .env** (sensor API key jika perlu)
3. **Output terminal** saat `npm run dev`
4. **Browser & versi** yang digunakan

---

## 🔧 Quick Fix Commands

```powershell
# Stop semua
Ctrl+C

# Clean install (jika perlu)
rm -r node_modules
npm install

# Restart server
npm run dev

# Hard refresh browser
Ctrl+Shift+R
```

---

## ✅ Expected Behavior (Normal)

Saat chatbot bekerja dengan benar:

1. **Console menunjukkan:**
   ```
   🤖 Gemini API Call: {mode: "consultation", ...}
   📤 Sending to Gemini: bagaimana cara perawatan diare
   ✅ Gemini Response received: ...
   ```

2. **Di UI:**
   - Tidak ada warning kuning
   - Pertanyaan muncul (biru)
   - Loading indicator (3 dots)
   - Respons AI muncul (abu-abu)
   - Tidak ada error merah

3. **Timeline:**
   - Send: 0 detik
   - Loading: 2-5 detik
   - Response: Muncul lengkap

---

## 🎉 Success Indicators

✅ Warning kuning HILANG
✅ Console log menunjukkan API call success
✅ Chatbot merespons dalam 2-5 detik
✅ Tidak ada error merah
✅ Response informatif dan relevan

---

**Mari coba langkah-langkah di atas dan beri tahu hasilnya!** 🚀
