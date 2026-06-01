import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReplySchema } from "@/lib/validators";
import { openai, checkAndIncrementUsage } from "@/lib/openai";

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
    const result = generateReplySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { channel, inputText, selectedTones, context } = result.data;

    // 3. Increment usage count for analytics/daily stats
    await checkAndIncrementUsage(userId);

    // Fetch user niche and brand voice settings
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { niche: true, brandVoice: true },
    });
    const niche = dbUser?.niche || "General Creator";
    const brandVoice = dbUser?.brandVoice || "Friendly";

    // 4. OpenAI ChatGPT query
    const systemPrompt = `
      You are an expert communication assistant called SocialPilot AI, built specifically to help content creators and influencers.
      You are writing on behalf of a creator operating in the **${niche}** niche with a **${brandVoice}** brand voice. 
      Your generated replies MUST automatically adapt to match this creator niche and reflect the brand voice tone guidelines.
      
      Analyze the incoming user message/comment and generate 6 distinct reply options matching specified tones.
      You MUST respond with a valid, clean JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON.
      
      STRICT RESPONSE CONTROLS:
      1. NEVER invent company policies, discounts, pricing, shipping details, or unprovided business facts.
      2. If required business/product context is missing to answer the query, do not make assumptions or fabricate any detail.
      3. Instead, construct responses that politely ask the customer to provide additional information or contact support/sales directly.
      4. Enforce these strict constraints across all tones (friendly, professional, empathetic, bold, witty, direct) and channels.
      
      The JSON structure MUST have these exact keys:
      {
        "detectedChannel": "INSTAGRAM" | "WHATSAPP" | "EMAIL" | "GENERAL",
        "analysis": {
          "intent": "Short summary of user's core intent (e.g. Pricing inquiry, Support request, General greeting)",
          "sentiment": "positive" | "neutral" | "negative",
          "leadScore": <number between 0 and 100 assessing how likely they are to purchase/engage>,
          "leadType": "BRAND_DEAL" | "SPONSORSHIP" | "CUSTOMER_INQUIRY" | "FAN_MESSAGE" | "HIGH_VALUE_LEAD",
          "urgency": "high" | "medium" | "low",
          "summary": "Brief 1-sentence recap of what the inbound message is about"
        },
        "replies": [
          { "tone": "professional", "label": "🏢 Professional", "content": "Professional reply content..." },
          { "tone": "friendly", "name": "friendly", "label": "😊 Friendly", "content": "Friendly reply content..." },
          { "tone": "empathetic", "label": "❤️ Empathetic", "content": "Empathetic reply content..." },
          { "tone": "bold", "label": "🔥 Bold / Sales", "content": "Bold/sales-oriented reply content..." },
          { "tone": "witty", "label": "💡 Witty / Creative", "content": "Witty, humorous, or clever reply content..." },
          { "tone": "direct", "label": "⚡ Direct / Short", "content": "Direct, bulleted or extremely concise reply..." }
        ]
      }

      Keep replies highly contextual to the channel, inbound message, and any supplementary context.
      If special context/policies are provided, incorporate them accurately.
    `;

    const userPrompt = `
      Inbound Channel Specified: ${channel}
      Inbound Message Content: "${inputText}"
      ${context ? `Supplementary Business/Product Context: "${context}"` : ""}
      Tones to prioritize: ${selectedTones.join(", ")}
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
      console.error("OpenAI request failure in Reply Route:", aiError);
      return NextResponse.json(
        { 
          error: "AI_GENERATION_FAILED", 
          details: aiError.message || "Google Gemini API was unable to generate replies. Please verify your GEMINI_API_KEY in .env.",
          status: aiError.status || 500
        },
        { status: 502 }
      );
    }

    // 5. Save database Message record
    const savedMessage = await prisma.message.create({
      data: {
        userId,
        tool: "REPLY_GENERATOR",
        channel: parsedResult.detectedChannel || "GENERAL",
        inputText,
        outputJson: JSON.stringify(parsedResult),
        isSaved: false,
      },
    });

    // 6. Return response + message record id
    return NextResponse.json({
      id: savedMessage.id,
      ...parsedResult,
    });
  } catch (error) {
    console.error("Reply generation route error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating replies." },
      { status: 500 }
    );
  }
}
