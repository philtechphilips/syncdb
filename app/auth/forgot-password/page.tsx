"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { AuthHeading, AuthShell } from "@/components/auth/AuthShell";
import { useAuthStore } from "@/store/useAuthStore";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <AuthShell>
      <div>
        <AuthHeading title="Reset password">
          We&apos;ll send you a link to get back into your account.
        </AuthHeading>

        <div>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-err/10 border border-err/20 flex items-start gap-3 text-err text-xs font-medium animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <div className="flex-1 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={clearError} className="hover:text-err">
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[13px] text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-background border border-line-strong rounded-xl h-11 pl-11 pr-4 text-foreground placeholder:text-subtle/70 outline-none focus:border-primary/60 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full h-11 rounded-full bg-primary text-white font-medium text-[15px] hover:bg-primary-hover shadow-[0_1px_2px_rgb(67_56_202/0.3)] transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Send Reset Link</>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-6">
                <CheckCircle2 className="h-8 w-8 text-accent-fg" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Check your email
              </h3>
              <p className="text-subtle mb-8">
                If an account exists for {email}, we&apos;ve sent instructions
                to reset your password.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-accent-fg font-semibold hover:underline"
              >
                Didn&apos;t receive it? Try again
              </button>
            </div>
          )}
        </div>

        <Link
          href="/auth/login"
          className="mt-8 flex items-center justify-center gap-2 text-subtle font-medium hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}
