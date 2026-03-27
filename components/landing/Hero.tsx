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
  <div className="relative w-full rounded-2xl overflow-hidden border border-white/8 bg-[#061018]">
    {/* Window chrome */}
    <div className="flex items-center justify-between px-4 py-3 bg-[#040c14] border-b border-white/5">
      <div className="flex items-center gap-1.5">
        <div className="h-3 w-3 rounded-full bg-red-500/50" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
        <div className="h-3 w-3 rounded-full bg-green-500/50" />
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/5">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-500">
          synqdb.app / dashboard
        </span>
      </div>
      <div className="w-16" />
    </div>

    <div className="flex" style={{ height: 360 }}>
      {/* Sidebar */}
      <div className="w-44 border-r border-white/5 bg-[#040c14] flex flex-col shrink-0 p-3 gap-3">
        {/* Cluster list */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2 px-1">
            Clusters
          </p>
          {[
            { name: "postgres-prod", dot: "#4CAF76", active: true },
            { name: "mysql-staging", dot: "#4479A1", active: false },
            { name: "mssql-replica", dot: "#A91D22", active: false },
          ].map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-mono mb-0.5 cursor-default transition-colors ${
                c.active
                  ? "bg-primary/10 border border-primary/20 text-white"
                  : "text-zinc-600"
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
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2 px-1">
            Tables
          </p>
          {["users", "orders", "products", "sessions"].map((t, i) => (
            <div
              key={i}
              className={`px-2 py-1 text-[10px] font-mono rounded cursor-default flex items-center gap-1.5 mb-0.5 ${
                i === 0 ? "text-primary" : "text-zinc-600"
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
        <div className="flex items-center border-b border-white/5 px-4 gap-1">
          {["Query Editor", "Data Explorer", "ER Diagram"].map((tab, i) => (
            <div
              key={i}
              className={`px-3 py-2.5 text-[9px] font-black uppercase tracking-widest border-b-2 cursor-default transition-colors whitespace-nowrap ${
                i === 0
                  ? "border-primary text-white"
                  : "border-transparent text-zinc-600"
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
              { t: "SELECT ", c: "#7DD3FC" },
              { t: "u.name, ", c: "#E2E8F0" },
              { t: "COUNT", c: "#FCD34D" },
              { t: "(o.id) ", c: "#E2E8F0" },
              { t: "AS ", c: "#7DD3FC" },
              { t: "order_count", c: "#86EFAC" },
            ],
            [
              { t: "FROM ", c: "#7DD3FC" },
              { t: "users u", c: "#E2E8F0" },
            ],
            [
              { t: "  JOIN ", c: "#7DD3FC" },
              { t: "orders o ", c: "#E2E8F0" },
              { t: "ON ", c: "#7DD3FC" },
              { t: "u.id = o.user_id", c: "#E2E8F0" },
            ],
            [
              { t: "WHERE ", c: "#7DD3FC" },
              { t: "u.status = ", c: "#E2E8F0" },
              { t: "'active'", c: "#FDBA74" },
            ],
            [
              { t: "GROUP BY ", c: "#7DD3FC" },
              { t: "u.name", c: "#E2E8F0" },
            ],
            [
              { t: "ORDER BY ", c: "#7DD3FC" },
              { t: "order_count ", c: "#E2E8F0" },
              { t: "DESC", c: "#7DD3FC" },
            ],
            [
              { t: "LIMIT ", c: "#7DD3FC" },
              { t: "10", c: "#FDBA74" },
              { t: ";", c: "#64748B" },
            ],
          ].map((line, li) => (
            <div key={li} className="flex items-start gap-3">
              <span className="text-zinc-700 select-none w-4 text-right shrink-0 text-[10px] mt-0.5">
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
            <span className="text-zinc-700 select-none w-4 text-right shrink-0 text-[10px]">
              8
            </span>
            <span className="inline-block h-3.5 w-1.5 bg-primary/80 animate-pulse rounded-sm" />
          </div>
        </div>

        {/* Results strip */}
        <div className="border-t border-white/5 bg-[#040c14] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400">
                247 rows · 8ms
              </span>
            </div>
            <span className="text-zinc-700 text-[10px]">·</span>
            <span className="text-[10px] font-mono text-zinc-600">
              postgres-prod
            </span>
          </div>
          <div className="flex gap-1.5">
            {["CSV", "JSON", "PDF"].map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono text-zinc-500 border border-white/5"
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/[0.06] blur-[140px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/[0.04] blur-[100px] rounded-full" />
      </div>

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
            className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/[0.06] text-xs font-medium text-zinc-300 hover:border-primary/60 hover:text-white transition-all duration-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Now in public beta — 4 database engines supported
            <ArrowRight className="h-3 w-3 text-primary group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-[clamp(3rem,10vw,7rem)] font-serif text-white leading-[1.05] tracking-tighter mb-8"
        >
          One Interface.
          <br />
          <span className="text-primary italic">Every Database.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
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
            className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-semibold text-sm transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 w-full sm:w-auto justify-center"
          >
            Get started — it&apos;s free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/[0.05] hover:border-white/20 transition-all w-full sm:w-auto justify-center">
            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="h-2.5 w-2.5 text-white fill-white ml-0.5" />
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
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-16 text-xs text-zinc-500"
        >
          {[
            "No credit card required",
            "Free forever plan",
            "Open source friendly",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-primary shrink-0" />
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
          <div className="absolute -inset-x-8 -top-6 bottom-0 bg-primary/[0.06] blur-3xl rounded-3xl pointer-events-none" />

          {/* Gradient border wrapper */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/12 via-white/5 to-transparent">
            <DashboardMockup />
          </div>

          {/* Floating badge — query time */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 md:right-8 flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-[#040c14]/90 backdrop-blur-md shadow-lg"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
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
            className="absolute -bottom-4 -left-4 md:left-8 flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-[#040c14]/90 backdrop-blur-md shadow-lg"
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
            <span className="text-[10px] font-mono text-zinc-400">
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
          className="mt-20 pt-12 border-t border-white/5 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { val: "10k+", label: "Active Engineers" },
            { val: "50M+", label: "Queries Per Day" },
            { val: "99.9%", label: "Uptime SLA" },
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-2xl md:text-3xl font-serif text-white group-hover:text-primary transition-colors duration-300">
                {stat.val}
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">
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
