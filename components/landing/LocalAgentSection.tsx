"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  ArrowRight,
  Wifi,
  WifiOff,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Shield,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

// ── Animated terminal visual ────────────────────────────────────────────────

const TERMINAL_LINES = [
  { delay: 0, text: "$ synqdb-agent login", type: "cmd" },
  { delay: 700, text: "Opening browser for authentication...", type: "info" },
  { delay: 1400, text: "Waiting for approval...", type: "muted" },
  {
    delay: 2100,
    text: "✓ Authenticated — key saved to ~/.synqdb-agent",
    type: "success",
  },
  { delay: 2800, text: "$ synqdb-agent", type: "cmd" },
  {
    delay: 3300,
    text: "✓ Connected — serving cluster: local-dev",
    type: "success",
  },
];

const TerminalVisual = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay + 600);
    });
  }, []);

  const colorClass = (type: string) => {
    if (type === "cmd") return "text-foreground";
    if (type === "success") return "text-accent-fg";
    if (type === "query") return "text-accent-fg";
    if (type === "result") return "text-muted-foreground";
    return "text-subtle";
  };

  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-ink/[0.02]">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-err/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-warn/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-ok/50" />
        </div>
        <span className="text-[11px] text-subtle font-mono ml-2">terminal</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] text-accent-fg font-medium">Live</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 font-mono text-[11px] space-y-1.5 min-h-[180px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={`leading-relaxed transition-opacity duration-300 ${colorClass(line.type)}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines > 0 && visibleLines < TERMINAL_LINES.length && (
          <span className="inline-block w-1.5 h-3 bg-primary animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
};

// ── Architecture diagram ─────────────────────────────────────────────────────

const ArchDiagram = () => (
  <div className="flex items-center justify-center gap-2 flex-wrap">
    {[
      { icon: <Laptop className="h-4 w-4" />, label: "Your Browser" },
      { arrow: true },
      {
        icon: <Shield className="h-4 w-4" />,
        label: "SynqDB API",
        highlight: true,
      },
      { arrow: true },
      { icon: <Wifi className="h-4 w-4" />, label: "WebSocket", dim: true },
      { arrow: true },
      { icon: <Terminal className="h-4 w-4" />, label: "Agent CLI" },
      { arrow: true },
      { icon: <Laptop className="h-4 w-4" />, label: "Local DB" },
    ].map((item, i) => {
      if ("arrow" in item) {
        return (
          <ArrowRight key={i} className="h-3 w-3 text-subtle/70 shrink-0" />
        );
      }
      return (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div
            className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${
              item.highlight
                ? "bg-primary/10 border-primary/30 text-accent-fg"
                : item.dim
                  ? "bg-ink/[0.02] border-border text-subtle"
                  : "bg-ink/[0.03] border-border text-muted-foreground"
            }`}
          >
            {item.icon}
          </div>
          <span className="text-[11px] text-subtle font-medium text-center">
            {item.label}
          </span>
        </div>
      );
    })}
  </div>
);

// ── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Install the agent",
    body: "Install once globally, or run directly with npx — no configuration files needed.",
    code: "npm install -g synqdb-agent",
  },
  {
    n: "02",
    title: "Log in via browser",
    body: "One command opens your browser. Log in and click Authorize — no key to copy or paste.",
    code: "synqdb-agent login",
  },
  {
    n: "03",
    title: "Start the agent",
    body: "The agent connects outbound to SynqDB — no firewall changes or port forwarding required.",
    code: "synqdb-agent",
  },
];

// ── Pill badges ──────────────────────────────────────────────────────────────

const PILLS = [
  { icon: <WifiOff className="h-3 w-3" />, label: "No port forwarding" },
  { icon: <Shield className="h-3 w-3" />, label: "No VPN required" },
  { icon: <Zap className="h-3 w-3" />, label: "Sub-5ms relay overhead" },
  { icon: <Terminal className="h-3 w-3" />, label: "Browser-based login" },
];

// ── Main export ──────────────────────────────────────────────────────────────

export const LocalAgentSection = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ── Header ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-xl bg-bg-200 border border-border flex items-center justify-center">
                <Laptop className="h-4 w-4 text-subtle" />
              </div>
              <span className="text-accent-fg text-[11px] font-medium">
                Local Agent
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight font-semibold">
              Your local DB.
              <br />
              <span className="text-accent-fg">Managed from anywhere.</span>
            </h2>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-end gap-6"
          >
            <p className="text-xl text-subtle leading-relaxed">
              Production servers can&apos;t reach{" "}
              <code className="text-muted-foreground bg-ink/5 px-1.5 py-0.5 rounded text-sm font-mono">
                localhost
              </code>{" "}
              on your machine. The SynqDB relay agent bridges that gap —
              securely, with a single command.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {PILLS.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-accent-fg text-[11px] font-medium"
                >
                  {p.icon}
                  {p.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Architecture ── */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 p-6 rounded-xl border border-border bg-ink/[0.01]"
        >
          <p className="text-[11px] text-subtle text-center mb-6">
            How it works
          </p>
          <ArchDiagram />
          <p className="text-xs text-subtle text-center mt-6 leading-relaxed max-w-lg mx-auto">
            The agent opens an{" "}
            <span className="text-muted-foreground">outbound</span> WebSocket
            connection to SynqDB. Your browser sends queries via the API, which
            routes them through the persistent socket — so your local database
            never needs to be publicly reachable.
          </p>
        </motion.div>

        {/* ── Steps + Terminal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Steps */}
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                custom={i + 3}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group flex gap-5"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center">
                  <span className="text-[11px] font-medium text-accent-fg">
                    {step.n}
                  </span>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-subtle leading-relaxed mb-3">
                    {step.body}
                  </p>
                  {step.code && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-primary/20 bg-primary/[0.04] w-fit">
                      <code className="text-[11px] font-mono text-accent-fg">
                        {step.code}
                      </code>
                      <button
                        onClick={() => handleCopy(step.code!, i)}
                        className="text-subtle hover:text-foreground transition-colors"
                        title="Copy"
                      >
                        {copiedIdx === i ? (
                          <Check className="h-3.5 w-3.5 text-subtle" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* That's it callout */}
            <motion.div
              custom={6}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 pl-15"
            >
              <CheckCircle2 className="h-4 w-4 text-accent-fg shrink-0" />
              <p className="text-xs text-muted-foreground">
                That&apos;s it. Browse tables, run AI queries, and explore your
                local schema — exactly like a remote cluster.
              </p>
            </motion.div>
          </div>

          {/* Terminal */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <TerminalVisual />

            {/* PM2 tip */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-ink/[0.01]">
              <Zap className="h-4 w-4 text-accent-fg shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-foreground/80 mb-1">
                  Keep it running
                </p>
                <p className="text-[11px] text-subtle leading-relaxed">
                  Use{" "}
                  <code className="text-muted-foreground font-mono">
                    pm2 start synqdb-agent
                  </code>{" "}
                  to persist the agent across reboots. Run{" "}
                  <code className="text-muted-foreground font-mono">
                    synqdb-agent login
                  </code>{" "}
                  once first — credentials are saved automatically to{" "}
                  <code className="text-muted-foreground font-mono">
                    ~/.synqdb-agent
                  </code>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
