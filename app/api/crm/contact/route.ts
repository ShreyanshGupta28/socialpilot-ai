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
    const contacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error("GET contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch CRM contacts." }, { status: 500 });
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
    const { name, handle, email, status, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Contact name is required." }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        userId,
        name,
        handle: handle || null,
        email: email || null,
        status: status || "NEW",
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("POST contact error:", error);
    return NextResponse.json({ error: "Failed to create CRM contact." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { id, status, notes, name, handle, email } = body;

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required." }, { status: 400 });
    }

    // Verify contact ownership
    const existing = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Contact not found or unauthorized." }, { status: 404 });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        status: status !== undefined ? status : existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        name: name !== undefined ? name : existing.name,
        handle: handle !== undefined ? handle : existing.handle,
        email: email !== undefined ? email : existing.email,
        lastInteraction: new Date(),
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("PUT contact error:", error);
    return NextResponse.json({ error: "Failed to update CRM contact." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required." }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Contact not found or unauthorized." }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE contact error:", error);
    return NextResponse.json({ error: "Failed to delete CRM contact." }, { status: 500 });
  }
}
