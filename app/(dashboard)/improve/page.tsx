"use client";

import React from "react";
import { ImproveInput } from "@/components/improve/ImproveInput";
import { ImproveResult } from "@/components/improve/ImproveResult";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { toast } from "sonner";
import { PenTool, Sparkles, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";

export default function ImprovePage() {
  const [inputText, setInputText] = React.useState("");
  const [context, setContext] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [errorDetails, setErrorDetails] = React.useState<string | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = React.useState(false);

  // Keyboard shortcut listener for Cmd+Enter or Ctrl+Enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputText, context]);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter a draft message to refine.");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorDetails(null);

    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402 && data.error === "LIMIT_EXCEEDED") {
          toast.warning("Daily generation limit exceeded! Upgrade to unlock Premium.");
          setIsUpgradeOpen(true);
          return;
        }
        throw new Error(data.details || data.error || "Failed to refine draft");
      }

      setResult(data);
      toast.success("Draft refined and versions composed successfully!");
    } catch (error: any) {
      setErrorDetails(error.message || "An error occurred during draft refinement.");
      toast.error(error.message || "An error occurred during draft refinement.");
    } finally {
      setLoading(false);
    }
  };

  const basicTips = [
    "Project confidence: Replace 'Just checking in' with 'I want to follow up on this.'",
    "Avoid apologizing: Swap 'Sorry for the delay' with 'Thank you for your patience.'",
    "Single CTA: End messages with a clear single question or call-to-action.",
    "Formatting: Break longer thoughts into scannable paragraphs or bullet points.",
  ];

  return (
    <div className="space-y-8 text-[#F0F4FF]">
      {/* Title Row */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-white tracking-wide flex items-center gap-2">
          AI Message Improver
          <PenTool className="h-6 w-6 text-[#5C6BC0] animate-pulse" />
        </h2>
        <p className="text-sm text-muted mt-1">
          Refine rough paragraphs or bullet points into clear, confident drafts categorized by tone style.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Settings panel (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Primary Text inputs */}
          <ImproveInput
            inputText={inputText}
            setInputText={setInputText}
            context={context}
            setContext={setContext}
          />

          {/* Submit button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              onClick={handleGenerate}
              isLoading={loading}
              className="w-full sm:flex-1 py-3 text-sm font-bold font-syne tracking-wider"
            >
              Refine Message Draft
            </Button>
            <span className="text-xs text-muted font-medium flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Press Cmd/Ctrl + Enter to run
            </span>
          </div>

          {/* Writing Tips List */}
          <Card className="bg-white/[0.01] border-white/5 shadow-sm pt-2">
            <CardContent className="p-5 space-y-3">
              <h4 className="font-syne font-bold text-xs uppercase tracking-wider text-violet-400">
                Quick Writing Tips for Success
              </h4>
              <ul className="space-y-2.5">
                {basicTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                    <CheckCircle className="h-4 w-4 text-[#5C6BC0] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Output results panel (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {loading && (
            <div className="space-y-6 animate-pulse">
              {/* Shimmering Refined Draft versions placeholder */}
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-white/[0.03] border border-white/5 p-5 space-y-3.5 shadow-md">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="h-3 bg-violet-400/20 rounded w-1/3" />
                      <div className="h-6 bg-white/10 rounded w-12" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-5/6" />
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Shimmering copywriter suggestions */}
              <Card className="bg-white/5 border border-white/10 p-5 space-y-3 shadow-md">
                <div className="h-3.5 bg-white/10 rounded w-1/4" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-5/6" />
                </div>
              </Card>
            </div>
          )}

          {errorDetails && (
            <Card className="bg-rose-500/5 border border-rose-500/20 p-6 space-y-4 shadow-lg text-left animate-fade-in">
              <div className="flex items-center gap-3 text-rose-400 border-b border-rose-500/10 pb-3">
                <AlertCircle className="h-6 w-6" />
                <h4 className="font-syne font-bold text-base text-white">
                  Gemini API Generation Error
                </h4>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                The AI model encountered an issue during processing:
              </p>
              <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 text-xs font-mono text-rose-300 break-words leading-relaxed select-text">
                {errorDetails}
              </div>
              <div className="text-xs text-muted space-y-1.5 pt-1">
                <p className="font-semibold text-[#F0F4FF]">Troubleshooting Checklist:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure your GEMINI_API_KEY is pasted in .env</li>
                  <li>Check if the Gemini API model (gemini-2.5-flash) is active</li>
                  <li>Verify internet connectivity and Google AI Studio availability</li>
                </ul>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setErrorDetails(null)}
                className="w-full text-xs font-bold border-rose-500/20 hover:bg-rose-500/10 text-rose-300 mt-2"
              >
                Dismiss & Clear Error
              </Button>
            </Card>
          )}

          {!loading && !result && !errorDetails && (
            <Card className="bg-white/[0.02] border-white/5 border-dashed p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[300px]">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted mb-4 border border-white/10">
                <PenTool className="h-6 w-6" />
              </div>
              <h4 className="font-syne font-bold text-sm text-[#F0F4FF]">
                Awaiting Draft Paragraphs
              </h4>
              <p className="text-xs text-muted max-w-xs mt-2 leading-relaxed">
                Paste your rough draft or message outline on the left panel to trigger the AI message refinement engine.
              </p>
            </Card>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-fade-in">
              <ImproveResult
                versions={result.versions}
                suggestions={result.suggestions}
                messageId={result.id}
                isSaved={result.isSaved}
              />
            </div>
          )}
        </div>
      </div>

      {/* Upgrade pricing check popup */}
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </div>
  );
}
