"use client";

import React from "react";
import {
  Sparkles,
  LayoutGrid,
  Globe2,
  ShieldCheck,
  Search,
  MousePointerClick,
} from "lucide-react";
import { motion } from "framer-motion";

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

// ── Bento card sub-components ──────────────────────────────────────────────

const AICopilotCard = () => (
  <div className="flex-1 flex flex-col justify-between min-h-0">
    {/* Fake prompt → response */}
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <div className="h-5 w-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            U
          </span>
        </div>
        <div className="px-3 py-2 rounded-md bg-ink/[0.04] border border-border text-xs text-muted-foreground font-mono leading-relaxed">
          Show me users who signed up last month and haven&apos;t placed an
          order yet
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="h-2.5 w-2.5 text-subtle" />
        </div>
        <div className="px-3 py-2 rounded-md bg-primary/[0.06] border border-primary/15 font-mono text-xs leading-loose">
          <span style={{ color: "var(--color-syn-kw)" }}>SELECT </span>
          <span className="text-foreground">u.name, u.email</span>
          <br />
          <span style={{ color: "var(--color-syn-kw)" }}>FROM </span>
          <span className="text-foreground">users u</span>
          <br />
          <span style={{ color: "var(--color-syn-kw)" }}>LEFT JOIN </span>
          <span className="text-foreground">orders o </span>
          <span style={{ color: "var(--color-syn-kw)" }}>ON </span>
          <span className="text-foreground">u.id = o.user_id</span>
          <br />
          <span style={{ color: "var(--color-syn-kw)" }}>WHERE </span>
          <span className="text-foreground">o.id </span>
          <span style={{ color: "var(--color-syn-kw)" }}>IS NULL</span>
          <br />
          <span className="text-foreground ml-2">AND u.created_at &gt;= </span>
          <span style={{ color: "var(--color-syn-str)" }}>
            NOW() - INTERVAL
          </span>
          <span style={{ color: "var(--color-syn-str)" }}>
            {" "}
            &apos;30 days&apos;
          </span>
          <span className="text-subtle">;</span>
        </div>
      </div>
    </div>
    {/* Typing indicator */}
    <div className="flex items-center gap-1.5 mt-4">
      <div
        className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
      <span className="text-[11px] text-subtle font-medium ml-1">
        Generating
      </span>
    </div>
  </div>
);

const ERDiagramCard = () => (
  <div className="flex-1 flex items-center justify-center min-h-0 relative">
    <svg viewBox="0 0 200 160" className="w-full max-w-[180px] opacity-80">
      {/* Table boxes */}
      <rect
        x="10"
        y="10"
        width="70"
        height="48"
        rx="6"
        fill="rgba(99,102,241,0.08)"
        stroke="rgba(99,102,241,0.3)"
        strokeWidth="1"
      />
      <rect
        x="12"
        y="12"
        width="66"
        height="10"
        rx="4"
        fill="rgba(99,102,241,0.2)"
      />
      <text
        x="45"
        y="20"
        textAnchor="middle"
        fill="var(--color-primary)"
        fontSize="5"
        fontWeight="bold"
      >
        USERS
      </text>
      {["id", "name", "email", "status"].map((f, i) => (
        <text
          key={f}
          x="16"
          y={30 + i * 7}
          fill="var(--color-subtle)"
          fontSize="4.5"
        >
          {f}
        </text>
      ))}

      <rect
        x="120"
        y="10"
        width="70"
        height="48"
        rx="6"
        fill="rgba(99,102,241,0.05)"
        stroke="rgba(127,127,127,0.20)"
        strokeWidth="1"
      />
      <rect
        x="122"
        y="12"
        width="66"
        height="10"
        rx="4"
        fill="rgba(127,127,127,0.12)"
      />
      <text
        x="155"
        y="20"
        textAnchor="middle"
        fill="var(--color-fg-muted)"
        fontSize="5"
        fontWeight="bold"
      >
        ORDERS
      </text>
      {["id", "user_id", "total", "status"].map((f, i) => (
        <text
          key={f}
          x="124"
          y={30 + i * 7}
          fill="var(--color-subtle)"
          fontSize="4.5"
        >
          {f}
        </text>
      ))}

      <rect
        x="65"
        y="100"
        width="70"
        height="40"
        rx="6"
        fill="rgba(99,102,241,0.05)"
        stroke="rgba(127,127,127,0.20)"
        strokeWidth="1"
      />
      <rect
        x="67"
        y="102"
        width="66"
        height="10"
        rx="4"
        fill="rgba(127,127,127,0.12)"
      />
      <text
        x="100"
        y="110"
        textAnchor="middle"
        fill="var(--color-fg-muted)"
        fontSize="5"
        fontWeight="bold"
      >
        PRODUCTS
      </text>
      {["id", "order_id", "name"].map((f, i) => (
        <text
          key={f}
          x="69"
          y={120 + i * 7}
          fill="var(--color-subtle)"
          fontSize="4.5"
        >
          {f}
        </text>
      ))}

      {/* Relation lines */}
      <path
        d="M80 34 L120 34"
        stroke="rgba(99,102,241,0.5)"
        strokeWidth="1"
        strokeDasharray="3,2"
        markerEnd="url(#arrow)"
      />
      <path
        d="M45 58 L100 100"
        stroke="rgba(127,127,127,0.25)"
        strokeWidth="1"
        strokeDasharray="3,2"
      />
      <path
        d="M155 58 L100 100"
        stroke="rgba(127,127,127,0.25)"
        strokeWidth="1"
        strokeDasharray="3,2"
      />

      <defs>
        <marker
          id="arrow"
          markerWidth="4"
          markerHeight="4"
          refX="2"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L4,2 L0,4 Z" fill="rgba(99,102,241,0.6)" />
        </marker>
      </defs>
    </svg>
  </div>
);

