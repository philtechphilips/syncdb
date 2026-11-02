"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Play, Check } from "lucide-react";
import { SynqLogo } from "@/components/ui/SynqLogo";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const DashboardMockup = () => (
  <div className="relative w-full rounded-xl overflow-hidden border border-border bg-background">
    {/* Window chrome */}
    <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <div className="flex items-center gap-1.5">
        <div className="h-3 w-3 rounded-full bg-err/50" />
        <div className="h-3 w-3 rounded-full bg-warn/50" />
        <div className="h-3 w-3 rounded-full bg-ok/50" />
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-ink/[0.04] border border-border">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[11px] font-mono text-subtle">
          synqdb.app / dashboard
        </span>
      </div>
      <div className="w-16" />
    </div>

    <div className="flex" style={{ height: 360 }}>
      {/* Sidebar */}
      <div className="w-44 border-r border-border bg-background flex flex-col shrink-0 p-3 gap-3">
        {/* Cluster list */}
        <div>
          <p className="text-[11px] text-subtle mb-2 px-1">Clusters</p>
          {[
            { name: "postgres-prod", dot: "#16a34a", active: true },
            { name: "mysql-staging", dot: "#4479A1", active: false },
            { name: "mssql-replica", dot: "#A91D22", active: false },
          ].map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-mono mb-0.5 cursor-default transition-colors ${
                c.active
                  ? "bg-primary/10 border border-primary/20 text-foreground"
                  : "text-subtle"
              }`}
            >
              <div
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: c.dot }}
              />
              <span className="truncate">{c.name}</span>
            </div>
          ))}
        </div>

        {/* Table list */}
        <div className="mt-2">
          <p className="text-[11px] text-subtle mb-2 px-1">Tables</p>
          {["users", "orders", "products", "sessions"].map((t, i) => (
            <div
              key={i}
              className={`px-2 py-1 text-[11px] font-mono rounded cursor-default flex items-center gap-1.5 mb-0.5 ${
                i === 0 ? "text-accent-fg" : "text-subtle"
              }`}
            >
              <span className="opacity-40">▸</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center border-b border-border px-4 gap-1">
          {["Query Editor", "Data Explorer", "ER Diagram"].map((tab, i) => (
            <div
              key={i}
              className={`px-3 py-2.5 text-[11px] font-medium border-b-2 cursor-default transition-colors whitespace-nowrap ${
                i === 0
                  ? "border-primary text-foreground"
                  : "border-transparent text-subtle"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* SQL Editor */}
        <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-hidden">
          {[
            [
              { t: "SELECT ", c: "var(--color-syn-kw)" },
              { t: "u.name, ", c: "var(--color-syn-text)" },
              { t: "COUNT", c: "var(--color-syn-fn)" },
              { t: "(o.id) ", c: "var(--color-syn-text)" },
              { t: "AS ", c: "var(--color-syn-kw)" },
              { t: "order_count", c: "var(--color-syn-str)" },
            ],
            [
              { t: "FROM ", c: "var(--color-syn-kw)" },
              { t: "users u", c: "var(--color-syn-text)" },
            ],
            [
              { t: "  JOIN ", c: "var(--color-syn-kw)" },
              { t: "orders o ", c: "var(--color-syn-text)" },
              { t: "ON ", c: "var(--color-syn-kw)" },
              { t: "u.id = o.user_id", c: "var(--color-syn-text)" },
            ],
            [
              { t: "WHERE ", c: "var(--color-syn-kw)" },
              { t: "u.status = ", c: "var(--color-syn-text)" },
              { t: "'active'", c: "var(--color-syn-str)" },
            ],
            [
              { t: "GROUP BY ", c: "var(--color-syn-kw)" },
              { t: "u.name", c: "var(--color-syn-text)" },
            ],
            [
              { t: "ORDER BY ", c: "var(--color-syn-kw)" },
              { t: "order_count ", c: "var(--color-syn-text)" },
              { t: "DESC", c: "var(--color-syn-kw)" },
            ],
            [
              { t: "LIMIT ", c: "var(--color-syn-kw)" },
              { t: "10", c: "var(--color-syn-str)" },
              { t: ";", c: "var(--color-syn-comment)" },
            ],
          ].map((line, li) => (
            <div key={li} className="flex items-start gap-3">
              <span className="text-subtle/70 select-none w-4 text-right shrink-0 text-[11px] mt-0.5">
                {li + 1}
              </span>
              <span>
                {line.map((tok, ti) => (
                  <span key={ti} style={{ color: tok.c }}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </div>
          ))}

          {/* Blinking cursor */}
          <div className="flex items-start gap-3 mt-0.5">
            <span className="text-subtle/70 select-none w-4 text-right shrink-0 text-[11px]">
              8
            </span>
            <span className="inline-block h-3.5 w-1.5 bg-primary/80 animate-pulse rounded-sm" />
          </div>
        </div>

        {/* Results strip */}
        <div className="border-t border-border bg-background px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
              <span className="text-[11px] font-mono text-muted-foreground">
                247 rows · 8ms
              </span>
            </div>
            <span className="text-subtle/70 text-[11px]">·</span>
            <span className="text-[11px] font-mono text-subtle">
              postgres-prod
            </span>
          </div>
          <div className="flex gap-1.5">
            {["CSV", "JSON", "PDF"].map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded bg-ink/[0.04] text-[11px] font-mono text-subtle border border-border"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Hero = ({ onLaunch }: { onLaunch: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>

      {/* Subtle grid */}
      <div className="absolute inset-0 tech-grid opacity-[0.018] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-32 pb-20">
        {/* Announcement badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center mb-10"
        >
          <button
            onClick={onLaunch}
            className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/[0.06] text-xs font-medium text-foreground/80 hover:border-primary/60 hover:text-foreground transition-all duration-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Now in public beta — 4 database engines supported
            <ArrowRight className="h-3 w-3 text-accent-fg group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-[clamp(2.5rem,6.5vw,4.75rem)] font-semibold text-foreground leading-[1.05] tracking-tight mb-8"
        >
          One Interface.
          <br />
          <span className="text-accent-fg">Every Database.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Connect PostgreSQL, MySQL, MSSQL, and SQLite in a single dashboard.
          Built for engineering teams who need speed, clarity, and control.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <button
            onClick={onLaunch}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-medium text-sm transition-all hover:bg-primary-hover shadow-[0_1px_2px_rgb(67_56_202/0.25)] w-full sm:w-auto justify-center"
          >
            Get started — it&apos;s free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-border text-foreground text-sm font-medium hover:bg-ink/[0.05] hover:border-line-strong transition-all w-full sm:w-auto justify-center">
            <div className="h-6 w-6 rounded-full bg-ink/10 flex items-center justify-center">
              <Play className="h-2.5 w-2.5 text-foreground fill-white ml-0.5" />
            </div>
            Watch demo
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-16 text-xs text-subtle"
        >
          {[
            "No credit card required",
            "Free forever plan",
            "Open source friendly",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-accent-fg shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow beneath */}

          {/* Gradient border wrapper */}
          <div className="relative rounded-xl p-[1px] bg-gradient-to-b from-ink/12 via-ink/5 to-transparent">
            <DashboardMockup />
          </div>

          {/* Floating badge — query time */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 md:right-8 flex items-center gap-2 px-4 py-2 rounded-full border border-ok/20 bg-background/90 backdrop-blur-md shadow-lg"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
            <span className="text-[11px] font-mono text-ok font-medium">
              8ms avg query
            </span>
          </motion.div>

          {/* Floating badge — engines */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-4 -left-4 md:left-8 flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-background/90 backdrop-blur-md shadow-lg"
          >
            <div className="flex -space-x-1">
              {["#336791", "#4479A1", "#A91D22", "#003B57"].map((c, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-full border border-background"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              4 engines connected
            </span>
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-20 pt-12 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto text-center"
        >
          {[
            { val: "4", label: "DB Engines Supported" },
            { val: "Free", label: "No Credit Card Needed" },
            { val: "1", label: "Unified Dashboard" },
            { val: "Open Beta", label: "Join Early" },
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-2xl md:text-3xl text-foreground group-hover:text-accent-fg transition-colors duration-300 tracking-tight font-semibold">
                {stat.val}
              </div>
              <div className="text-[11px] font-medium text-subtle mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-[1px] bg-gradient-to-b from-primary/30 to-transparent" />
      </motion.div>
    </section>
  );
};
