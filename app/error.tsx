"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-xl bg-err/10 border border-err/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-err" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl text-foreground tracking-tight mb-2 font-semibold">
            Something went wrong
          </h1>
          <p className="text-sm text-subtle leading-relaxed">
            An unexpected error occurred. You can try again or return to the
            dashboard.
          </p>
          {error.digest && (
            <p className="mt-2 text-[11px] font-mono text-subtle/70">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
          <a
            href="/dashboard"
            className="px-5 py-2.5 rounded-full border border-border text-foreground text-sm font-medium hover:bg-ink/[0.05] transition-all"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
