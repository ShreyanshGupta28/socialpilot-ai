import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const templateId = params.id;

  try {
    const body = await request.json();
    const { name, category, content } = body;

    // Verify ownership
    const existing = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Template not found or unauthorized." }, { status: 404 });
    }

    const updated = await prisma.template.update({
      where: { id: templateId },
      data: {
        name: name !== undefined ? name : existing.name,
        category: category !== undefined ? category : existing.category,
        content: content !== undefined ? content : existing.content,
      },
    });

    return NextResponse.json({ success: true, template: updated });
  } catch (error) {
    console.error("PUT template error:", error);
    return NextResponse.json({ error: "Failed to update template." }, { status: 500 });
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
  const templateId = params.id;

  try {
    // Verify ownership
    const existing = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Template not found or unauthorized." }, { status: 404 });
    }

    await prisma.template.delete({
      where: { id: templateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE template error:", error);
    return NextResponse.json({ error: "Failed to delete template." }, { status: 500 });
  }
}
