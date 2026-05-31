"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Instagram,
  MessageSquare,
  Mail,
  ShieldAlert,
  ArrowRight,
  Check,
  ChevronDown,
  Bookmark,
  PenTool,
  Lock
} from "lucide-react";

export default function MarketingPage() {
  const [isAnnual, setIsAnnual] = React.useState(false);
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  const features = [
    {
      title: "Instagram DM Replies",
      desc: "Instantly draft organic, engaging answers to stories, support inquiries, and post comments.",
      icon: Instagram,
      color: "text-pink-400 bg-pink-500/10",
    },
    {
      title: "WhatsApp Responder",
      desc: "Generate professional and casual chats optimized for direct customer feedback and sales loops.",
      icon: MessageSquare,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Email Draft Generator",
      desc: "Transform rough bullet points into beautifully formatted, high-impact business emails in seconds.",
      icon: Mail,
      color: "text-sky-400 bg-sky-500/10",
    },
    {
      title: "Auto-Detect Channel",
      desc: "Not sure? Paste your message and our AI will automatically identify the communication intent and format.",
      icon: Sparkles,
      color: "text-violet-400 bg-violet-500/10",
    },
    {
      title: "Message Improver",
      desc: "Refine rough messages to sound more confident, clear, and professional, removing apologies.",
      icon: PenTool,
      color: "text-[#5C6BC0] bg-indigo-500/10",
    },
    {
      title: "Saved Templates Library",
      desc: "Bookmark generated templates to reuse across common responses, making customer service instant.",
      icon: Bookmark,
      color: "text-amber-400 bg-amber-500/10",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Paste Inbound Query",
      desc: "Copy any DM comment, customer support request, email, or rough ideas and drop them into the workspace.",
    },
    {
      num: "02",
      title: "Select Channel & Tone",
      desc: "Pick your communication channel or let Auto-Detect handle it. Toggle between Empathetic, Witty, or Professional styles.",
    },
    {
      num: "03",
      title: "Deploy Instant Reply",
      desc: "Get 6 stunning generated replies. Review deep inbound sentiment analytics, copy your favorite, or save to your library.",
    },
  ];

  const faqItems = [
    {
      q: "How does the daily generation credit limit work?",
      a: "On our Free Plan, you receive 30 AI generations every day at no cost. Credits reset daily at midnight. Upgrading to Premium lifts all caps, giving you unlimited templates.",
    },
    {
      q: "Does Auto-Detect channel really understand the text context?",
      a: "Yes! Powered by Google Gemini intelligence, SocialPilot AI parses the layout, greetings, and syntax. It can tell an informal Instagram comment apart from a structured business inquiry.",
    },
    {
      q: "Can I manage my Stripe premium subscriptions easily?",
      a: "Absolutely. We utilize Stripe's self-serve Customer Portal. You can change payment options, toggle annual renewals, or cancel your Premium subscription anytime with a single click in settings.",
    },
    {
      q: "How secure is my profile and data?",
      a: "We prioritize user privacy. Your passwords are encrypted with bcryptjs and all routes are guarded by NextAuth session layers. We never share your inbound query data.",
    },
    {
      q: "Are the generated replies 100% unique?",
      a: "Yes. Every prompt analysis utilizes context-specific business inputs, tone settings, and real-time processing to draft replies, ensuring they fit your specific products.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F0F4FF] overflow-hidden">
      {/* Dynamic glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] radial-bg-glow pointer-events-none z-0" />

      {/* Navbar Section */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5 bg-[#0A0F1E]/20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-violet-600 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold font-syne tracking-wider text-white">
            SocialPilot <span className="text-violet-500">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#94A3B8] font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm h-10 px-5 rounded-xl transition-all shadow-md shadow-violet-600/10"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
          <Zap className="h-3.5 w-3.5 fill-violet-400" />
          Unleash Instant Responses
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-syne tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          Your Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-600 to-indigo-400">Communication</span> Assistant
        </h1>
        <p className="text-base sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mt-6 leading-relaxed">
          Generate premium replies for Instagram DMs, WhatsApp queries, and emails in seconds. Optimize rough drafts, analyze inbound sentiment, and automate response workflows.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold h-12 px-8 rounded-xl transition-all shadow-lg shadow-violet-600/20 active:scale-[0.98] cursor-pointer"
          >
            Get Started Free
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-12 px-8 rounded-xl transition-all cursor-pointer"
          >
            View Pricing
          </a>
        </div>
        <p className="text-xs text-muted mt-4">
          No credit card required · 30 free daily generations
        </p>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne tracking-tight text-white">
            Designed for Instant Interactions
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            Elevate customer engagement on every platform with professional templates, tone adaptation, and structural draft improvements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 hover:bg-white/[0.07] transition-all duration-300 group shadow-md"
              >
                <div className={`flex items-center justify-center h-12 w-12 rounded-xl mb-5 ${feat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-syne tracking-wide text-white group-hover:text-violet-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted mt-2.5 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne tracking-tight text-white">
            How SocialPilot AI Works
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            From raw input to tailored replies in three seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative space-y-4">
              <span className="text-5xl font-extrabold font-syne text-violet-600/20 tracking-tighter block">
                {step.num}
              </span>
              <h3 className="text-xl font-bold font-syne text-[#F0F4FF] tracking-wide">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne tracking-tight text-white">
            Pricing Tailored for Growth
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            Get started for free or upgrade to Premium to lift all boundaries.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-3.5 mt-8">
            <span className={`text-sm ${!isAnnual ? "text-white font-bold" : "text-muted"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6.5 rounded-full bg-violet-600/30 border border-violet-500/30 p-1 transition-colors outline-none cursor-pointer"
            >
              <div
                className={`h-4.5 w-4.5 rounded-full bg-violet-500 transition-transform duration-200 ${
                  isAnnual ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? "text-white font-bold" : "text-muted"} flex items-center gap-1.5`}>
              Annual
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-md">
            <div>
              <h3 className="text-lg font-bold font-syne text-[#F0F4FF] tracking-wider uppercase">Free</h3>
              <p className="text-sm text-muted mt-1">Perfect for trial testing.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold font-syne">$0</span>
                <span className="text-xs text-muted ml-1">forever</span>
              </div>
              <hr className="border-white/5 my-6" />
              <ul className="space-y-3.5">
                {[
                  "30 daily AI generation credits",
                  "Auto-Detect channel processing",
                  "Access to standard tones",
                  "Standard response speeds",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-muted">
                    <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center justify-center w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-11 rounded-xl transition-all cursor-pointer"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#0E1428] border-2 border-violet-500/30 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-500 border border-violet-400/20 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold font-syne text-[#F0F4FF] tracking-wider uppercase flex items-center gap-1.5">
                Premium
                <Sparkles className="h-4.5 w-4.5 text-violet-400 fill-violet-400/20" />
              </h3>
              <p className="text-sm text-muted mt-1">Unlock total AI capability.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold font-syne">
                  {isAnnual ? "$15" : "$19"}
                </span>
                <span className="text-xs text-muted ml-1">/month, {isAnnual ? "billed annually" : "monthly"}</span>
              </div>
              <hr className="border-white/5 my-6" />
              <ul className="space-y-3.5">
                {[
                  "Unlimited daily AI generations",
                  "Prioritized Gemini processing speeds",
                  "Specialized platform channels active",
                  "Refinement Message Improver included",
                  "Saved replies library & bookmarks",
                  "Stripe Customer Portal access",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#F0F4FF]">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/signup?plan=premium"
              className="mt-8 inline-flex items-center justify-center w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-11 rounded-xl transition-all shadow-md shadow-violet-600/10 cursor-pointer"
            >
              Get Premium Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 leading-relaxed">
            Everything you need to know about SocialPilot AI features.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-white tracking-wide hover:bg-white/[0.01] transition-colors cursor-pointer outline-none"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[160px] border-t border-white/5 p-5 text-sm text-muted bg-white/[0.01] leading-relaxed" : "max-h-0"
                  }`}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center text-xs text-muted space-y-4">
        <div className="flex items-center justify-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
        <p>© {new Date().getFullYear()} SocialPilot AI. All rights reserved. Your premium communication partner.</p>
      </footer>
    </div>
  );
}
