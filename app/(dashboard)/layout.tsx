import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { UpgradeBanner } from "@/components/layout/UpgradeBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch fresh user data to reflect immediate subscription changes
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      plan: true,
      dailyCount: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F0F4FF] font-sans">
      {/* Sidebar for Desktop */}
      <Sidebar user={{ name: user.name, email: user.email, plan: user.plan }} />

      {/* Topbar for Mobile + Top Title */}
      <Topbar user={{ name: user.name, email: user.email, plan: user.plan }} />

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-screen flex flex-col pt-16 pb-16 lg:pb-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Proactive Upgrade Banner */}
          <UpgradeBanner plan={user.plan} />

          {/* Children View Workspace */}
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
