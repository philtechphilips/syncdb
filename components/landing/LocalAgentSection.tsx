"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  ArrowRight,
  Wifi,
  WifiOff,
  Terminal,
  Key,
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
  { delay: 0, text: "$ npx synqdb-agent a1b2c3d4-...", type: "cmd" },
  { delay: 700, text: "Connecting to api.synqdb.com...", type: "info" },
  { delay: 1400, text: "✓ Authenticated — serving cluster: local-dev", type: "success" },
  { delay: 2100, text: "Listening for queries...", type: "muted" },
  { delay: 2800, text: "> SELECT * FROM users LIMIT 5", type: "query" },
  { delay: 3300, text: "  5 rows returned in 2ms", type: "result" },
];

const TerminalVisual = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay + 600);
    });
  }, []);

  const colorClass = (type: string) => {
    if (type === "cmd") return "text-white";
    if (type === "success") return "text-primary";
    if (type === "query") return "text-blue-300";
    if (type === "result") return "text-zinc-400";
    return "text-zinc-500";
  };

  return (
    <div className="relative rounded-2xl border border-white/8 bg-black/60 overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] text-zinc-600 font-mono ml-2">terminal</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] text-primary font-bold uppercase tracking-widest">Live</span>
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
      { icon: <Shield className="h-4 w-4" />, label: "SynqDB API", highlight: true },
      { arrow: true },
      { icon: <Wifi className="h-4 w-4" />, label: "WebSocket", dim: true },
      { arrow: true },
      { icon: <Terminal className="h-4 w-4" />, label: "Agent CLI" },
      { arrow: true },
      { icon: <Laptop className="h-4 w-4" />, label: "Local DB" },
    ].map((item, i) => {
      if ("arrow" in item) {
        return (
          <ArrowRight key={i} className="h-3 w-3 text-zinc-700 shrink-0" />
        );
      }
      return (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div
            className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${
              item.highlight
                ? "bg-primary/10 border-primary/30 text-primary"
                : item.dim
                ? "bg-white/[0.02] border-white/5 text-zinc-600"
                : "bg-white/[0.03] border-white/8 text-zinc-400"
            }`}
          >
            {item.icon}
          </div>
          <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest text-center">
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
    title: "Create a Local Cluster",
    body: 'Toggle "Local Database" when adding a new connection. No host or port needed.',
  },
  {
    n: "02",
    title: "Get your Agent Key",
    body: "A unique key is generated for your cluster. Copy it from Project Settings anytime.",
  },
  {
    n: "03",
    title: "Run the agent",
    body: "One command on your machine — the agent connects outbound, no firewall changes required.",
    code: "npx synqdb-agent <key>",
  },
];

// ── Pill badges ──────────────────────────────────────────────────────────────

const PILLS = [
  { icon: <WifiOff className="h-3 w-3" />, label: "No port forwarding" },
  { icon: <Shield className="h-3 w-3" />, label: "No VPN required" },
  { icon: <Zap className="h-3 w-3" />, label: "Sub-5ms relay overhead" },
  { icon: <Key className="h-3 w-3" />, label: "Rotatable keys" },
];

// ── Main export ──────────────────────────────────────────────────────────────

export const LocalAgentSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx synqdb-agent <your-key>");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/[0.04] rounded-full blur-3xl" />
      </div>

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
              <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Laptop className="h-4 w-4 text-primary" />
              </div>
              <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">
                Local Agent
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-[1.1] tracking-tighter">
              Your local DB.
              <br />
              <span className="text-primary italic">Managed from anywhere.</span>
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
            <p className="text-xl text-zinc-500 font-medium leading-relaxed">
              Production servers can&apos;t reach{" "}
              <code className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded text-sm font-mono">
                localhost
              </code>{" "}
              on your machine. The SynqDB relay agent bridges that gap — securely, with a
              single command.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {PILLS.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider"
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
          className="mb-16 p-6 rounded-2xl border border-white/5 bg-white/[0.01]"
        >
          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest text-center mb-6">
            How it works
          </p>
          <ArchDiagram />
          <p className="text-xs text-zinc-600 text-center mt-6 leading-relaxed max-w-lg mx-auto">
            The agent opens an <span className="text-zinc-400">outbound</span> WebSocket connection to
            SynqDB. Your browser sends queries via the API, which routes them through the
            persistent socket — so your local database never needs to be publicly reachable.
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
                  <span className="text-[10px] font-black text-primary">{step.n}</span>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-3">{step.body}</p>
                  {step.code && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/20 bg-black/40 w-fit">
                      <code className="text-[11px] font-mono text-primary">{step.code}</code>
                      <button
                        onClick={handleCopy}
                        className="text-zinc-600 hover:text-zinc-300 transition-colors"
                        title="Copy"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-primary" />
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
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs text-zinc-400 font-medium">
                That&apos;s it. Browse tables, run AI queries, and explore your local schema —
                exactly like a remote cluster.
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
            <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-wider mb-1">
                  Keep it running
                </p>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Use <code className="text-zinc-400 font-mono">pm2 start synqdb-agent -- --save</code> to
                  persist the agent across reboots. The{" "}
                  <code className="text-zinc-400 font-mono">--save</code> flag stores your key locally
                  so you never have to pass it again.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
