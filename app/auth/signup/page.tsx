"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { AuthHeading, AuthShell } from "@/components/auth/AuthShell";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        full_name: fullName,
        email,
        password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch {
      // Error is handled by the store
    }
  };

  if (isSuccess) {
    return (
      <AuthShell>
        <div>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="h-7 w-7 text-accent-fg" />
          </div>
          <h2 className="font-display text-[40px] leading-[1.05] tracking-[-0.03em] text-foreground mb-3">
            Welcome aboard!
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your account has been created successfully. We&apos;re redirecting
            you to the sign-in page to start your journey.
          </p>

          <div className="flex">
            <Loader2 className="h-6 w-6 text-accent-fg animate-spin" />
          </div>
        </div>
      </AuthShell>
    );
  }

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/oauth/google`;
  };

  return (
    <AuthShell>
      <div>
        <AuthHeading title="Build faster together">
          Create your developer account in seconds.
        </AuthHeading>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full h-11 px-4 rounded-full bg-sand-2 text-[15px] font-medium text-foreground flex items-center justify-center gap-2.5 hover:bg-ink/[0.08] transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs font-medium text-subtle">
                <span className="bg-background px-4">Or use email</span>
              </div>
            </div>

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

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-background border border-line-strong rounded-xl h-11 pl-11 pr-4 text-foreground placeholder:text-subtle/70 outline-none focus:border-primary/60 transition-all text-sm"
                  />
                </div>
              </div>

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

              <div className="space-y-1.5">
                <label className="text-[13px] text-muted-foreground">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-background border border-line-strong rounded-xl h-11 pl-11 pr-12 text-foreground placeholder:text-subtle/70 outline-none focus:border-primary/60 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle hover:text-muted-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-4 w-4 text-accent-fg shrink-0 mt-0.5" />
                <p className="text-[11px] text-subtle leading-relaxed">
                  I agree to the{" "}
                  <Link href="#" className="text-accent-fg hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-accent-fg hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full h-11 rounded-full bg-primary text-white font-medium text-[15px] hover:bg-primary-hover shadow-[0_1px_2px_rgb(67_56_202/0.3)] transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Create Account</>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-subtle">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent-fg hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
