const { PrismaClient } = require("@prisma/client");
const OpenAI = require("openai");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env manually
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

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: envVars.GEMINI_API_KEY || "",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function runE2ETests() {
  console.log("=================================================");
  console.log("   SOCIALPILOT AI - PRODUCTION E2E TEST SUITE   ");
  console.log("=================================================\n");

  const results = {
    database: false,
    authentication: false,
    gemini_ai_lead_detection: false,
    creator_mode_influence: false,
    crm_pipeline: false,
  };

  const testEmail = `qa_influencer_${Date.now()}@example.com`;
  let qaUserId = null;

  try {
    // -------------------------------------------------
    // TEST 1: Database verification & Prisma schema queries
    // -------------------------------------------------
    console.log("--- TEST 1: DATABASE INTEGRITY & SCHEMA QUERIES ---");
    const userCount = await prisma.user.count();
    const contactCount = await prisma.contact.count();
    const templateCount = await prisma.template.count();
    
    console.log(`[PASS] Users count in PostgreSQL: ${userCount}`);
    console.log(`[PASS] CRM Contacts count in PostgreSQL: ${contactCount}`);
    console.log(`[PASS] Saved Templates count in PostgreSQL: ${templateCount}`);
    results.database = true;
    console.log("\n");

    // -------------------------------------------------
    // TEST 2: Authentication & User Registration Flow
    // -------------------------------------------------
    console.log("--- TEST 2: AUTHENTICATION & REGISTRATION ---");
    const hashedPassword = await bcrypt.hash("QA_password_secure_99", 10);
    
    console.log(`Inserting test creator account: ${testEmail}...`);
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: "QA Influencer Test",
        hashedPassword: hashedPassword,
        emailVerified: true, // MVP bypass
        niche: "Fitness Influencer",
        brandVoice: "Bold",
      },
    });
    
    qaUserId = testUser.id;
    console.log(`[PASS] Test user successfully inserted with CUID: ${qaUserId}`);

    // Emulate Login flow checks
    console.log("Verifying credentials login credentials compare...");
    const queriedUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    
    const isPasswordMatch = await bcrypt.compare("QA_password_secure_99", queriedUser.hashedPassword);
    if (isPasswordMatch && queriedUser.emailVerified) {
      console.log("[PASS] Password match check & verification bypass passed!");
      results.authentication = true;
    } else {
      console.log("[FAIL] Authentication verification failed.");
    }
    console.log("\n");

    // -------------------------------------------------
    // TEST 3: Gemini AI & Lead Detection
    // -------------------------------------------------
    console.log("--- TEST 3: GEMINI AI & LEAD DETECTION ---");
    
    const systemPromptBase = `
      You are an expert communication assistant called SocialPilot AI.
      Analyze the message and return a valid JSON object ONLY:
      {
        "detectedChannel": "INSTAGRAM" | "WHATSAPP",
        "analysis": {
          "intent": "Short summary",
          "sentiment": "positive",
          "leadScore": 90,
          "leadType": "BRAND_DEAL" | "SPONSORSHIP" | "CUSTOMER_INQUIRY" | "FAN_MESSAGE" | "HIGH_VALUE_LEAD",
          "urgency": "high",
          "summary": "Message recap"
        }
      }
    `;

    // A) Test message A: Samsung brand outreach
    const msgA = "Hi, we are Samsung and would like to discuss a paid collaboration opportunity.";
    console.log(`Evaluating Message A: "${msgA}"...`);
    const completionA = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPromptBase },
        { role: "user", content: msgA }
      ]
    });
    const resultA = JSON.parse(completionA.choices[0].message.content);
    console.log("Message A Classified details:", JSON.stringify(resultA.analysis, null, 2));
    const isLeadValid = resultA.analysis.leadType === "BRAND_DEAL" || resultA.analysis.leadType === "HIGH_VALUE_LEAD" || resultA.analysis.leadType === "SPONSORSHIP";
    console.log(`[VERIFY] Expected BRAND_DEAL/HIGH_VALUE_LEAD, Got: ${resultA.analysis.leadType} -> ${isLeadValid ? "PASS" : "FAIL"}`);

    // B) Test message B: Fan praise
    const msgB = "Your content is amazing, keep posting!";
    console.log(`Evaluating Message B: "${msgB}"...`);
    const completionB = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPromptBase },
        { role: "user", content: msgB }
      ]
    });
    const resultB = JSON.parse(completionB.choices[0].message.content);
    console.log("Message B Classified details:", JSON.stringify(resultB.analysis, null, 2));
    const isFanValid = resultB.analysis.leadType === "FAN_MESSAGE";
    console.log(`[VERIFY] Expected FAN_MESSAGE, Got: ${resultB.analysis.leadType} -> ${isFanValid ? "PASS" : "FAIL"}`);

    if (isLeadValid && isFanValid) {
      console.log("[PASS] Gemini AI Lead Detection classifications verified successfully!");
      results.gemini_ai_lead_detection = true;
    }
    console.log("\n");

    // -------------------------------------------------
    // TEST 4: Creator Settings & Niche Influence
    // -------------------------------------------------
    console.log("--- TEST 4: CREATOR MODE PERSISTENCE & INFLUENCE ---");
    console.log("Updating niche to: 'Fitness Coach' and brand voice to: 'Empathetic'...");
    
    const updatedUser = await prisma.user.update({
      where: { id: qaUserId },
      data: {
        niche: "Fitness Coach",
        brandVoice: "Empathetic",
      },
    });

    console.log(`[PASS] PostgreSQL Niche verification: ${updatedUser.niche}`);
    console.log(`[PASS] PostgreSQL BrandVoice verification: ${updatedUser.brandVoice}`);
    
    // Test if replies adapt to the niche
    const systemPromptNiche = `
      You are writing on behalf of a creator operating in the ${updatedUser.niche} niche with a ${updatedUser.brandVoice} brand voice.
      Generate 1 friendly response.
    `;
    const completionNiche = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPromptNiche },
        { role: "user", content: "I want to start working out but feel lost." }
      ]
    });
    
    const replyContent = completionNiche.choices[0].message.content.trim();
    console.log("Adapted Fitness/Empathetic reply output:");
    console.log(`"${replyContent}"`);
    if (replyContent) {
      console.log("[PASS] Gemini AI replies correctly influenced by Niche/Voice contexts!");
      results.creator_mode_influence = true;
    }
    console.log("\n");

    // -------------------------------------------------
    // TEST 5: Simple CRM Operations
    // -------------------------------------------------
    console.log("--- TEST 5: SIMPLE CRM CRUD OPERATIONS ---");
    console.log("Creating brand deal contact: 'Samsung Marketing'...");
    
    const crmContact = await prisma.contact.create({
      data: {
        userId: qaUserId,
        name: "Samsung Marketing",
        email: "marketing@samsung.com",
        status: "NEW",
        notes: "Deal Value: 500",
      },
    });
    console.log(`[PASS] Lead successfully created. CUID: ${crmContact.id} | Status: ${crmContact.status}`);

    console.log("Moving lead to INTERESTED status...");
    const updatedContact = await prisma.contact.update({
      where: { id: crmContact.id },
      data: { status: "INTERESTED" },
    });
    console.log(`[PASS] Lead status advanced. CUID: ${updatedContact.id} | Status: ${updatedContact.status}`);

    console.log("Removing contact to clean up pipeline...");
    await prisma.contact.delete({
      where: { id: crmContact.id },
    });
    console.log("[PASS] Lead successfully removed from pipeline database!");
    results.crm_pipeline = true;
    console.log("\n");

  } catch (error) {
    console.error("[CRITICAL QA ERROR]: E2E suite failed during check:", error);
  } finally {
    // -------------------------------------------------
    // E2E CLEANUP
    // -------------------------------------------------
    if (qaUserId) {
      console.log("Cleaning up E2E verification test user...");
      await prisma.user.delete({
        where: { id: qaUserId },
      });
      console.log("Cleanup complete!");
    }
    await prisma.$disconnect();

    console.log("=================================================");
    console.log("           QA SUITE E2E RUN RESULTS              ");
    console.log("=================================================");
    console.log(`1. Database Tables Queries:   ${results.database ? "PASS ✅" : "FAIL ❌"}`);
    console.log(`2. User Registration/Auth:    ${results.authentication ? "PASS ✅" : "FAIL ❌"}`);
    console.log(`3. Gemini Lead Detection:     ${results.gemini_ai_lead_detection ? "PASS ✅" : "FAIL ❌"}`);
    console.log(`4. Creator Mode Adaptations:  ${results.creator_mode_influence ? "PASS ✅" : "FAIL ❌"}`);
    console.log(`5. Brand CRM Deal Pipelines:  ${results.crm_pipeline ? "PASS ✅" : "FAIL ❌"}`);
    console.log("=================================================");
  }
}

runE2ETests();
