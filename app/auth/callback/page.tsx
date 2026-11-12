"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useClusterStore } from "@/store/useClusterStore";
import { AuthHeading, AuthShell } from "@/components/auth/AuthShell";

function AuthCallbackContent() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // The API set the refresh cookie during the OAuth redirect; exchange it
    // for an access token. Tokens are never passed in the URL.
    checkAuth()
      .then((ok) => {
        if (!ok) {
          router.replace("/auth/login?error=Authentication failed");
          return;
        }
        // Clear any stale cluster selection so the user always lands on
        // the cluster picker after a fresh OAuth login.
        useClusterStore.getState().selectCluster(null);
        router.replace("/dashboard");
      })
      .catch(() => router.replace("/auth/login?error=Authentication failed"));
  }, [router, checkAuth]);

  return (
    <AuthShell>
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-6">
        <Loader2 className="h-7 w-7 text-accent-fg animate-spin" />
      </div>
      <AuthHeading title="Signing you in">
        Securing your session and preparing your dashboard…
      </AuthHeading>
    </AuthShell>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-accent-fg animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
