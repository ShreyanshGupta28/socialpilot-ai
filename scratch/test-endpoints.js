const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env");
let geminiKey = "";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/^GEMINI_API_KEY=["']?(.*?)["']?$/m);
  if (match) {
    geminiKey = match[1];
  }
}

if (!geminiKey) {
  console.error("No GEMINI_API_KEY found in .env");
  process.exit(1);
}

console.log("--------------------------------------------------");
console.log("Diagnosing Gemini API Endpoints & Key Validity...");
console.log("--------------------------------------------------");
console.log(`Using Key: "${geminiKey}"\n`);

async function testNativeModels() {
  console.log("[1] Testing Native Models List API...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok) {
      console.log("✔ Native Models List API: SUCCESS!");
      const models = data.models ? data.models.map(m => m.name.replace("models/", "")) : [];
      console.log("Available Models:", models.slice(0, 10));
      return models;
    } else {
      console.log(`❌ Native Models List API failed (Status: ${res.status}):`, data);
    }
  } catch (err) {
    console.error("❌ Native Models List API error:", err.message);
  }
  return null;
}

async function testNativeGenerateContent() {
  console.log("\n[2] Testing Native GenerateContent API...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say 'Hello from Gemini' in 3 words." }] }]
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log("✔ Native GenerateContent API: SUCCESS!");
      console.log("Response:", data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
    } else {
      console.log(`❌ Native GenerateContent API failed (Status: ${res.status}):`, data);
    }
  } catch (err) {
    console.error("❌ Native GenerateContent API error:", err.message);
  }
}

async function testOpenAICompatibilityHeader() {
  console.log("\n[3] Testing OpenAI-compatible Chat Completions with Bearer Header...");
  const url = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${geminiKey}`
      },
      body: JSON.stringify({
        model: "gemini-1.5-flash",
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    let data;
    try { data = await res.json(); } catch(e) {}
    if (res.ok) {
      console.log("✔ OpenAI Bearer Header: SUCCESS!");
      console.log("Response:", data.choices?.[0]?.message?.content?.trim());
    } else {
      console.log(`❌ OpenAI Bearer Header failed (Status: ${res.status}):`, data || "(No JSON body)");
    }
  } catch (err) {
    console.error("❌ OpenAI Bearer Header error:", err.message);
  }
}

async function testOpenAICompatibilityQuery() {
  console.log("\n[4] Testing OpenAI-compatible Chat Completions with Query Key...");
  const url = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions?key=${geminiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemini-1.5-flash",
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    let data;
    try { data = await res.json(); } catch(e) {}
    if (res.ok) {
      console.log("✔ OpenAI Query Key: SUCCESS!");
      console.log("Response:", data.choices?.[0]?.message?.content?.trim());
    } else {
      console.log(`❌ OpenAI Query Key failed (Status: ${res.status}):`, data || "(No JSON body)");
    }
  } catch (err) {
    console.error("❌ OpenAI Query Key error:", err.message);
  }
}

async function run() {
  await testNativeModels();
  await testNativeGenerateContent();
  await testOpenAICompatibilityHeader();
  await testOpenAICompatibilityQuery();
}

run();
