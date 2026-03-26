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
          <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-serif text-white tracking-tight mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            An unexpected error occurred. You can try again or return to the
            dashboard.
          </p>
          {error.digest && (
            <p className="mt-2 text-[10px] font-mono text-zinc-700">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
          <a
            href="/dashboard"
            className="px-5 py-2.5 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/[0.05] transition-all"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
