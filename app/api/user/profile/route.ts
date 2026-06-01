import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validators";
import bcryptjs from "bcryptjs";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();

    // Check if password change attempt
    if (body.currentPassword || body.newPassword) {
      const result = changePasswordSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Validation error", details: result.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      const { currentPassword, newPassword } = result.data;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.hashedPassword) {
        return NextResponse.json({ error: "User password profile mismatch" }, { status: 400 });
      }

      // Check current password
      const isValid = await bcryptjs.compare(currentPassword, user.hashedPassword);
      if (!isValid) {
        return NextResponse.json({ error: "Current password provided is incorrect." }, { status: 400 });
      }

      // Hash and update
      const newHashed = await bcryptjs.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { hashedPassword: newHashed },
      });

      return NextResponse.json({ success: true, message: "Password updated successfully." });
    }

    // Otherwise standard profile update
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation error", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, niche, brandVoice } = result.data;
    const lowerEmail = email.toLowerCase();

    // Check if email already in use by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ error: "This email address is already in use." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email: lowerEmail,
        niche: niche || "General Creator",
        brandVoice: brandVoice || "Friendly",
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan,
        niche: updatedUser.niche,
        brandVoice: updatedUser.brandVoice,
      },
    });
  } catch (error) {
    console.error("PUT profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile details." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // Delete user account - Cascade delete is configured on db models, 
    // meaning subscriptions and messages will automatically clear.
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE profile error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting your account." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        niche: true,
        brandVoice: true,
        plan: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}
