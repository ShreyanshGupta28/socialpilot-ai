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
    const { searchParams } = new URL(request.url);
    const savedParam = searchParams.get("saved");
    const toolParam = searchParams.get("tool");
    const searchParam = searchParams.get("search");

    const where: any = { userId };

    if (savedParam === "true") {
      where.isSaved = true;
    }

    if (toolParam === "REPLY_GENERATOR" || toolParam === "MESSAGE_IMPROVER") {
      where.tool = toolParam;
    }

    if (searchParam) {
      where.inputText = {
        contains: searchParam,
        mode: "insensitive",
      };
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages route error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve messages from database." },
      { status: 500 }
    );
  }
}
