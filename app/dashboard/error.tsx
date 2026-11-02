"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function DashboardError({
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
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-err/10 border border-err/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-err" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1.5">
            Failed to load this page
          </h2>
          <p className="text-sm text-subtle leading-relaxed">
            {error.message || "An unexpected error occurred in the dashboard."}
          </p>
          {error.digest && (
            <p className="mt-2 text-[11px] font-mono text-subtle/70">
              {error.digest}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            Retry
          </button>
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-foreground text-xs font-medium hover:bg-ink/[0.05] transition-all"
          >
            <Home className="h-3 w-3" />
            Dashboard home
          </a>
        </div>
      </div>
    </div>
  );
}
