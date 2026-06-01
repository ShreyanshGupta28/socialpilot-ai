import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UsageBar } from "@/components/shared/UsageBar";
import { CopyButton } from "@/components/shared/CopyButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ActivitySearch } from "@/components/shared/ActivitySearch";
import { getGreeting } from "@/lib/utils";
import {
  MessageSquareReply,
  PenTool,
  Bookmark,
  Zap,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Run three database queries in parallel
  const [totalCount, savedCount, recentMessages, dbUser] = await Promise.all([
    prisma.message.count({ where: { userId } }),
    prisma.message.count({ where: { userId, isSaved: true } }),
    prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, dailyCount: true, name: true },
    }),
  ]);

  const userPlan = dbUser?.plan || "FREE";
  const userCount = dbUser?.dailyCount || 0;

  return (
    <div className="space-y-8 text-[#334155]">
      {/* Welcoming Dashboard Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#F9A8D4]/25 bg-gradient-to-r from-[#A78BFA]/10 via-[#F9A8D4]/10 to-[#FDBA74]/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm shadow-[#A78BFA]/5">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#F9A8D4]/20 to-[#FDBA74]/20 blur-xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#334155] tracking-wide">
            Welcome to your Creator Studio, {dbUser?.name || "Aanya"} ✨
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Manage collaborations, templates, opportunities, and creator communications in one beautiful place.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link
            href="/reply"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-violet-600/20 cursor-pointer font-syne"
          >
            New Reply
            <MessageSquareReply className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total generations count card */}
        <Card hoverEffect className="bg-white/5 border border-white/10 shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted block uppercase tracking-wider font-semibold">
                Total Generations
              </span>
              <span className="text-3xl font-extrabold font-syne text-white block">
                {totalCount}
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <Zap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Saved reply templates count card */}
        <Card hoverEffect className="bg-white/5 border border-white/10 shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted block uppercase tracking-wider font-semibold">
                Saved Templates
              </span>
              <span className="text-3xl font-extrabold font-syne text-white block">
                {savedCount}
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-[#5C6BC0]">
              <Bookmark className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Credit Tracker usage card */}
        <Card hoverEffect className="bg-white/5 border border-white/10 shadow-md">
          <CardContent className="p-6">
            <UsageBar count={userCount} plan={userPlan} />
          </CardContent>
        </Card>
      </div>

      {/* Middle Workspace quick tools row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Reply tool card */}
        <Card hoverEffect className="bg-gradient-to-br from-[#0E1528] to-[#0A0F1E] border border-white/10 relative overflow-hidden group shadow-lg">
          <div className="absolute right-0 top-0 -mt-3 -mr-3 h-20 w-20 rounded-full bg-violet-600/10 blur-lg pointer-events-none group-hover:scale-125 transition-transform" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
                <MessageSquareReply className="h-5 w-5" />
              </div>
              <h3 className="font-syne font-bold text-lg text-white tracking-wide">
                AI Reply Generator
              </h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Paste customer support tickets, Instagram story replies, or emails. Generate 6 distinct tone options, analyze customer sentiment, and customize settings.
            </p>
            <Link
              href="/reply"
              className="inline-flex items-center gap-1.5 text-xs font-bold font-syne tracking-wider text-violet-600 hover:text-violet-500 transition-colors uppercase pt-2"
            >
              Enter Creator Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Improver tool card */}
        <Card hoverEffect className="bg-gradient-to-br from-[#0E1528] to-[#0A0F1E] border border-white/10 relative overflow-hidden group shadow-lg">
          <div className="absolute right-0 top-0 -mt-3 -mr-3 h-20 w-20 rounded-full bg-indigo-600/10 blur-lg pointer-events-none group-hover:scale-125 transition-transform" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#5C6BC0] flex items-center justify-center text-white">
                <PenTool className="h-5 w-5" />
              </div>
              <h3 className="font-syne font-bold text-lg text-white tracking-wide">
                AI Message Improver
              </h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Refine rough draft message concepts. Choose among Professional, Friendly, Sales, or Concise versions, and review instant copywriter tips to improve engagement.
            </p>
            <Link
              href="/improve"
              className="inline-flex items-center gap-1.5 text-xs font-bold font-syne tracking-wider text-[#A78BFA] hover:text-[#F9A8D4] transition-colors uppercase pt-2"
            >
              Enter Creator Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Recent activity log list with Real-time Search */}
      <div className="pt-4">
        <ActivitySearch initialMessages={recentMessages} />
      </div>
    </div>
  );
}
