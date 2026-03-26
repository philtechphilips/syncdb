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
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-1.5">
            Failed to load this page
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {error.message || "An unexpected error occurred in the dashboard."}
          </p>
          {error.digest && (
            <p className="mt-2 text-[10px] font-mono text-zinc-700">
              {error.digest}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            Retry
          </button>
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 text-white text-xs font-medium hover:bg-white/[0.05] transition-all"
          >
            <Home className="h-3 w-3" />
            Dashboard home
          </a>
        </div>
      </div>
    </div>
  );
}
