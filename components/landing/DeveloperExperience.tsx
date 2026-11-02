"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlugZap, Terminal, TableProperties, Share2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: PlugZap,
    label: "Connect",
    title: "One-click cluster setup",
    description:
      "Paste a connection string or fill a form. SynqDB auto-detects your engine, tests the connection, and encrypts your credentials — all in under 10 seconds.",
    visual: <ConnectVisual />,
  },
  {
    number: "02",
    icon: Terminal,
    label: "Query",
    title: "Write SQL or ask in plain English",
    description:
      "Use the Monaco-powered editor with full syntax highlighting and auto-complete, or describe what you need to the AI copilot and get a dialect-correct query generated for you.",
    visual: <QueryVisual />,
  },
  {
    number: "03",
    icon: TableProperties,
    label: "Explore",
    title: "Browse any table visually",
    description:
      "Switch to the Data Explorer for a no-code, filter-and-sort view of any table. No query needed — just click, filter, and paginate through millions of rows.",
    visual: <ExploreVisual />,
  },
  {
    number: "04",
    icon: Share2,
    label: "Share",
    title: "Export, save, and collaborate",
    description:
      "Export results to CSV, JSON, or PDF. Save queries to your personal library. Share workspaces with your team so everyone works from the same source of truth.",
    visual: <ShareVisual />,
  },
];

// ── Step visuals ─────────────────────────────────────────────────────────────

