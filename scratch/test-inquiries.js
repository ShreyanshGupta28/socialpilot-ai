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

if (!geminiKey || geminiKey === "PASTE_KEY_HERE") {
  console.error("Please configure your GEMINI_API_KEY in .env before running this test.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: geminiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const systemPrompt = `
  You are an expert communication assistant called SocialPilot AI.
  Analyze the incoming user message/comment and generate 6 distinct reply options matching specified tones.
  You MUST respond with a valid, clean JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON.
  
  STRICT RESPONSE CONTROLS:
  1. NEVER invent company policies, discounts, pricing, shipping details, or unprovided business facts.
  2. If required business/product context is missing, do not make assumptions or fabricate any detail.
  3. Instead, construct responses that politely ask the customer to provide additional information or contact support/sales directly.
  4. Enforce these strict constraints across all tones (friendly, professional, empathetic, bold, witty, direct) and channels.
  
  The JSON structure MUST have these exact keys:
  {
    "detectedChannel": "INSTAGRAM" | "WHATSAPP" | "EMAIL" | "GENERAL",
    "analysis": {
      "intent": "Short summary of user's core intent (e.g. Pricing inquiry, Support request, General greeting)",
      "sentiment": "positive" | "neutral" | "negative",
      "leadScore": 0-100,
      "urgency": "high" | "medium" | "low",
      "summary": "Brief 1-sentence recap of what the inbound message is about"
    },
    "replies": [
      { "tone": "professional", "label": "🏢 Professional", "content": "Professional reply content..." },
      { "tone": "friendly", "label": "😊 Friendly", "content": "Friendly reply content..." },
      { "tone": "empathetic", "label": "❤️ Empathetic", "content": "Empathetic reply content..." },
      { "tone": "bold", "label": "🔥 Bold / Sales", "content": "Bold/sales-oriented reply content..." },
      { "tone": "witty", "label": "💡 Witty", "content": "Witty reply..." },
      { "tone": "direct", "label": "⚡ Direct / Short", "content": "Direct reply..." }
    ]
  }
`;

const testCases = [
  {
    name: "Refund Request",
    inputText: "I bought your app yesterday but it keeps crashing. I want a full refund immediately! 😡",
    channel: "AUTO",
    context: "" // Missing company refund policy context! Should trigger strict controls
  },
  {
    name: "Sales Lead",
    inputText: "Hi! We have a team of 50 people looking for custom pricing. Do you offer bulk discounts? 🚀",
    channel: "WHATSAPP",
    context: "Custom pricing is handled exclusively by sales. We do not have pre-defined public corporate rates."
  },
  {
    name: "Emoji/Special Characters",
    inputText: "こんにちは! Custom service is outstanding. 👍✨ Is this available in Japan? 🇯🇵",
    channel: "AUTO",
    context: "Yes, SocialPilot is active globally, including Japan."
  }
];

async function runQATests() {
  console.log("==================================================");
  console.log("SocialPilot AI - QA E2E AI INQUIRY TEST SUITE");
  console.log("==================================================\n");

  for (const test of testCases) {
    console.log(`--- Running E2E Test Case: [${test.name}] ---`);
    console.log(`Inbound Content: "${test.inputText}"`);
    console.log(`Supplied Business Context: "${test.context || "(None - testing strict factual grounding)"}"`);
    console.log("Sending query to Gemini-2.5-Flash...");
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Inbound Channel Specified: ${test.channel}\nInbound Message Content: "${test.inputText}"\nSupplementary Business/Product Context: "${test.context}"\nTones to prioritize: professional, friendly, empathetic, bold, witty, direct` }
        ]
      });

      const rawJson = completion.choices[0].message.content || "{}";
      const parsed = JSON.parse(rawJson);
      
      console.log("✔ Detected Channel:", parsed.detectedChannel);
      console.log("✔ Intent Summary:", parsed.analysis.intent);
      console.log("✔ Sentiment Analysis:", parsed.analysis.sentiment);
      console.log("✔ Lead Score:", parsed.analysis.leadScore);
      console.log("✔ Urgency Level:", parsed.analysis.urgency);
      console.log("✔ Brief Recap:", parsed.analysis.summary);
      console.log("✔ Generated Tones Count:", parsed.replies.length);
      console.log("\nSample Generated Replies:");
      console.log(` - [Professional]: "${parsed.replies.find(r => r.tone === 'professional')?.content}"`);
      console.log(` - [Friendly]: "${parsed.replies.find(r => r.tone === 'friendly')?.content}"`);
      console.log(` - [Empathetic]: "${parsed.replies.find(r => r.tone === 'empathetic')?.content}"\n`);
      
    } catch (error) {
      console.error(`❌ Test Case [${test.name}] Failed:`, error.message);
    }
  }
}

runQATests();
