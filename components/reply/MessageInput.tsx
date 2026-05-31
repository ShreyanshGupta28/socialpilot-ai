"use client";

import React from "react";
import { Textarea } from "../ui/Textarea";

interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  context: string;
  setContext: (text: string) => void;
}

export function MessageInput({ inputText, setInputText, context, setContext }: MessageInputProps) {
  const maxInputLength = 4000;
  const maxContextLength = 1000;

  return (
    <div className="space-y-4 text-[#F0F4FF]">
      {/* Primary Message Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold font-syne tracking-wide text-[#F0F4FF] flex items-center justify-between">
          <span>Inbound Message / Comment</span>
          <span className="text-xs text-muted font-normal">
            {inputText.length} / {maxInputLength} chars
          </span>
        </label>
        <Textarea
          placeholder="Paste the customer query, email, DM comment, or support request here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value.slice(0, maxInputLength))}
          className="min-h-[140px] focus:border-violet-500/50"
        />
      </div>

      {/* Context Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold font-syne tracking-wide text-[#F0F4FF] flex items-center justify-between">
          <span>Optional Context / Product Info</span>
          <span className="text-xs text-muted font-normal">
            {context.length} / {maxContextLength} chars
          </span>
        </label>
        <Textarea
          placeholder="Add background details, promotional links, shipping policies, custom variables, or specific guidelines..."
          value={context}
          onChange={(e) => setContext(e.target.value.slice(0, maxContextLength))}
          className="min-h-[80px] focus:border-violet-500/50"
        />
      </div>
    </div>
  );
}
