"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to send reset link.");
      }

      toast.success("Reset link sent!");
      setSubmitted(true);
    } catch (err: any) {
      // In compliance with our security standards, we degrade gracefully and display success state
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F1E] flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] radial-bg-glow pointer-events-none z-0" />
      
      <div className="w-full flex justify-center z-10">
        <Card className="w-full max-w-md bg-white/5 border-white/10 shadow-2xl p-2">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-600 shadow-md">
                <Sparkles className="h-5.5 w-5.5 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-syne text-white tracking-wide">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-[#94A3B8] mt-1">
              Recover access to your SocialPilot account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {submitted ? (
              <div className="space-y-4 text-center leading-relaxed">
                <p className="text-sm text-[#94A3B8]">
                  If the email address <span className="text-[#F0F4FF] font-semibold">{email}</span> matches an active account, we have sent a secure link to reset your password.
                </p>
                <p className="text-xs text-muted">
                  Please check your inbox (and spam folder) for the recovery email.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-11 rounded-xl transition-all shadow-md mt-2"
                >
                  Return to Log In
                </Link>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 text-center leading-relaxed">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted tracking-wider uppercase block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="focus:border-violet-500/50"
                    />
                  </div>

                  <Button type="submit" isLoading={loading} className="w-full mt-2 py-3 text-sm font-bold font-syne">
                    Send Recovery Email
                  </Button>
                </form>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-white/5 py-4 bg-white/[0.01] mt-2 rounded-b-2xl">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Log In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
