"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Instagram, MessageSquare, Mail, Globe } from "lucide-react";

interface ChannelTabsProps {
  value: string;
  onChange: (value: "AUTO" | "INSTAGRAM" | "WHATSAPP" | "EMAIL" | "GENERAL") => void;
}

export function ChannelTabs({ value, onChange }: ChannelTabsProps) {
  const channels = [
    { id: "AUTO", name: "Auto-Detect", icon: Sparkles, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    { id: "INSTAGRAM", name: "Instagram", icon: Instagram, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    { id: "WHATSAPP", name: "WhatsApp", icon: MessageSquare, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { id: "EMAIL", name: "Email", icon: Mail, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
    { id: "GENERAL", name: "General", icon: Globe, color: "text-[#5C6BC0] bg-indigo-500/10 border-indigo-500/20" },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
      {channels.map((chan) => {
        const Icon = chan.icon;
        const isActive = value === chan.id;

        return (
          <button
            key={chan.id}
            type="button"
            onClick={() => onChange(chan.id)}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer select-none",
              isActive
                ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/10"
                : "border-transparent text-muted hover:text-[#F0F4FF] hover:bg-white/5"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", !isActive && chan.color.split(" ")[0])} />
            <span className="truncate">{chan.name}</span>
          </button>
        );
      })}
    </div>
  );
}
