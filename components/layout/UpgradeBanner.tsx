"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface UpgradeBannerProps {
  plan: string;
}

export function UpgradeBanner({ plan }: UpgradeBannerProps) {
  if (plan !== "FREE") return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 mb-6 text-white shadow-lg border border-violet-500/20">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-white/15 rounded-xl flex-shrink-0 animate-pulse-slow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold font-syne text-sm sm:text-base text-white tracking-wide">
              Unlock Unlimited Communication Assistance
            </h4>
            <p className="text-xs sm:text-sm text-violet-100 mt-0.5">
              You are currently on the <span className="font-bold text-white">Free Plan</span> (capped at 30 uses/day). Upgrade to Premium for infinite templates, instant processing, and full intelligence channels.
            </p>
          </div>
        </div>
        <Link
          href="/billing"
          className="inline-flex items-center gap-1.5 bg-white text-violet-600 hover:bg-violet-50 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all duration-200 shadow-md shadow-black/10 shrink-0 self-end sm:self-auto cursor-pointer"
        >
          Upgrade Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
