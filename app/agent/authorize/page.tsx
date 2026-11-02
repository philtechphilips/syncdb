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
import { getErrorMessage } from "@/lib/errorUtils";

type State =
  | "loading"
  | "ready"
  | "authorizing"
  | "success"
  | "denied"
  | "error";

interface RequestInfo {
  hostname: string | null;
  ip: string | null;
  requestedAt: string;
}

function AuthorizeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth, user } = useAuthStore();
  const loginToken = searchParams.get("token") ?? "";
  const [state, setState] = useState<State>(loginToken ? "loading" : "error");
  const [errorMsg, setErrorMsg] = useState(
    loginToken ? "" : "No login token provided.",
  );
  const [info, setInfo] = useState<RequestInfo | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!loginToken) return;
    checkAuth().then(async (ok) => {
      if (!ok) {
        router.push(
          `/auth/login?redirect=${encodeURIComponent(`/agent/authorize?token=${loginToken}`)}`,
        );
        return;
      }
      try {
        const res = await api.get(
          `/v1/auth/cli-login/info/${encodeURIComponent(loginToken)}`,
          { _skipToast: true },
        );
        setInfo(res.data);
        setState("ready");
      } catch (err) {
        setState("error");
        setErrorMsg(getErrorMessage(err));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginToken]);

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("authorizing");
    setErrorMsg("");
    try {
      await api.post(
        "/v1/auth/cli-login/authorize",
        { loginToken, userCode: code },
        { _skipToast: true },
      );
      setState("success");
    } catch (err) {
      setState("ready");
      setErrorMsg(getErrorMessage(err));
    }
  };

  const handleDeny = async () => {
    try {
      await api.post(
        "/v1/auth/cli-login/deny",
        { loginToken },
        { _skipToast: true },
      );
    } catch {
      // expired already — nothing to deny
    }
    setState("denied");
  };

  if (state === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-zinc-400 font-medium">Verifying your session...</p>
      </div>
    );
  }

  if (state === "success" || state === "denied") {
    const ok = state === "success";
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={`h-16 w-16 rounded-2xl flex items-center justify-center border ${ok ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-500/10 border-zinc-500/20"}`}
        >
          {ok ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          ) : (
            <XCircle className="h-8 w-8 text-zinc-400" />
          )}
        </div>
        <h2 className="text-2xl font-serif text-white">
          {ok ? "CLI Authorized" : "Request Denied"}
        </h2>
        <p className="text-zinc-400 max-w-xs">
          {ok
            ? "Your agent CLI is now authenticated. You can close this tab and return to your terminal."
            : "The terminal was not given access. You can close this tab."}
        </p>
        <Link
          href="/dashboard"
          className="text-primary text-sm hover:underline"
        >
          Go to Dashboard
        </Link>
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
    <form
      onSubmit={handleAuthorize}
      className="flex flex-col items-center gap-6 text-center w-full max-w-sm"
    >
      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Terminal className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-serif text-white">Authorize CLI Agent</h2>
        <p className="text-zinc-400 text-sm">
          A terminal is requesting access to your SynqDB account.
        </p>
      </div>

      <div className="w-full glass rounded-2xl border border-white/5 p-4 text-left space-y-3 text-sm">
        <div className="flex items-center gap-2 text-zinc-300 font-medium">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          Authorizing as <span className="text-white">{user?.email}</span>
        </div>
        <dl className="pl-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-zinc-400">
          <dt>Device</dt>
          <dd className="text-white font-mono truncate">
            {info?.hostname ?? "Unknown"}
          </dd>
          <dt>IP address</dt>
          <dd className="text-white font-mono">{info?.ip ?? "Unknown"}</dd>
          <dt>Requested</dt>
          <dd className="text-white">
            {info ? new Date(info.requestedAt).toLocaleTimeString() : ""}
          </dd>
        </dl>
      </div>

      <label className="w-full text-left space-y-2">
        <span className="text-xs text-zinc-400">
          Enter the code shown in{" "}
          <span className="font-semibold text-zinc-200">your</span> terminal
        </span>
        <input
          autoFocus
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX"
          maxLength={9}
          autoComplete="off"
          spellCheck={false}
          className="w-full text-center tracking-[0.3em] font-mono text-lg bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {errorMsg && (
          <span className="block text-xs text-red-400">{errorMsg}</span>
        )}
      </label>

      <p className="text-zinc-500 text-xs">
        Only continue if you started{" "}
        <span className="text-zinc-300 font-mono">synqdb-agent login</span>{" "}
        yourself. Never enter a code someone else sent you. Don&apos;t see a
        code? Update the agent with{" "}
        <span className="font-mono text-zinc-300">
          npm i -g synqdb-agent@latest
        </span>
        .
      </p>

      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={handleDeny}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors text-sm font-medium"
        >
          Deny
        </button>
        <button
          type="submit"
          disabled={
            state === "authorizing" || code.replace(/[^A-Z0-9]/g, "").length < 8
          }
          className="flex-1 py-2.5 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state === "authorizing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Authorize
        </button>
      </div>
    </form>
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
