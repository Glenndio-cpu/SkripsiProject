// Test API Key Configuration
// Jalankan ini di browser console untuk cek apakah API key terbaca

console.log("=== GEMINI API KEY TEST ===");
console.log("API Key from env:", import.meta.env.VITE_GEMINI_API_KEY);
console.log("API Key exists:", !!import.meta.env.VITE_GEMINI_API_KEY);
console.log("API Key length:", import.meta.env.VITE_GEMINI_API_KEY?.length);
console.log("API Key first 10 chars:", import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10));

// Test simple Gemini call
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("\n=== TESTING GEMINI API ===");

if (!apiKey) {
  console.error("❌ API Key tidak terbaca dari .env!");
  console.log("Pastikan:");
  console.log("1. File .env ada di root project");
  console.log("2. Server sudah di-restart");
  console.log("3. Browser sudah di-hard refresh");
} else {
  console.log("✅ API Key terbaca:", apiKey.substring(0, 15) + "...");
  
  // Test API call
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  console.log("📤 Sending test message to Gemini...");
  
  model.generateContent("Halo, apa kabar?")
    .then(result => {
      const response = result.response;
      const text = response.text();
      console.log("✅ Gemini Response:", text);
      console.log("\n🎉 API KEY BEKERJA DENGAN BAIK!");
    })
    .catch(error => {
      console.error("❌ Error calling Gemini:", error);
      console.error("Error message:", error.message);
      
      if (error.message.includes("API key not valid")) {
        console.log("\n💡 Solusi: API key tidak valid");
        console.log("1. Buka: https://aistudio.google.com/app/apikey");
        console.log("2. Buat API key baru");
        console.log("3. Update di file .env");
        console.log("4. Restart server");
      }
    });
}
