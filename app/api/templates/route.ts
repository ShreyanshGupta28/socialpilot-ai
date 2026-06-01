import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const templates = await prisma.template.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, templates });
  } catch (error) {
    console.error("GET templates error:", error);
    return NextResponse.json({ error: "Failed to fetch templates." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { name, category, content } = body;

    if (!name || !category || !content) {
      return NextResponse.json({ error: "Name, category, and content are required." }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        userId,
        name,
        category,
        content,
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error("POST template error:", error);
    return NextResponse.json({ error: "Failed to create template." }, { status: 500 });
  }
}
