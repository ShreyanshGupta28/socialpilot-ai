const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

// Manually load .env variables
const envPath = path.join(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    let val = parts.slice(1).join("=").trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }
});

const apiKey = envVars.GEMINI_API_KEY || "";
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function main() {
  console.log("Testing Google Gemini API connectivity...");
  console.log("Model: gemini-2.5-flash");
  
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found in .env file!");
    process.exit(1);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Hello World' and explain who you are in one short sentence." }
      ],
      max_tokens: 100,
    });

    console.log("Completion response status: SUCCESS");
    console.log("AI Output Content:");
    console.log(completion.choices[0].message.content.trim());
    console.log("GOOGLE GEMINI API VERIFICATION TEST PASSED! 🎉");
  } catch (error) {
    console.error("Gemini query failed with error:", error);
    process.exit(1);
  }
}

main();
