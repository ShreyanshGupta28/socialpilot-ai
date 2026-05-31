"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Sparkles, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");
    const err = searchParams.get("error");

    if (verified === "true") {
      toast.success("Email verified successfully! You can now log in.");
    }
    if (reset === "true") {
      toast.success("Password reset successfully! You can now log in.");
    }
    if (err) {
      if (err === "CredentialsSignin") {
        setErrorMsg("Invalid email address or password.");
      } else if (err === "TokenExpiredOrInvalid") {
        setErrorMsg("The verification link was invalid or has expired.");
      } else {
        setErrorMsg("Failed to sign in. Please verify your email.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all credentials fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res) {
        setErrorMsg("An unexpected authentication error occurred.");
        return;
      }

      if (res.error) {
        setErrorMsg("Invalid credentials or unverified email.");
      } else {
        toast.success("Welcome back! Redirecting...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("Failed to connect to authentication server.");
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
          Welcome Back
        </CardTitle>
        <CardDescription className="text-sm text-[#94A3B8] mt-1">
          Access your AI Communication Assistant
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted tracking-wider uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
            Log In
          </Button>
        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-3 text-xs text-muted uppercase tracking-widest font-bold">Or continue with</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google OAuth trigger */}
        <Button
          type="button"
          variant="secondary"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          disabled={loading}
          className="w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Google Account
        </Button>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-white/5 py-4 bg-white/[0.01] mt-2 rounded-b-2xl">
        <span className="text-xs text-muted">
          New to SocialPilot AI?{" "}
          <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold">
            Create Free Account
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] radial-bg-glow pointer-events-none z-0" />
      <div className="w-full flex justify-center z-10">
        <Suspense fallback={<div className="text-muted">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
