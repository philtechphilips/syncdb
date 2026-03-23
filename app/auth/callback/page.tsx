"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken) {
      // Save tokens to localStorage
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      // Sync auth state and redirect
      checkAuth()
        .then(() => {
          router.push("/dashboard");
        })
        .catch(() => {
          router.push("/auth/login?error=Authentication failed");
        });
    } else {
      router.push("/auth/login?error=No token received");
    }
  }, [searchParams, router, checkAuth]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6">
      <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>

      <div className="relative">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
        <div className="absolute -inset-4 bg-primary/20 blur-2xl -z-10 rounded-full animate-pulse"></div>
      </div>

      <div className="text-center space-y-2 relative z-10">
        <h2 className="text-2xl font-serif text-white tracking-tight">
          Syncing your account
        </h2>
        <p className="text-zinc-500 font-medium">
          Securing your session and preparing your dashboard...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
