import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDqyJS7p-j4kmkWeDwx9zaya7P0Or4McoY";

console.log("=== LISTING AVAILABLE MODELS ===");
console.log("API Key:", apiKey ? `${apiKey.substring(0, 20)}...` : "NOT FOUND");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to fetch via REST API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ API Error:", data);
      return;
    }
    
    console.log("\n✅ Available models:");
    data.models.forEach(model => {
      console.log(`  - ${model.name} (${model.displayName})`);
    });
    
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

listModels();
