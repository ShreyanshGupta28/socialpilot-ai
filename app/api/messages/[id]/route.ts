import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const messageId = params.id;

  try {
    const body = await request.json();
    const { field, value } = body;

    if (field !== "isSaved" && field !== "isFavorite") {
      return NextResponse.json({ error: "Invalid field edit request" }, { status: 400 });
    }

    // Verify ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.userId !== userId) {
      return NextResponse.json({ error: "Message not found or forbidden" }, { status: 403 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        [field]: !!value,
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("PATCH message error:", error);
    return NextResponse.json(
      { error: "Failed to update message details." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const messageId = params.id;

  try {
    // Verify ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.userId !== userId) {
      return NextResponse.json({ error: "Message not found or forbidden" }, { status: 403 });
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json(
      { error: "Failed to delete message record." },
      { status: 500 }
    );
  }
}
