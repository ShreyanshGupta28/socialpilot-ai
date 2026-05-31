const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const envPath = path.resolve(__dirname, "../.env");
let geminiKey = "";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/^GEMINI_API_KEY=["']?(.*?)["']?$/m);
  if (match) {
    geminiKey = match[1];
  }
}

const openai = new OpenAI({
  apiKey: geminiKey || "",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function runTest() {
  console.log("Initiating completions request using gemini-2.5-flash...");
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Gemini Active' in exactly two words." },
      ],
      max_tokens: 50,
    });

    console.log("\n🎉 SUCCESS! Gemini API returned a response:");
    console.log("--------------------------------------------------");
    console.log(completion.choices[0].message.content.trim());
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("\n❌ Request failed:", error.message);
  }
}

runTest();
