"use client";

import React from "react";
import { Progress } from "../ui/Progress";
import { Sparkles } from "lucide-react";

interface UsageBarProps {
  count: number;
  plan: string;
}

export function UsageBar({ count, plan }: UsageBarProps) {
  const isPremium = plan === "PREMIUM";
  const limit = 30;
  const percentage = isPremium ? 100 : Math.min(100, (count / limit) * 100);

  return (
    <div className="space-y-2 text-[#F0F4FF]">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
        <span className="text-[#94A3B8]">Daily Usage Limits</span>
        <span className="font-semibold">
          {isPremium ? (
            <span className="flex items-center gap-1 text-violet-400 font-bold">
              <Sparkles className="h-3.5 w-3.5 fill-violet-400" />
              Unlimited
            </span>
          ) : (
            `${count} / ${limit} generations`
          )}
        </span>
      </div>

      {!isPremium ? (
        <div className="space-y-1">
          <Progress value={count} max={limit} />
          <div className="flex justify-between text-[10px] text-[#94A3B8]">
            <span>0% used</span>
            {count >= 25 && <span className="text-amber-400 font-medium">Running low on credits!</span>}
            <span>100% ({limit}/day)</span>
          </div>
        </div>
      ) : (
        <div className="h-2 w-full rounded-full bg-violet-500/10 border border-violet-500/20 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full" />
        </div>
      )}
    </div>
  );
}
