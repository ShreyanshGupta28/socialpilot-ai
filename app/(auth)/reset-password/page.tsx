"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Sparkles, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!token) {
      setErrorMsg("This password reset session is invalid. Request a new email link.");
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMsg("Please fill in both password verification fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("The two passwords entered do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      toast.success("Password reset successfully!");
      router.push("/login?reset=true");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/5 border-white/10 shadow-2xl p-2 relative">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-600 shadow-md">
            <Sparkles className="h-5.5 w-5.5 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold font-syne text-white tracking-wide">
          New Password
        </CardTitle>
        <CardDescription className="text-sm text-[#94A3B8] mt-1">
          Apply a secure new password to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {!token ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-4 text-center leading-relaxed">
            Missing or invalid reset token. Please request another reset email link.
            <div className="mt-4">
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white text-xs px-4 py-2 rounded-xl transition-all"
              >
                Go to Reset Form
              </Link>
            </div>
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
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10 focus:border-violet-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted tracking-wider uppercase block">
                  Confirm New Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="focus:border-violet-500/50"
                />
              </div>

              <Button type="submit" isLoading={loading} className="w-full mt-2 py-3 text-sm font-bold font-syne">
                Update Password
              </Button>
            </form>
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-white/5 py-4 bg-white/[0.01] mt-2 rounded-b-2xl">
        <Link href="/login" className="text-xs text-muted hover:text-white transition-colors">
          Return to Log In
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] radial-bg-glow pointer-events-none z-0" />
      <div className="w-full flex justify-center z-10">
        <Suspense fallback={<div className="text-muted">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
