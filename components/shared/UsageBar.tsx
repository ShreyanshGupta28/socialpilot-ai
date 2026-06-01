"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface UsageBarProps {
  count: number;
  plan?: string;
}

export function UsageBar({ count }: UsageBarProps) {
  return (
    <div className="space-y-2 text-[#F0F4FF]">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
        <span className="text-[#94A3B8]">Generations Run Today</span>
        <span className="font-semibold flex items-center gap-1 text-violet-400 font-bold">
          <Sparkles className="h-3.5 w-3.5 fill-violet-400" />
          {count} Run (Unlimited Creator Access)
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-violet-500/10 border border-violet-500/20 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full" />
      </div>
    </div>
  );
}
