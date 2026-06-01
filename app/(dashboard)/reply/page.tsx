"use client";

import React from "react";
import { ChannelTabs } from "@/components/reply/ChannelTabs";
import { MessageInput } from "@/components/reply/MessageInput";
import { ToneSelector } from "@/components/reply/ToneSelector";
import { ReplyCard } from "@/components/reply/ReplyCard";
import { AnalysisBar } from "@/components/reply/AnalysisBar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { toast } from "sonner";
import { Sparkles, HelpCircle, AlertCircle, Download } from "lucide-react";

export default function ReplyGeneratorPage() {
  const [channel, setChannel] = React.useState<"AUTO" | "INSTAGRAM" | "WHATSAPP" | "EMAIL" | "GENERAL">("AUTO");
  const [inputText, setInputText] = React.useState("");
  const [context, setContext] = React.useState("");
  
  // All 6 tones selected by default
  const [selectedTones, setSelectedTones] = React.useState<string[]>([
    "professional",
    "friendly",
    "empathetic",
    "bold",
    "witty",
    "direct",
  ]);

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
  }, [channel, inputText, context, selectedTones]);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter an inbound message to analyze.");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorDetails(null);

    try {
      const response = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          inputText,
          selectedTones,
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
        throw new Error(data.details || data.error || "Failed to generate reply options");
      }

      setResult(data);
      toast.success("AI replies and insights generated successfully!");
    } catch (error: any) {
      setErrorDetails(error.message || "An error occurred during generation.");
      toast.error(error.message || "An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!result) return;
    
    // Create a new window for clean print formatting
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocker prevented exporting PDF. Please allow popups.");
      return;
    }
    
    const repliesHTML = result.replies.map((rep: any) => `
      <div class="print-card" style="margin-bottom: 25px; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; font-family: Inter, sans-serif; background-color: #FFFFFF;">
        <h4 style="margin: 0 0 10px 0; color: #7C3AED; font-family: Syne, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
          ${rep.label}
        </h4>
        <p style="margin: 0; color: #0F172A; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
          ${rep.content}
        </p>
      </div>
    `).join("");
    
    const analysisHTML = `
      <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #CBD5E1; border-radius: 12px; background-color: #F8FAFC; font-family: Inter, sans-serif;">
        <h3 style="margin: 0 0 15px 0; font-family: Syne, sans-serif; font-size: 16px; color: #0F172A;">Inbound Analysis Insights</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Detected Channel:</td><td style="padding: 8px 0; font-weight: 700; color: #7C3AED;">${result.detectedChannel}</td></tr>
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Core Intent:</td><td style="padding: 8px 0; color: #0F172A;">${result.analysis.intent}</td></tr>
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Sentiment:</td><td style="padding: 8px 0; color: #0F172A; text-transform: capitalize;">${result.analysis.sentiment}</td></tr>
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Lead Engagement Score:</td><td style="padding: 8px 0; color: #0F172A; font-weight: 700;">${result.analysis.leadScore} / 100</td></tr>
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Urgency Flag:</td><td style="padding: 8px 0; color: #0F172A; text-transform: capitalize;">${result.analysis.urgency}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748B; font-weight: 600;">Inbound Summary:</td><td style="padding: 8px 0; color: #0F172A;">${result.analysis.summary}</td></tr>
        </table>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>SocialPilot AI - Response Export Report</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; color: #0F172A; padding: 40px; margin: 0; background-color: #FFFFFF; }
            h1 { font-family: 'Syne', sans-serif; font-size: 26px; color: #0F172A; margin: 0 0 5px 0; font-weight: 800; }
            p.subtitle { font-size: 13px; color: #64748B; margin: 0 0 30px 0; border-bottom: 2px solid #F1F5F9; padding-bottom: 15px; }
            blockquote { margin: 0 0 30px 0; padding: 15px 20px; border-left: 4px solid #7C3AED; background: #F8FAFC; border-radius: 0 8px 8px 0; font-style: italic; font-size: 14px; color: #334155; }
          </style>
        </head>
        <body>
          <h1>SocialPilot AI Response Report</h1>
          <p class="subtitle">Exported on ${new Date().toLocaleString()} · Powered by Gemini-2.5-Flash</p>
          
          <h3 style="font-family: 'Syne', sans-serif; font-size: 15px; margin-bottom: 10px; color: #0F172A;">Original Inbound Query</h3>
          <blockquote>"${inputText.replace(/"/g, '&quot;')}"</blockquote>
          
          ${analysisHTML}
          
          <h3 style="font-family: 'Syne', sans-serif; font-size: 15px; margin-bottom: 20px; color: #0F172A;">Generated Response Alternatives</h3>
          ${repliesHTML}
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 text-[#F0F4FF]">
      {/* Title Row */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-white tracking-wide flex items-center gap-2">
          AI Reply Generator
          <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
        </h2>
        <p className="text-sm text-muted mt-1">
          Paste inbound messages or support queries and receive deep analytical insights alongside 6 tone variations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Settings panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Reply Templates */}
          <div className="space-y-2">
            <span className="text-sm font-semibold font-syne tracking-wide text-white block">
              Quick Reply Templates
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                {
                  name: "🤝 Brand Collab",
                  text: "Hi! I love your brand and would love to discuss a potential collaboration. I've attached my media kit with engagement stats. Let me know if you are open to discussing a partnership!"
                },
                {
                  name: "💰 Sponsorship",
                  text: "Hello! We are looking to sponsor creator content for our upcoming campaign. Are you open to brand integration sponsorships, and what are your rates for a dedicated post?"
                },
                {
                  name: "📊 Pricing Inquiry",
                  text: "Hi there! I'm interested in booking your services. Could you please share your rate card and price packages for sponsored campaigns?"
                },
                {
                  name: "❤️ Fan Reply",
                  text: "Hey! Just wanted to say I absolutely love your content, you inspire me so much! Keep up the amazing work!"
                },
                {
                  name: "🛠️ Customer Support",
                  text: "Hi! I placed an order but haven't received a tracking number yet. Can you please check my order status and help me out?"
                }
              ].map((tpl) => (
                <button
                  key={tpl.name}
                  onClick={() => {
                    setInputText(tpl.text);
                    toast.info(`Loaded ${tpl.name} template!`);
                  }}
                  className="text-xs font-semibold py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors text-left truncate cursor-pointer font-sans"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Channel selector tabs */}
          <div className="space-y-2">
            <span className="text-sm font-semibold font-syne tracking-wide text-white block">
              Platform Channel
            </span>
            <ChannelTabs value={channel} onChange={setChannel} />
          </div>

          {/* Primary Text inputs */}
          <MessageInput
            inputText={inputText}
            setInputText={setInputText}
            context={context}
            setContext={setContext}
          />

          {/* Tones selector */}
          <ToneSelector selectedTones={selectedTones} onChange={setSelectedTones} />

          {/* Submit button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              onClick={handleGenerate}
              isLoading={loading}
              className="w-full sm:flex-1 py-3 text-sm font-bold font-syne tracking-wider"
            >
              Generate AI Replies
            </Button>
            <span className="text-xs text-muted font-medium flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Press Cmd/Ctrl + Enter to run
            </span>
          </div>
        </div>

        {/* Right Output results panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {loading && (
            <div className="space-y-6 animate-pulse">
              {/* Shimmering analysis placeholder */}
              <Card className="bg-white/5 border border-white/10 p-5 space-y-3.5 shadow-md">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-white/5 rounded-xl border border-white/5" />
                  ))}
                </div>
              </Card>
              {/* Shimmering composed alternatives */}
              <div className="space-y-4">
                <div className="h-3.5 bg-white/10 rounded w-1/4 mb-2" />
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white/[0.03] border border-white/5 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="h-3 bg-violet-400/20 rounded w-1/4" />
                      <div className="h-6 bg-white/10 rounded w-12" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-5/6" />
                    </div>
                  </Card>
                ))}
              </div>
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
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="font-syne font-bold text-sm text-[#F0F4FF]">
                Awaiting Inbound Queries
              </h4>
              <p className="text-xs text-muted max-w-xs mt-2 leading-relaxed">
                Paste a DM comment, support request, or client email on the left panel to trigger the AI reply engine.
              </p>
            </Card>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-fade-in">
              {/* Sentiment analysis insights */}
              {result.analysis && <AnalysisBar analysis={result.analysis} />}

              {/* Six reply variations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-muted">
                    Composed Alternatives
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    className="h-8 text-xs font-bold font-syne border-violet-500/20 hover:bg-violet-500/10 text-violet-400 gap-1.5 px-3 rounded-xl no-print"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export PDF
                  </Button>
                </div>
                {result.replies?.map((rep: any, idx: number) => (
                  <ReplyCard
                    key={idx}
                    reply={rep}
                    messageId={result.id}
                    isSaved={result.isSaved}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade pricing check popup */}
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </div>
  );
}
