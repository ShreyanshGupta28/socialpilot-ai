"use client";

import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ShieldCheck, MessageCircle, TrendingUp, AlertTriangle } from "lucide-react";

interface AnalysisData {
  intent: string;
  sentiment: "positive" | "neutral" | "negative" | string;
  leadScore: number;
  urgency: "high" | "medium" | "low" | string;
  summary: string;
}

interface AnalysisBarProps {
  analysis: AnalysisData;
}

export function AnalysisBar({ analysis }: AnalysisBarProps) {
  const getSentimentBadge = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes("pos")) return <Badge variant="success">Positive</Badge>;
    if (s.includes("neg")) return <Badge variant="error">Negative</Badge>;
    return <Badge variant="secondary">Neutral</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const u = urgency.toLowerCase();
    if (u.includes("high")) return <Badge variant="error">High Urgency</Badge>;
    if (u.includes("med")) return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="success">Low</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-[#94A3B8]";
  };

  return (
    <Card className="bg-gradient-to-br from-[#0F172E] to-[#0A0F1E] border-white/5 shadow-lg">
      <CardContent className="p-6 space-y-4">
        {/* Main Title Row */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <ShieldCheck className="h-5 w-5 text-violet-400" />
          <h3 className="font-syne font-bold text-base text-white tracking-wide">
            AI Inbound Message Insights
          </h3>
        </div>

        {/* Multi-grid stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Sentiment */}
          <div className="space-y-1">
            <span className="text-xs text-muted block">Sentiment</span>
            <div className="pt-0.5">{getSentimentBadge(analysis.sentiment)}</div>
          </div>

          {/* Urgency */}
          <div className="space-y-1">
            <span className="text-xs text-muted block">Urgency</span>
            <div className="pt-0.5">{getUrgencyBadge(analysis.urgency)}</div>
          </div>

          {/* Lead Score */}
          <div className="space-y-1">
            <span className="text-xs text-muted block flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Lead Score
            </span>
            <span className={`text-base font-bold font-syne ${getScoreColor(analysis.leadScore)}`}>
              {analysis.leadScore} / 100
            </span>
          </div>

          {/* Intent */}
          <div className="space-y-1">
            <span className="text-xs text-muted block flex items-center gap-1">
              <MessageCircle className="h-3 w-3" /> Intent Category
            </span>
            <span className="text-sm font-semibold truncate text-[#F0F4FF] block max-w-full">
              {analysis.intent}
            </span>
          </div>
        </div>

        {/* AI Summary Block */}
        {analysis.summary && (
          <div className="mt-3 bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs leading-relaxed text-[#94A3B8]">
            <span className="font-bold text-violet-400 uppercase tracking-wider text-[10px] block mb-1">
              AI Inbound Summary:
            </span>
            {analysis.summary}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
