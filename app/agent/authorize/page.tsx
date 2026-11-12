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
import { AuthShell } from "@/components/auth/AuthShell";
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
        <Loader2 className="h-10 w-10 text-accent-fg animate-spin" />
        <p className="text-muted-foreground">Verifying your session...</p>
      </div>
    );
  }

  if (state === "success" || state === "denied") {
    const ok = state === "success";
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={`h-16 w-16 rounded-xl flex items-center justify-center border ${ok ? "bg-ok/10 border-ok/20" : "bg-ink/[0.05] border-border"}`}
        >
          {ok ? (
            <CheckCircle2 className="h-8 w-8 text-ok" />
          ) : (
            <XCircle className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <h2 className="font-display text-[34px] leading-[1.05] tracking-[-0.03em] text-foreground">
          {ok ? "CLI Authorized" : "Request Denied"}
        </h2>
        <p className="text-muted-foreground max-w-xs">
          {ok
            ? "Your agent CLI is now authenticated. You can close this tab and return to your terminal."
            : "The terminal was not given access. You can close this tab."}
        </p>
        <Link
          href="/dashboard"
          className="text-accent-fg text-sm hover:underline"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-xl bg-err/10 border border-err/20 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-err" />
        </div>
        <h2 className="font-display text-[34px] leading-[1.05] tracking-[-0.03em] text-foreground">
          Authorization Failed
        </h2>
        <p className="text-muted-foreground max-w-xs">{errorMsg}</p>
        <Link
          href="/dashboard"
          className="text-accent-fg text-sm hover:underline"
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
      <div className="h-16 w-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Terminal className="h-8 w-8 text-accent-fg" />
      </div>

      <div className="space-y-1">
        <h2 className="font-display text-[34px] leading-[1.05] tracking-[-0.03em] text-foreground">
          Authorize CLI Agent
        </h2>
        <p className="text-muted-foreground text-sm">
          A terminal is requesting access to your SynqDB account.
        </p>
      </div>

      <div className="w-full rounded-2xl bg-sand p-4 text-left space-y-3 text-sm">
        <div className="flex items-center gap-2 text-foreground/80 font-medium">
          <ShieldCheck className="h-4 w-4 text-accent-fg shrink-0" />
          Authorizing as <span className="text-foreground">{user?.email}</span>
        </div>
        <dl className="pl-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
          <dt>Device</dt>
          <dd className="text-foreground font-mono truncate">
            {info?.hostname ?? "Unknown"}
          </dd>
          <dt>IP address</dt>
          <dd className="text-foreground font-mono">{info?.ip ?? "Unknown"}</dd>
          <dt>Requested</dt>
          <dd className="text-foreground">
            {info ? new Date(info.requestedAt).toLocaleTimeString() : ""}
          </dd>
        </dl>
      </div>

      <label className="w-full text-left space-y-2">
        <span className="text-xs text-muted-foreground">
          Enter the code shown in{" "}
          <span className="font-semibold text-foreground">your</span> terminal
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
          className="w-full text-center font-mono text-lg bg-background border border-line-strong rounded-xl h-12 px-4 text-foreground placeholder:text-subtle/70 outline-none focus:border-primary/60"
        />
        {errorMsg && <span className="block text-xs text-err">{errorMsg}</span>}
      </label>

      <p className="text-subtle text-xs">
        Only continue if you started{" "}
        <span className="text-foreground/80 font-mono">synqdb-agent login</span>{" "}
        yourself. Never enter a code someone else sent you. Don&apos;t see a
        code? Update the agent with{" "}
        <span className="font-mono text-foreground/80">
          npm i -g synqdb-agent@latest
        </span>
        .
      </p>

      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={handleDeny}
          className="flex-1 h-11 rounded-full bg-sand-2 text-foreground hover:bg-ink/[0.08] transition-colors text-[15px] font-medium"
        >
          Deny
        </button>
        <button
          type="submit"
          disabled={
            state === "authorizing" || code.replace(/[^A-Z0-9]/g, "").length < 8
          }
          className="flex-1 h-11 rounded-full bg-primary text-white font-medium text-[15px] hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
    <AuthShell>
      <div className="flex flex-col items-center">
        <Suspense
          fallback={<Loader2 className="h-8 w-8 text-accent-fg animate-spin" />}
        >
          <AuthorizeContent />
        </Suspense>
      </div>
    </AuthShell>
  );
}
