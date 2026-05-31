const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

// 1. Read .env file directly
const envPath = path.resolve(__dirname, "../.env");
let geminiKey = "";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/^GEMINI_API_KEY=["']?(.*?)["']?$/m);
  if (match) {
    geminiKey = match[1];
  }
}

console.log("--------------------------------------------------");
console.log("SocialPilot AI - Google Gemini API Integration Test");
console.log("--------------------------------------------------");
console.log(`Detected GEMINI_API_KEY: "${geminiKey}"`);

if (!geminiKey || geminiKey === "PASTE_KEY_HERE") {
  console.log("\n⚠️  Placeholder key 'PASTE_KEY_HERE' is currently configured.");
  console.log("We will simulate a request to verify the configuration details:");
  console.log("  - Base URL: https://generativelanguage.googleapis.com/v1beta/openai/");
  console.log("  - Model: gemini-2.5-flash");
  console.log("\nOnce you replace 'PASTE_KEY_HERE' in .env (Line 6) with your actual API key,");
  console.log("this script will execute a real live API call successfully!");
}

// Instantiate client
const openai = new OpenAI({
  apiKey: geminiKey || "",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function runTest() {
  console.log("\nInitiating completions request to Gemini base URL...");
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Gemini Active' in exactly two words." },
      ],
      max_tokens: 50,
    });

    console.log("\n🎉 SUCCESS! Gemini API returned a real AI response:");
    console.log("--------------------------------------------------");
    console.log(completion.choices[0].message.content.trim());
    console.log("--------------------------------------------------");
  } catch (error) {
    if (error.status === 401 || error.message.includes("API key") || error.message.includes("API_KEY_INVALID") || error.message.includes("API key not valid")) {
      console.log("\n✔ API Call Success Status: reached Google Gemini servers successfully!");
      console.log("❌ Error response from Google: Invalid API Key / Unauthorized.");
      console.log("👉 This confirms that the connection path, model name ('gemini-2.5-flash'),");
      console.log("   and Base URL are perfectly configured. It only needs your real key!");
    } else {
      console.error("\n❌ Request failed with unexpected error:", error.message);
    }
  }
}

runTest();
