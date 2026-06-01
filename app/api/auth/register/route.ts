import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { sendVerificationEmail } from "@/lib/resend";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

// Module-level rate limiting map
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitTime = 15 * 60 * 1000; // 15 minutes
  const limitCount = 5;

  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + limitTime });
    return true;
  }

  if (now > record.resetAt) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, resetAt: now + limitTime });
    return true;
  }

  if (record.count >= limitCount) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again after 15 minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, name, password } = result.data;
    const lowerEmail = email.toLowerCase();

    // Check uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    // Hash & Create user
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    await prisma.user.create({
      data: {
        email: lowerEmail,
        name,
        hashedPassword,
        verificationToken,
        emailVerified: true,
        plan: "FREE",
      },
    });

    // Send verification email asynchronously so registration returns immediately
    // sendVerificationEmail(lowerEmail, verificationToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred during registration." },
      { status: 500 }
    );
  }
}
