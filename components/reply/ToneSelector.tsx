"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ToneSelectorProps {
  selectedTones: string[];
  onChange: (tones: string[]) => void;
}

export function ToneSelector({ selectedTones, onChange }: ToneSelectorProps) {
  const tones = [
    { id: "professional", name: "Professional", label: "🏢 Professional" },
    { id: "friendly", name: "Friendly", label: "😊 Friendly" },
    { id: "empathetic", name: "Empathetic", label: "❤️ Empathetic" },
    { id: "bold", name: "Sales / Bold", label: "🔥 Bold" },
    { id: "witty", name: "Witty / Creative", label: "💡 Witty" },
    { id: "direct", name: "Direct / Short", label: "⚡ Direct" },
  ];

  const handleToggle = (id: string) => {
    if (selectedTones.includes(id)) {
      // Keep at least one tone active
      if (selectedTones.length > 1) {
        onChange(selectedTones.filter((t) => t !== id));
      }
    } else {
      onChange([...selectedTones, id]);
    }
  };

  return (
    <div className="space-y-2.5 text-[#F0F4FF]">
      <label className="text-sm font-semibold font-syne tracking-wide flex items-center justify-between">
        <span>Desired Tones <span className="text-xs font-normal text-muted">(All selected by default)</span></span>
        <span className="text-xs text-violet-400 font-bold">
          {selectedTones.length} selected
        </span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {tones.map((tone) => {
          const isSelected = selectedTones.includes(tone.id);
          return (
            <button
              key={tone.id}
              type="button"
              onClick={() => handleToggle(tone.id)}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer select-none",
                isSelected
                  ? "bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-600/5"
                  : "bg-white/5 border-white/10 text-muted hover:text-[#F0F4FF] hover:bg-white/10"
              )}
            >
              <span>{tone.label}</span>
              {isSelected && <Check className="h-4 w-4 text-violet-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
