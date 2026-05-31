"use client";

import React from "react";
import { Textarea } from "../ui/Textarea";

interface ImproveInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  context: string;
  setContext: (text: string) => void;
}

export function ImproveInput({ inputText, setInputText, context, setContext }: ImproveInputProps) {
  const maxInputLength = 4000;
  const maxContextLength = 1000;

  return (
    <div className="space-y-4 text-[#F0F4FF]">
      {/* Draft text */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold font-syne tracking-wide flex items-center justify-between">
          <span>Draft Message / Email</span>
          <span className="text-xs text-muted font-normal">
            {inputText.length} / {maxInputLength} chars
          </span>
        </label>
        <Textarea
          placeholder="Paste your rough message draft, quick thoughts, or raw bullet points that you want the AI to refine..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, maxInputLength))}
          className="min-h-[140px] focus:border-violet-500/50"
        />
      </div>

      {/* Special optimization guidelines */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold font-syne tracking-wide flex items-center justify-between">
          <span>Special Guidelines / Goal (Optional)</span>
          <span className="text-xs text-muted font-normal">
            {context.length} / {maxContextLength} chars
          </span>
        </label>
        <Textarea
          placeholder="e.g., 'Make it sound less apologetic', 'Focus on booking a call', 'Emphasize the 20% discount code', etc."
          value={context}
          onChange={(e) => setContext(e.target.value.slice(0, maxContextLength))}
          className="min-h-[80px] focus:border-violet-500/50"
        />
      </div>
    </div>
  );
}
