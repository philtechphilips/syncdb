"use client";

import React from "react";
import Link from "next/link";
import { Home, Search, Terminal } from "lucide-react";
import { Logotype } from "@/components/ui/SynqLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Brand Logo */}
        <Link
          href="/"
          className="inline-flex items-center group mb-16 opacity-80 hover:opacity-100 transition-opacity"
        >
          <Logotype className="text-[26px]" />
        </Link>

        {/* 404 Visual */}
        <div className="relative mb-12 select-none">
          <h1 className="text-[180px] md:text-[240px] font-semibold text-foreground/5 leading-none tracking-tight">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center translate-y-4">
            <div className="flex flex-col items-center gap-6">
              <div className="h-24 w-24 rounded-xl bg-ink/[0.02] border border-border flex items-center justify-center group">
                <Search className="h-10 w-10 text-accent-fg" />
              </div>
              <h2 className="text-3xl md:text-4xl text-foreground max-w-md tracking-tight font-semibold">
                Data cluster not found
              </h2>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-subtle text-lg mb-12 max-w-sm mx-auto leading-relaxed">
          The requested node seems to have been dropped or moved to a different
          coordinate.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-2 rounded-md bg-primary text-white font-medium flex items-center justify-center gap-3 transition-all group"
          >
            <Home className="h-4 w-4" />
            Back to Base
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-md bg-ink/[0.03] border border-border text-foreground font-semibold flex items-center justify-center gap-3 hover:bg-ink/[0.08] transition-all group"
          >
            <Terminal className="h-4 w-4 text-subtle group-hover:text-accent-fg transition-colors" />
            SQL Console
          </Link>
        </div>

        {/* Command Hint */}
        <div className="mt-16 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-ink/[0.01] text-[11px] font-mono text-subtle uppercase">
          <span className="h-1 w-1 rounded-full bg-err"></span>
          Packet Loss Detected: error_code_404
        </div>
      </div>

      {/* Decorations */}
      <div className="absolute top-10 left-10 p-4 border border-border rounded-xl opacity-20 hidden md:block">
        <div className="h-1 w-20 bg-primary/20 rounded-full mb-2"></div>
        <div className="h-1 w-12 bg-ink/10 rounded-full mb-2"></div>
        <div className="h-1 w-16 bg-ink/10 rounded-full"></div>
      </div>
      <div className="absolute bottom-10 right-10 p-4 border border-border rounded-xl opacity-20 hidden md:block">
        <div className="h-1 w-12 bg-ink/10 rounded-full mb-2"></div>
        <div className="h-1 w-20 bg-secondary/20 rounded-full mb-2"></div>
        <div className="h-1 w-16 bg-ink/10 rounded-full"></div>
      </div>
    </div>
  );
}
