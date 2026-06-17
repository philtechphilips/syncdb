"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Terminal,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

type State = "loading" | "ready" | "authorizing" | "success" | "error";

function AuthorizeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const [state, setState] = useState<State>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const loginToken = searchParams.get("token") ?? "";

  useEffect(() => {
    if (!loginToken) {
      setState("error");
      setErrorMsg("No login token provided.");
      return;
    }
    checkAuth().then(() => {
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        router.push(
          `/auth/login?redirect=${encodeURIComponent(`/agent/authorize?token=${loginToken}`)}`,
        );
      } else {
        setState("ready");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginToken]);

  const handleAuthorize = async () => {
    setState("authorizing");
    try {
      await api.post("/v1/auth/cli-login/authorize", { loginToken });
      setState("success");
    } catch (err: any) {
      setState("error");
      setErrorMsg(
        err?.response?.data?.message ??
          "Failed to authorize. Please try again.",
      );
    }
  };

  const handleDeny = () => {
    router.push("/dashboard");
  };

  if (state === "loading" || isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-zinc-400 font-medium">Verifying your session...</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-serif text-white">CLI Authorized</h2>
        <p className="text-zinc-400 max-w-xs">
          Your agent CLI is now authenticated. You can close this tab and return
          to your terminal.
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-serif text-white">Authorization Failed</h2>
        <p className="text-zinc-400 max-w-xs">{errorMsg}</p>
        <Link
          href="/dashboard"
          className="text-primary text-sm hover:underline"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Terminal className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-serif text-white">Authorize CLI Agent</h2>
        <p className="text-zinc-400 text-sm">
          A terminal session is requesting access to your SynqDB account.
        </p>
      </div>

      <div className="w-full glass rounded-2xl border border-white/5 p-4 text-left space-y-2">
        <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          Authorizing as
        </div>
        <p className="text-white font-medium pl-6">{user?.email}</p>
      </div>

      <p className="text-zinc-500 text-xs">
        This will allow the{" "}
        <span className="text-zinc-300 font-mono">synqdb-agent</span> CLI to
        connect your local databases to SynqDB on your behalf.
      </p>

      <div className="flex w-full gap-3">
        <button
          onClick={handleDeny}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors text-sm font-medium"
        >
          Deny
        </button>
        <button
          onClick={handleAuthorize}
          disabled={state === "authorizing"}
          className="flex-1 py-2.5 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state === "authorizing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Authorize
        </button>
      </div>
    </div>
  );
}

export default function AgentAuthorizePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center group">
            <SynqLogo className="h-8 w-8 text-primary translate-y-[1px]" />
            <span className="text-xl font-serif tracking-tight text-white -ml-0.5 italic">
              ynqDB
            </span>
          </Link>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl flex flex-col items-center">
          <Suspense
            fallback={<Loader2 className="h-8 w-8 text-primary animate-spin" />}
          >
            <AuthorizeContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