function ConnectVisual() {
  return (
    <div className="space-y-3">
      {/* Connection form mock */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <p className="text-[11px] text-subtle">New Connection</p>
        {[
          { label: "Host", value: "db.prod.example.com" },
          { label: "Port", value: "5432" },
          { label: "Database", value: "production_db" },
          { label: "User", value: "readonly_user" },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-subtle w-16 shrink-0">
              {f.label}
            </span>
            <div className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-ink/[0.02] font-mono text-[11px] text-foreground/80">
              {f.value}
            </div>
          </div>
        ))}
      </div>
      {/* Status */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-ok/20 bg-ok/[0.05]">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
          <span className="text-[11px] font-medium text-ok">
            Connected · postgres-prod
          </span>
        </div>
        <span className="text-[11px] font-mono text-subtle">8ms</span>
      </div>
    </div>
  );
}

function QueryVisual() {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* AI prompt bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-primary/[0.04]">
        <div className="h-4 w-4 rounded bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <span className="text-[11px] text-accent-fg font-medium">AI</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground italic">
          &ldquo;top 10 users by revenue this quarter&rdquo;
        </span>
        <div className="ml-auto flex gap-0.5">
          <div
            className="h-1 w-1 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-1 w-1 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "100ms" }}
          />
          <div
            className="h-1 w-1 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "200ms" }}
          />
        </div>
      </div>
      {/* Generated SQL */}
      <div className="p-4 font-mono text-[11px] leading-relaxed space-y-0.5">
        {[
          [
            { t: "SELECT ", c: "var(--color-syn-kw)" },
            { t: "u.name, ", c: "var(--color-syn-text)" },
            { t: "SUM", c: "var(--color-syn-fn)" },
            { t: "(o.total) AS revenue", c: "var(--color-syn-text)" },
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
            { t: "o.created_at >= ", c: "var(--color-syn-text)" },
            { t: "date_trunc", c: "var(--color-syn-fn)" },
            { t: "('quarter', now())", c: "var(--color-syn-text)" },
          ],
          [
            { t: "GROUP BY ", c: "var(--color-syn-kw)" },
            { t: "u.name", c: "var(--color-syn-text)" },
          ],
          [
            { t: "ORDER BY ", c: "var(--color-syn-kw)" },
            { t: "revenue ", c: "var(--color-syn-text)" },
            { t: "DESC", c: "var(--color-syn-kw)" },
          ],
          [
            { t: "LIMIT ", c: "var(--color-syn-kw)" },
            { t: "10", c: "var(--color-syn-str)" },
            { t: ";", c: "var(--color-syn-comment)" },
          ],
        ].map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-subtle/70 w-3.5 text-right shrink-0 text-[11px]">
              {i + 1}
            </span>
            <span>
              {line.map((tok, j) => (
                <span key={j} style={{ color: tok.c }}>
                  {tok.t}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExploreVisual() {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Filter chips */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-background flex-wrap">
        {[
          { f: "status", op: "is", v: "active" },
          { f: "plan", op: "is", v: "Pro" },
        ].map((c) => (
          <div
            key={c.v}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/8 border border-primary/18 text-[11px] font-mono"
          >
            <span className="text-muted-foreground">{c.f}</span>
            <span className="text-accent-fg/60 mx-0.5">{c.op}</span>
            <span className="text-foreground">&ldquo;{c.v}&rdquo;</span>
          </div>
        ))}
        <span className="text-[11px] font-mono text-subtle ml-auto">
          1,204 rows
        </span>
      </div>
      {/* Mini table */}
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border">
            {["Name", "Plan", "MRR"].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left text-[11px] font-medium text-subtle"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Sarah Chen", "Pro", "$1,033"],
            ["Marcus Thorne", "Pro", "$800"],
            ["Priya Rao", "Pro", "$500"],
          ].map(([name, plan, mrr]) => (
            <tr
              key={name}
              className="border-b border-border hover:bg-primary/[0.025] transition-colors cursor-default"
            >
              <td className="px-3 py-2 text-foreground font-medium">{name}</td>
              <td className="px-3 py-2">
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-accent-fg text-[11px] font-medium">
                  {plan}
                </span>
              </td>
              <td className="px-3 py-2 font-mono text-muted-foreground">
                {mrr}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShareVisual() {
  return (
    <div className="space-y-2.5">
      {/* Export options */}
      <p className="text-[11px] text-subtle">Export results</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            fmt: "CSV",
            size: "14 KB",
            color: "text-ok",
            bg: "bg-ok/8 border-ok/15",
          },
          {
            fmt: "JSON",
            size: "22 KB",
            color: "text-accent-fg",
            bg: "bg-primary/8 border-primary/15",
          },
          {
            fmt: "PDF",
            size: "31 KB",
            color: "text-warn",
            bg: "bg-warn/8 border-warn/15",
          },
        ].map((e) => (
          <div
            key={e.fmt}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border cursor-pointer hover:scale-105 transition-transform ${e.bg}`}
          >
            <span className={`text-xs font-medium ${e.color}`}>.{e.fmt}</span>
            <span className="text-[11px] text-subtle font-mono">{e.size}</span>
          </div>
        ))}
      </div>
      {/* Saved query */}
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border bg-ink/[0.02]">
        <div className="h-6 w-6 rounded-lg bg-bg-200 border border-border flex items-center justify-center shrink-0">
          <Terminal className="h-3 w-3 text-subtle" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-foreground truncate">
            top-revenue-users-q1
          </p>
          <p className="text-[11px] text-subtle font-mono">
            Saved to library · shared with 3
          </p>
        </div>
        <div className="flex -space-x-1.5">
          {["#4338ca", "#336791", "#4479A1"].map((c) => (
            <div
              key={c}
              className="h-5 w-5 rounded-full border-2 border-background"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────

export const DeveloperExperience = () => {
  const [active, setActive] = useState(0);

  return (
    <section
      id="experience"
      className="py-32 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ink/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent-fg text-[11px] font-medium block mb-3"
          >
            How it works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight font-semibold"
          >
            From connection to
            <br />
            <span className="text-accent-fg">insight in minutes.</span>
          </motion.h2>
        </div>

        {/* Step layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step list */}
          <div className="lg:col-span-5 space-y-2">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = active === i;
              return (
                <motion.button
                  key={step.number}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setActive(i)}
                  className={`w-full text-left rounded-xl border p-5 transition-all duration-300 ${
                    isActive
                      ? "border-primary/30 bg-primary/[0.05]"
                      : "border-border bg-ink/[0.01] hover:border-line-strong hover:bg-ink/[0.02]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isActive
                          ? "bg-primary/15 border border-primary/30"
                          : "bg-ink/5 border border-border"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-colors ${isActive ? "text-accent-fg" : "text-subtle"}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-medium transition-colors ${isActive ? "text-accent-fg" : "text-subtle"}`}
                        >
                          {step.number} · {step.label}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-semibold transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.title}
                      </p>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-subtle leading-relaxed mt-2 overflow-hidden"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Visual panel */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="rounded-xl p-px bg-gradient-to-b from-ink/10 via-ink/[0.04] to-transparent">
              <div className="rounded-xl bg-background border border-border p-5">
                {/* Step label */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] font-medium text-subtle">
                    Step {STEPS[active].number} — {STEPS[active].label}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {STEPS[active].visual}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`transition-all duration-300 rounded-full ${
                    active === i
                      ? "h-1.5 w-6 bg-primary"
                      : "h-1.5 w-1.5 bg-ink/15 hover:bg-ink/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
