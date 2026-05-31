import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { improveMessageSchema } from "@/lib/validators";
import { openai, checkAndIncrementUsage, UsageLimitError } from "@/lib/openai";

export async function POST(request: Request) {
  // 1. Session verification
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 2. Validate input schema
    const body = await request.json();
    const result = improveMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { inputText, context } = result.data;

    // 3. Usage limit check
    try {
      await checkAndIncrementUsage(userId);
    } catch (usageError) {
      if (usageError instanceof UsageLimitError) {
        return NextResponse.json(
          { error: "LIMIT_EXCEEDED", upgradeUrl: "/billing" },
          { status: 402 }
        );
      }
      throw usageError;
    }

    // 4. OpenAI ChatGPT query
    const systemPrompt = `
      You are an expert copywriter and editor for SocialPilot AI.
      Optimize the user's rough text draft and generate 4 refined, distinct versions of it, along with 3-4 constructive tips/suggestions for improvement.
      You MUST respond with a valid, clean JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON.
      
      STRICT RESPONSE CONTROLS:
      1. NEVER invent company policies, discounts, pricing, shipping details, or unprovided business facts.
      2. If required business/product context is missing, do not make assumptions or fabricate any detail. Keep refined drafts strictly grounded in the user's rough text and supplied guidelines.
      3. If important facts or details are missing to improve the text adequately, construct refined versions that instruct the user to verify facts or ask the reader to contact support/provide details instead of guessing.
      4. Enforce these strict controls across all modes (professional, friendly, sales, short).
      
      The JSON structure MUST have these exact keys:
      {
        "versions": [
          { "mode": "professional", "label": "🏢 Professional & Polished", "content": "Refined professional message..." },
          { "mode": "friendly", "label": "😊 Warm & Friendly", "content": "Refined warm/friendly message..." },
          { "mode": "sales", "label": "🔥 Persuasive / Sales", "content": "Refined high-converting or bold message..." },
          { "mode": "short", "label": "⚡ Short & Concise", "content": "Extremely direct or short message..." }
        ],
        "suggestions": [
          "Tip 1: e.g., Replace passive voice with active verbs to increase engagement.",
          "Tip 2: e.g., Softened the introductory apology to project more confidence.",
          "Tip 3: e.g., Added a clear single Call-To-Action (CTA) at the bottom."
        ]
      }

      Keep versions highly contextual to any supplementary guidelines or target goals provided.
    `;

    const userPrompt = `
      Rough Draft to Improve: "${inputText}"
      ${context ? `Special Guidelines / Target Goals: "${context}"` : ""}
    `;

    let parsedResult;
    try {
      const completion = await openai.chat.completions.create({
        model: "gemini-2.5-flash",
        response_format: { type: "json_object" },
        max_tokens: 2000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const rawJson = completion.choices[0].message.content || "{}";
      parsedResult = JSON.parse(rawJson);
    } catch (aiError: any) {
      console.error("OpenAI request failure in Message Improver Route:", aiError);
      return NextResponse.json(
        { 
          error: "AI_GENERATION_FAILED", 
          details: aiError.message || "Google Gemini API was unable to refine your draft. Please verify your GEMINI_API_KEY in .env.",
          status: aiError.status || 500
        },
        { status: 502 }
      );
    }

    const savedMessage = await prisma.message.create({
      data: {
        userId,
        tool: "MESSAGE_IMPROVER",
        channel: "GENERAL",
        inputText,
        outputJson: JSON.stringify(parsedResult),
        isSaved: false,
      },
    });
    // 6. Return response
    return NextResponse.json({
      id: savedMessage.id,
      ...parsedResult,
    });
  } catch (error) {
    console.error("Improve message route error:", error);
    return NextResponse.json(
      { error: "An error occurred while refining message." },
      { status: 500 }
    );
  }
}
