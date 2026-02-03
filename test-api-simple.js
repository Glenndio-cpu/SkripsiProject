import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCTcjtD3XvzKlNFXsrFNfEK5WV2cWWrIWc";

console.log("=== TESTING GEMINI API ===");
console.log("API Key:", apiKey ? `${apiKey.substring(0, 20)}...` : "NOT FOUND");

async function testAPI() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log("\nSending test message...");
    const result = await model.generateContent("Halo, siapa kamu?");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ SUCCESS! Response:", text);
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("Full error:", error);
  }
}

testAPI();