const FilterCard = () => (
  <div className="space-y-2">
    {[
      { field: "status", op: "is not", val: "deleted", active: true },
      { field: "created_at", op: "after", val: "2024-01-01", active: false },
      { field: "plan", op: "is", val: "pro", active: false },
    ].map((f, i) => (
      <div
        key={i}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-mono transition-colors ${
          f.active
            ? "bg-primary/[0.07] border-primary/20 text-foreground"
            : "bg-ink/[0.02] border-border text-subtle"
        }`}
      >
        <span className={f.active ? "text-foreground/80" : "text-subtle"}>
          {f.field}
        </span>
        <span className={f.active ? "text-accent-fg" : "text-subtle/70"}>
          {f.op}
        </span>
        <span className={f.active ? "text-foreground" : "text-subtle"}>
          &quot;{f.val}&quot;
        </span>
        {f.active && (
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </div>
    ))}
  </div>
);

const SecurityCard = () => (
  <div className="flex flex-col gap-3">
    {[
      { label: "AES-256 Encryption", ok: true },
      { label: "Zero-Trust Proxy", ok: true },
      { label: "ISO-27001 Ready", ok: true },
    ].map((item) => (
      <div key={item.label} className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-2.5 w-2.5 text-subtle" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────

const BENTO = [
  {
    id: "ai",
    label: "Engine-Aware AI",
    title: "Write SQL in plain English",
    description:
      "Our AI understands T-SQL, PL/pgSQL, and MySQL dialects. Describe what you need and get a correct query in seconds.",
    icon: <Sparkles className="h-4 w-4" />,
    colSpan: "lg:col-span-8",
    rowHeight: "min-h-[340px]",
    visual: <AICopilotCard />,
  },
  {
    id: "er",
    label: "Visual ER",
    title: "See your schema",
    description:
      "Drag-and-drop ER diagrams auto-generated from live schema introspection.",
    icon: <MousePointerClick className="h-4 w-4" />,
    colSpan: "lg:col-span-4",
    rowHeight: "min-h-[340px]",
    visual: <ERDiagramCard />,
  },
  {
    id: "filter",
    label: "Data Explorer",
    title: "10-operator filtering",
    description:
      "Server-side filters with no-code UI. Slice through millions of rows without writing a single query.",
    icon: <LayoutGrid className="h-4 w-4" />,
    colSpan: "lg:col-span-4",
    rowHeight: "min-h-[260px]",
    visual: <FilterCard />,
  },
  {
    id: "schema",
    label: "Schema Intel",
    title: "Deep introspection",
    description:
      "Auto-map foreign keys and relationships across all four database engines.",
    icon: <Globe2 className="h-4 w-4" />,
    colSpan: "lg:col-span-4",
    rowHeight: "min-h-[260px]",
    visual: null,
  },
  {
    id: "security",
    label: "Zero-Trust",
    title: "Industrial-grade security",
    description:
      "AES-256 encryption for all credentials, identity-aware proxy, and compliance-ready audit logs.",
    icon: <ShieldCheck className="h-4 w-4" />,
    colSpan: "lg:col-span-4",
    rowHeight: "min-h-[260px]",
    visual: <SecurityCard />,
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      className="py-28 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-accent-fg text-[11px] font-medium block mb-3">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight font-semibold">
              Everything you need.
              <br />
              <span className="text-accent-fg">Nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-end"
          >
            <p className="text-xl text-subtle leading-relaxed max-w-md">
              A purpose-built toolkit for developers who manage more than one
              database — with zero compromises on speed or usability.
            </p>
          </motion.div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {BENTO.map((card, i) => (
            <motion.div
              key={card.id}
              custom={i * 0.5}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`${card.colSpan} ${card.rowHeight} group relative rounded-xl border border-border bg-ink/[0.02] p-6 flex flex-col gap-5 hover:border-primary/20 hover:bg-ink/[0.03] transition-all duration-500 overflow-hidden`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>

              {/* Card header */}
              <div className="flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-bg-200 border border-border flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-medium text-accent-fg/60">
                      {card.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-subtle leading-relaxed max-w-xs group-hover:text-muted-foreground transition-colors duration-300">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Card visual */}
              {card.visual && (
                <div className="flex-1 min-h-0">{card.visual}</div>
              )}

              {/* Decorative accent for cards without visual */}
              {!card.visual && (
                <div className="flex-1 flex items-end">
                  <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
