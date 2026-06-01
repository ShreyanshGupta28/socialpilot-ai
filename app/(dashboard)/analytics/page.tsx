import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarChart3, TrendingUp, Compass, Activity, Instagram, MessageSquare, Mail, Layers, Sparkles } from "lucide-react";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 1. Fetch user & message logs
  const [dbUser, messages] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, dailyCount: true },
    }),
    prisma.message.findMany({
      where: { userId },
      select: { tool: true, channel: true, createdAt: true, outputJson: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const plan = dbUser?.plan || "FREE";
  const dailyCount = dbUser?.dailyCount || 0;
  const maxQuota = plan === "FREE" ? 30 : "Unlimited";

  const totalGens = messages.length;
  const replyRuns = messages.filter((m) => m.tool === "REPLY_GENERATOR").length;
  const improveRuns = messages.filter((m) => m.tool === "MESSAGE_IMPROVER").length;

  // 2. Compiling 7-Day Usage Trend
  const last7Days: { dateStr: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    last7Days.push({ dateStr, count: 0 });
  }

  messages.forEach((msg) => {
    const dateStr = new Date(msg.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const item = last7Days.find((x) => x.dateStr === dateStr);
    if (item) {
      item.count++;
    }
  });

  // Calculate highest generation count in a single day for SVG scaling
  const maxDailyVal = Math.max(...last7Days.map((d) => d.count), 5);

  // 3. Compiling Channel Breakdown
  const channels = {
    INSTAGRAM: 0,
    WHATSAPP: 0,
    EMAIL: 0,
    GENERAL: 0,
  };

  messages.forEach((msg) => {
    const ch = msg.channel || "GENERAL";
    if (ch in channels) {
      channels[ch as keyof typeof channels]++;
    } else {
      channels.GENERAL++;
    }
  });

  const totalChannels = Math.max(Object.values(channels).reduce((a, b) => a + b, 0), 1);

  // 4. Compiling Tone Breakdown
  const toneMap: Record<string, number> = {
    professional: 0,
    friendly: 0,
    empathetic: 0,
    bold: 0,
    witty: 0,
    direct: 0,
  };

  messages.forEach((msg) => {
    if (msg.tool === "REPLY_GENERATOR" && msg.outputJson) {
      try {
        const parsed = typeof msg.outputJson === "string" ? JSON.parse(msg.outputJson) : msg.outputJson;
        if (parsed?.replies) {
          parsed.replies.forEach((rep: any) => {
            if (rep.tone in toneMap) {
              toneMap[rep.tone]++;
            }
          });
        }
      } catch (e) {}
    }
  });

  const toneLabels: Record<string, string> = {
    professional: "🏢 Professional",
    friendly: "😊 Friendly",
    empathetic: "❤️ Empathetic",
    bold: "🔥 Bold / Sales",
    witty: "💡 Witty",
    direct: "⚡ Direct",
  };

  // Find most used tone
  let mostUsedToneKey = "None";
  let maxToneCount = 0;
  Object.entries(toneMap).forEach(([tone, count]) => {
    if (count > maxToneCount) {
      maxToneCount = count;
      mostUsedToneKey = tone;
    }
  });

  const mostUsedTone = toneLabels[mostUsedToneKey] || "No Data Yet";

  return (
    <div className="space-y-8 text-[#334155]">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#334155] tracking-wide flex items-center gap-2">
          Creator Insights
          <BarChart3 className="h-7 w-7 text-violet-400" />
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your platform collaborations, response statistics, and channel distribution in one place.
        </p>
      </div>

      {totalGens === 0 ? (
        /* Stunning Premium Creator Insights Empty State */
        <Card className="bg-white border-slate-200 border-dashed border-2 p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[350px] rounded-3xl animate-fade-in">
          <div className="h-14 w-14 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] mb-5 border border-[#A78BFA]/20">
            <BarChart3 className="h-7 w-7 animate-pulse" />
          </div>
          <h4 className="font-syne font-bold text-lg text-[#334155]">
            Your creator insights will grow as you use the platform.
          </h4>
          <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed font-sans">
            Start generating replies or improving your drafts. Your response analytics, channel distribution, and top tone metrics will compile right here!
          </p>
        </Card>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI: Total Generations */}
            <Card hoverEffect className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted block uppercase tracking-wider font-semibold">
                    Creations Run
                  </span>
                  <span className="text-3xl font-extrabold font-syne text-[#334155] block">
                    {totalGens}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                  <Activity className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* KPI: Reply Gen */}
            <Card hoverEffect className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted block uppercase tracking-wider font-semibold">
                    Replies Composed
                  </span>
                  <span className="text-3xl font-extrabold font-syne text-[#334155] block">
                    {replyRuns}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-[#F9A8D4]">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* KPI: Improver */}
            <Card hoverEffect className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted block uppercase tracking-wider font-semibold">
                    Draft Refinements
                  </span>
                  <span className="text-3xl font-extrabold font-syne text-[#334155] block">
                    {improveRuns}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-[#FDBA74]/15 border border-[#FDBA74]/25 flex items-center justify-center text-[#FDBA74]">
                  <Compass className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* KPI: Plan Status */}
            <Card hoverEffect className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted block uppercase tracking-wider font-semibold">
                    Daily Creations Run
                  </span>
                  <span className="text-3xl font-extrabold font-syne text-[#334155] block">
                    {dailyCount} <span className="text-xs text-muted font-normal font-sans">/ {maxQuota}</span>
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                  <Sparkles className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Creator Insights overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Left Panel: SVG Bar Chart Trend (7 cols) */}
        <Card className="bg-gradient-to-br from-[#0E1528] to-[#0A0F1E] border border-white/10 shadow-lg lg:col-span-7">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-syne font-bold text-base text-white tracking-wide">
              Weekly Generation Trend
            </h3>
            
            {/* Custom Responsive SVG Chart */}
            <div className="relative w-full h-[220px]">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                {[0, 1, 2, 3, 4].map((gridIdx) => {
                  const y = 20 + gridIdx * 35;
                  return (
                    <line
                      key={gridIdx}
                      x1="40"
                      y1={y}
                      x2="490"
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Vertical bars */}
                {last7Days.map((day, idx) => {
                  const x = 55 + idx * 60;
                  const barHeight = (day.count / maxDailyVal) * 120;
                  const y = 160 - barHeight;
                  
                  return (
                    <g key={idx} className="group cursor-pointer">
                      {/* Bar Fill */}
                      <rect
                        x={x}
                        y={y}
                        width="30"
                        height={barHeight}
                        rx="4"
                        fill="url(#barGradient)"
                        className="transition-all duration-300 hover:fill-violet-400"
                      />
                      {/* Interactive Value Tooltip */}
                      <text
                        x={x + 15}
                        y={y - 8}
                        fill="#F0F4FF"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {day.count || ""}
                      </text>
                      {/* X Label */}
                      <text
                        x={x + 15}
                        y="180"
                        fill="#94A3B8"
                        fontSize="9"
                        textAnchor="middle"
                      >
                        {day.dateStr}
                      </text>
                    </g>
                  );
                })}

                {/* Axis lines */}
                <line x1="40" y1="160" x2="490" y2="160" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
                
                {/* Color Gradients */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#5C6BC0" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Channels and Tones rollups (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Channel distribution card */}
          <Card className="bg-white/5 border border-white/10 shadow-md">
            <CardContent className="p-6 space-y-5">
              <h3 className="font-syne font-bold text-base text-white tracking-wide flex items-center gap-2">
                Channel Utilization
                <Layers className="h-4.5 w-4.5 text-violet-400" />
              </h3>

              <div className="space-y-4">
                {[
                  { name: "Instagram DMs", count: channels.INSTAGRAM, icon: Instagram, color: "bg-pink-500" },
                  { name: "WhatsApp Chats", count: channels.WHATSAPP, icon: MessageSquare, color: "bg-emerald-500" },
                  { name: "Email Copy", count: channels.EMAIL, icon: Mail, color: "bg-sky-500" },
                  { name: "General Prompts", count: channels.GENERAL, icon: Compass, color: "bg-violet-500" },
                ].map((item, idx) => {
                  const percent = Math.round((item.count / totalChannels) * 100);
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-[#F0F4FF]">
                        <div className="flex items-center gap-2 text-muted">
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-bold">{item.count} ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Tones Summary Card */}
          <Card className="bg-white/5 border border-white/10 shadow-md">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-syne font-bold text-base text-white tracking-wide">
                Audited Tone Insights
              </h3>
              
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                <div className="h-10 w-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                  <Sparkles className="h-5 w-5 fill-violet-400/10" />
                </div>
                <div>
                  <span className="text-[10px] text-muted block uppercase tracking-wider font-semibold">
                    Most Popular Composition Tone
                  </span>
                  <span className="text-sm font-bold text-white">
                    {mostUsedTone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </>)}
    </div>
  );
}
