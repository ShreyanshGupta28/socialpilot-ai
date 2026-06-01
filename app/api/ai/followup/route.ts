import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { contactId } = body;

    if (!contactId) {
      return NextResponse.json({ error: "Contact ID is required." }, { status: 400 });
    }

    // Fetch CRM Lead Details
    const lead = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!lead || lead.userId !== userId) {
      return NextResponse.json({ error: "Lead not found or unauthorized." }, { status: 404 });
    }

    // Fetch User niche and brandVoice settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { niche: true, brandVoice: true },
    });
    const niche = user?.niche || "General Creator";
    const brandVoice = user?.brandVoice || "Friendly";

    const systemPrompt = `
      You are an elite talent manager and PR expert for content creators.
      Your task is to write a highly persuasive, professional follow-up sponsorship email/DM on behalf of a creator in the **${niche}** niche with a **${brandVoice}** brand voice.
      
      Analyze the brand details and negotiation context:
      - Brand Name: "${lead.name}"
      - Current Stage: "${lead.status}"
      - Historic Notes: "${lead.notes || "No historic notes"}"
      
      Compose a compelling follow-up pitch designed to revive interest, discuss content deliverables, and close the deal. 
      Do not invent stats, deliverables, or prices that are not mentioned in the notes.
      
      You MUST respond with a valid, clean JSON object ONLY. Do not write markdown, code blocks, or explanations outside the JSON.
      
      The JSON structure MUST have these exact keys:
      {
        "followupMessage": "Bespoke follow-up email/message body matching the brandVoice and niche context...",
        "suggestedDelayDays": <number of days, e.g. 3 or 5 or 7>,
        "rationale": "1-sentence marketing explanation for this delay and communication angle."
      }
    `;

    const userPrompt = `
      Generate the follow-up pitch for:
      - Brand: "${lead.name}"
      - Notes Context: "${lead.notes || ""}"
    `;

    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      response_format: { type: "json_object" },
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const rawJson = completion.choices[0].message.content || "{}";
    const parsedResult = JSON.parse(rawJson);

    return NextResponse.json({
      success: true,
      ...parsedResult,
    });
  } catch (error: any) {
    console.error("AI Follow-up route error:", error);
    return NextResponse.json(
      { error: "AI_GENERATION_FAILED", details: error.message || "Failed to generate follow-up." },
      { status: 500 }
    );
  }
}
