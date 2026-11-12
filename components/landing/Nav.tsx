"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logotype } from "@/components/ui/SynqLogo";
import { useAuthStore } from "@/store/useAuthStore";
import { EASE, pill } from "./motion";

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Databases", href: "#engines" },
  { label: "Local agent", href: "#agent" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

export function AnnouncementBar({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="px-3 pt-3 sm:px-5">
      <button
        onClick={onLaunch}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sand px-4 py-2 text-[13px] text-foreground transition-colors hover:bg-sand-2 sm:text-sm"
      >
        <span className="hidden text-muted-foreground sm:inline">
          Public beta:
        </span>
        <span className="font-medium">
          <span className="sm:hidden">Now in public beta</span>
          <span className="hidden sm:inline">
            PostgreSQL, MySQL, SQL Server and SQLite in one workspace
          </span>
        </span>
        <ArrowRight className="hidden h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:block" />
      </button>
    </div>
  );
}

export function Nav({ onLaunch }: { onLaunch: () => void }) {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-6 px-5">
        <Link href="/" aria-label="SynqDB home" className="shrink-0">
          <Logotype className="text-[21px]" />
        </Link>

        <div className="mx-auto hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] text-foreground/80 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:ml-0 lg:flex">
          {isAuthenticated ? (
            <Link href="/dashboard" className={pill("primary")}>
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {scrolled && (
                  <motion.button
                    key="cta"
                    onClick={onLaunch}
                    className={pill("primary")}
                    initial={{ opacity: 0, x: 8, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    Get started
                  </motion.button>
                )}
              </AnimatePresence>
              <Link href="/auth/login" className={pill("soft")}>
                Sign in
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-sand text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="overflow-hidden border-t border-border lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base text-foreground hover:bg-sand"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className={`${pill("primary")} col-span-2`}
                  >
                    Open dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" className={pill("soft")}>
                      Sign in
                    </Link>
                    <button onClick={onLaunch} className={pill("primary")}>
                      Get started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
