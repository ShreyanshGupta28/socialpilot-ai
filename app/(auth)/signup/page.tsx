"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Sparkles, Eye, EyeOff } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !password) {
      setErrorMsg("Please fill in all registration fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      toast.success("Account created! Please check your email to verify your address.");
      router.push("/login?verify_instruction=true");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during registration.");
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
          Create Account
        </CardTitle>
        <CardDescription className="text-sm text-[#94A3B8] mt-1">
          Sign up to unlock 30 daily AI generation credits
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 text-center leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted tracking-wider uppercase block">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="focus:border-violet-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted tracking-wider uppercase block">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="focus:border-violet-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted tracking-wider uppercase block">
              Password
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

          <Button type="submit" isLoading={loading} className="w-full mt-2 py-3 text-sm font-bold font-syne">
            Register Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-white/5 py-4 bg-white/[0.01] mt-2 rounded-b-2xl">
        <span className="text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
            Log In here
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] radial-bg-glow pointer-events-none z-0" />
      <div className="w-full flex justify-center z-10">
        <Suspense fallback={<div className="text-muted">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}
