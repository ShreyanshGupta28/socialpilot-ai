"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { toast } from "sonner";
import { Sparkles, Check, CreditCard, ShieldCheck } from "lucide-react";

function BillingContent() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = React.useState<"FREE" | "PREMIUM" | string>("FREE");
  const [periodEnd, setPeriodEnd] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [portalLoading, setPortalLoading] = React.useState(false);
  const [fetchingUser, setFetchingUser] = React.useState(true);

  const fetchUserProfile = React.useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error("Failed to load user profile");
      const data = await res.json();
      
      if (data.user) {
        setPlan(data.user.plan);
      }
    } catch (err) {
      console.error("Error loading plan details:", err);
    } finally {
      setFetchingUser(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  React.useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      toast.success("Subscription upgraded! Welcome to SocialPilot Premium. 🚀");
      setPlan("PREMIUM");
    }
    if (canceled === "true") {
      toast.warning("Payment checkout session was canceled.");
    }
  }, [searchParams]);

  const handleUpgrade = async (priceType: "monthly" | "annual") => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: priceType }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to initiate checkout");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to trigger Stripe checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handlePortalRedirect = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to open Stripe portal");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to open Stripe portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const premiumFeatures = [
    "Unlimited daily AI message generations",
    "Specialized Instagram, WhatsApp & Email active channels",
    "Polished refiner Message Improver workspace",
    "Template bookmark saved libraries",
    "Priority Gemini execution speeds",
    "Prioritized dedicated user support channels",
  ];

  return (
    <div className="space-y-8 text-[#F0F4FF]">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-white tracking-wide flex items-center gap-2">
          Billing Settings
          <CreditCard className="h-7 w-7 text-violet-400" />
        </h2>
        <p className="text-sm text-muted mt-1">
          Review your account subscription status, upgrade to Premium, or manage cards via Stripe.
        </p>
      </div>

      {/* Plan Summary Card */}
      <Card className="bg-gradient-to-br from-[#0E1528] to-[#0A0F1E] border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 h-36 w-36 rounded-full bg-violet-600/10 blur-2xl pointer-events-none" />
        
        <CardContent className="p-6 sm:p-8 space-y-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <span className="text-xs text-muted uppercase font-bold tracking-widest block">
              Active Tier
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-syne text-white">
                {fetchingUser ? "Loading..." : plan === "PREMIUM" ? "SocialPilot Premium" : "Free Plan Account"}
              </span>
              {!fetchingUser && <PlanBadge plan={plan} />}
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-lg leading-relaxed">
              {plan === "PREMIUM"
                ? "You have full, unlimited access to SocialPilot AI engines. All credit limits are permanently deactivated."
                : "Your account is on our Free tier, restricted to a cap of 30 uses per day. Upgrade below to unlock infinite templates."}
            </p>
          </div>

          <div className="shrink-0">
            {plan === "PREMIUM" ? (
              <Button
                onClick={handlePortalRedirect}
                isLoading={portalLoading}
                className="w-full sm:w-auto py-3 text-sm font-bold font-syne px-6 shadow-md shadow-violet-600/10"
              >
                Manage Subscription
              </Button>
            ) : (
              <a
                href="#upgrade-cards"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm h-11 px-6 rounded-xl transition-all shadow-md shadow-violet-600/10 cursor-pointer"
              >
                Unlock Unlimited Access
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options Pricing Cards */}
      {plan !== "PREMIUM" && (
        <div id="upgrade-cards" className="space-y-6 pt-4 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold font-syne text-white tracking-wide">
              Select Your Premium License
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Cancel or adapt your billing profile anytime with a single click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Monthly Premium */}
            <Card hoverEffect className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between shadow-md">
              <div>
                <h4 className="font-syne font-bold text-base text-[#F0F4FF] tracking-wider uppercase">
                  Premium Monthly
                </h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Best plan for standard flexibility.
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold font-syne text-white">$19</span>
                  <span className="text-xs text-muted ml-1 font-semibold">/month</span>
                </div>
                <hr className="border-white/5 my-6" />
                <ul className="space-y-3.5">
                  {premiumFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F0F4FF]">
                      <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => handleUpgrade("monthly")}
                isLoading={loading}
                className="w-full mt-8 py-3 text-sm font-bold font-syne"
              >
                Get Premium Monthly
              </Button>
            </Card>

            {/* Annual Premium */}
            <Card hoverEffect className="bg-[#0E1428] border-2 border-violet-500/30 p-6 flex flex-col justify-between relative shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-500 border border-violet-400/20 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Save 20%
              </div>
              <div>
                <h4 className="font-syne font-bold text-base text-[#F0F4FF] tracking-wider uppercase flex items-center gap-1.5">
                  Premium Annual
                  <Sparkles className="h-4 w-4 text-violet-400 fill-violet-400/10" />
                </h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Best plan for professional, long-term savings.
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold font-syne text-white">$15</span>
                  <span className="text-xs text-muted ml-1 font-semibold">/month ($180 billed annually)</span>
                </div>
                <hr className="border-white/5 my-6" />
                <ul className="space-y-3.5">
                  {premiumFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F0F4FF]">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => handleUpgrade("annual")}
                isLoading={loading}
                className="w-full mt-8 py-3 text-sm font-bold font-syne"
              >
                Get Premium Annual
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Safety info bar */}
      <div className="flex items-center gap-3.5 bg-white/[0.01] border border-white/5 rounded-2xl p-4 max-w-xl mx-auto text-center justify-center text-xs text-muted">
        <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
        <span>Secure checkout hosted by Stripe. 256-bit bank-grade SSL data encryption active.</span>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading billing dashboard...</div>}>
      <BillingContent />
    </Suspense>
  );
}
