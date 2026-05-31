"use client";

import React from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "monthly", // handled by checkout API using env vars
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to trigger checkout");

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL missing");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Unlimited daily AI message generations",
    "Full access to specialized channels (Instagram, WhatsApp, Email, Custom)",
    "Unlimited improved drafts & professional rewrites",
    "Saved reply library with favorites system",
    "High-speed Gemini prioritized responses",
    "Priority support channel",
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade to Premium 🚀"
      description="Supercharge your communication and lift all daily AI message boundaries."
    >
      <div className="space-y-6 py-2 text-[#F0F4FF]">
        {/* Pricing tag */}
        <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-violet-400 font-semibold tracking-wider uppercase block">
              Premium Tier
            </span>
            <span className="font-syne text-3xl font-bold tracking-wide mt-1 inline-block">
              $19<span className="text-sm font-normal text-muted">/month</span>
            </span>
          </div>
          <div className="flex items-center gap-1 bg-violet-600/25 border border-violet-500/30 text-violet-400 px-3 py-1 rounded-full text-xs font-bold font-syne">
            <Sparkles className="h-3.5 w-3.5" />
            Best Value
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3">
          <p className="text-xs text-muted font-bold tracking-wider uppercase">
            What's included in Premium:
          </p>
          <ul className="space-y-2.5">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[#F0F4FF]">
                <div className="bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-full p-0.5 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
          <Button
            onClick={handleUpgrade}
            isLoading={loading}
            className="w-full sm:flex-1 py-3 text-sm font-bold font-syne"
          >
            Upgrade to Premium Now
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
