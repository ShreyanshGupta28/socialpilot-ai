import OpenAI from "openai";
import { prisma } from "./prisma";
import { format } from "date-fns";

export const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export class UsageLimitError extends Error {
  constructor(message = "Daily usage limit reached. Please upgrade to Premium.") {
    super(message);
    this.name = "UsageLimitError";
  }
}

export async function checkAndIncrementUsage(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      dailyCount: true,
      dailyReset: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const lastResetStr = format(user.dailyReset, "yyyy-MM-dd");

  let currentCount = user.dailyCount;

  if (todayStr !== lastResetStr) {
    // It's a new day, reset the count
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyCount: 1,
        dailyReset: new Date(),
      },
    });
    return;
  }

  // Same day. Check if the user is on FREE plan and exceeded limit
  if (user.plan === "FREE" && currentCount >= 30) {
    throw new UsageLimitError();
  }

  // Increment usage count
  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyCount: {
        increment: 1,
      },
    },
  });
}
