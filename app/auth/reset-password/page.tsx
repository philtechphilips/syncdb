"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { useAuthStore } from "@/store/useAuthStore";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!token) {
      setLocalError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    try {
      await resetPassword({ token, password });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch {
      // Error is handled by the store
    }
  };

  const currentError = !token
    ? "Invalid or missing reset token."
    : error || localError;

  if (isSuccess) {
    return (
      <div className="text-center py-4 animate-in zoom-in-95 duration-500">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-6">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Password reset successful
        </h3>
        <p className="text-zinc-500 font-medium mb-8">
          Your password has been updated. Redirecting you to login...
        </p>
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-300 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div className="flex-1 flex justify-between items-center">
            <span>{currentError}</span>
            <button
              type="button"
              onClick={() => {
                clearError();
                setLocalError("");
              }}
              className="hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <button
        disabled={isLoading || !token}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>Reset Password</>
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
      {/* Background elements */}
      <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center group mb-8">
            <SynqLogo className="h-8 w-8 text-primary translate-y-[1px]" />
            <span className="text-xl font-serif tracking-tight text-white -ml-0.5">
              ynqDB
            </span>
          </Link>
          <h1 className="text-3xl font-serif text-white mb-2">
            Create new password
          </h1>
          <p className="text-zinc-500 font-medium whitespace-nowrap">
            Enter a strong password to secure your account.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-8 text-center text-zinc-600 font-medium">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
