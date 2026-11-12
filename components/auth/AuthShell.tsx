"use client";

import React from "react";
import Link from "next/link";
import { Logotype } from "@/components/ui/SynqLogo";
import { FlowStack } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/motion";

/** Split layout for the sign-in pages: the form, and the landing page's look beside it. */
export function AuthShell({
  children,
  aside = true,
}: {
  children: React.ReactNode;
  aside?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <div className="flex min-h-screen flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label="SynqDB home">
            <Logotype className="text-[21px]" />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center py-12">
          <Reveal y={16} className="w-full max-w-[400px]">
            {children}
          </Reveal>
        </main>
        <footer className="text-[13px] text-subtle">
          © {new Date().getFullYear()} SynqDB
        </footer>
      </div>

      {aside && (
        <aside className="hidden p-3 lg:block">
          <div className="landing-panel sticky top-3 flex h-[calc(100vh-1.5rem)] flex-col items-center justify-center overflow-hidden rounded-[28px] px-12">
            <FlowStack className="w-full" />
            <p className="mt-12 max-w-[420px] text-center font-display text-[30px] leading-[1.15] tracking-[-0.03em] text-foreground">
              &ldquo;I manage PostgreSQL, MySQL, and SQLite from one tab.&rdquo;
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Chisom Eze · Lead Fullstack Engineer
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}

/** Serif page title and a short line under it. */
export function AuthHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.03em] text-foreground">
        {title}
      </h1>
      {children && (
        <p className="mt-3 text-[15px] text-muted-foreground">{children}</p>
      )}
    </div>
  );
}
