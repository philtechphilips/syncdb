"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Download,
  Search,
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────

const ROWS = [
  {
    name: "Sarah Chen",
    email: "sarah@linear.io",
    status: "active",
    plan: "Pro",
    arr: "$12,400",
    joined: "Jan 12, 2024",
  },
  {
    name: "Marcus Thorne",
    email: "marcus@vortex.dev",
    status: "active",
    plan: "Pro",
    arr: "$9,600",
    joined: "Jan 28, 2024",
  },
  {
    name: "Leo Hashimoto",
    email: "leo@hyperion.co",
    status: "active",
    plan: "Community",
    arr: "—",
    joined: "Feb 3, 2024",
  },
  {
    name: "Priya Rao",
    email: "priya@nexus.io",
    status: "active",
    plan: "Pro",
    arr: "$6,000",
    joined: "Feb 17, 2024",
  },
  {
    name: "Daniel Park",
    email: "dan@stack.com",
    status: "inactive",
    plan: "Community",
    arr: "—",
    joined: "Mar 1, 2024",
  },
];

const COLUMNS = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Status", key: "status" },
  { label: "Plan", key: "plan" },
  { label: "ARR", key: "arr" },
  { label: "Joined", key: "joined" },
];

const CHIPS = [
  { field: "status", op: "is not", value: "deleted" },
  { field: "plan", op: "is", value: "Pro" },
];

const STATUS_CLS: Record<string, string> = {
  active: "bg-ok/10 border-ok/20 text-ok",
  inactive: "bg-ink/[0.05] border-border text-subtle",
};
const PLAN_CLS: Record<string, string> = {
  Pro: "bg-primary/10 border-primary/20 text-accent-fg",
  Community: "bg-ink/5 border-border text-subtle",
};

// ── Table mockup ─────────────────────────────────────────────────────────────

const DataTableMockup = () => {
  const [sortCol, setSortCol] = useState(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [chips, setChips] = useState(CHIPS);

  const toggle = (i: number) => {
    if (i === sortCol) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(i);
      setSortDir("asc");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink/[0.03] border border-border w-36 shrink-0">
          <Search className="h-3 w-3 text-subtle" />
          <span className="text-[11px] font-mono text-subtle">Search…</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          <AnimatePresence>
            {chips.map((c, i) => (
              <motion.div
                key={c.field + c.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/8 border border-primary/18 text-[11px] font-mono whitespace-nowrap"
              >
                <span className="text-muted-foreground">{c.field}</span>
                <span className="text-accent-fg/60 mx-0.5">{c.op}</span>
                <span className="text-foreground">&quot;{c.value}&quot;</span>
                <button
                  onClick={() =>
                    setChips((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="ml-0.5 text-subtle hover:text-foreground transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setChips(CHIPS)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-medium text-subtle hover:text-foreground hover:border-line-strong transition-colors"
          >
            <SlidersHorizontal className="h-3 w-3" />
            Filter
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[11px] font-medium text-subtle hover:text-foreground hover:border-line-strong transition-colors">
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[560px]">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col, i) => (
                <th
                  key={col.key}
                  onClick={() => toggle(i)}
                  className="px-4 py-2.5 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[11px] font-medium transition-colors ${sortCol === i ? "text-foreground" : "text-subtle group-hover:text-muted-foreground"}`}
                    >
                      {col.label}
                    </span>
                    {sortCol === i ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3 text-subtle" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-subtle" />
                      )
                    ) : (
                      <ChevronDown className="h-3 w-3 text-subtle/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <motion.tr
                key={row.email}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border hover:bg-primary/[0.025] transition-colors cursor-default"
              >
                <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-4 py-2.5 text-subtle font-mono text-[11px] whitespace-nowrap">
                  {row.email}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${STATUS_CLS[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${PLAN_CLS[row.plan]}`}
                  >
                    {row.plan}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                  {row.arr}
                </td>
                <td className="px-4 py-2.5 text-subtle font-mono text-[11px] whitespace-nowrap">
                  {row.joined}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-ok" />
            <span className="text-[11px] font-mono text-subtle">
              <span className="text-foreground">5</span> of{" "}
              <span className="text-foreground">2,847</span> rows · 14ms
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <div
              key={p}
              className={`h-5 w-5 rounded flex items-center justify-center text-[11px] font-medium cursor-pointer transition-colors ${p === 1 ? "bg-primary/15 border border-primary/25 text-accent-fg" : "text-subtle hover:text-foreground"}`}
            >
              {p}
            </div>
          ))}
          <span className="text-subtle/70 text-[11px] ml-1">…</span>
        </div>
      </div>
    </div>
  );
};

// ── Section ──────────────────────────────────────────────────────────────────

export const DataExplorerSection = () => (
  <section className="py-32 bg-background relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="lg:col-span-7 order-2 lg:order-1"
        >
          <div className="rounded-xl p-[1px] bg-gradient-to-b from-ink/10 via-ink/[0.04] to-transparent">
            <DataTableMockup />
          </div>
        </motion.div>

        {/* Copy */}
        <div className="lg:col-span-5 order-1 lg:order-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent-fg text-[11px] font-medium block mb-3">
              Data Explorer
            </span>
            <h2 className="text-5xl md:text-6xl text-foreground leading-[1.1] tracking-tight font-semibold">
              Inspect.
              <br />
              <span className="text-accent-fg">Without limits.</span>
            </h2>
            <p className="text-lg text-subtle leading-relaxed mt-6">
              Go beyond query results. The Data Explorer gives you a live,
              filterable, sortable view of any table — with no SQL required.
              Click the filter chips above to see it in action.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { stat: "10", label: "Concurrent filters" },
              { stat: "Sub-20ms", label: "Server-side response" },
              { stat: "2,847+", label: "Rows handled live" },
              { stat: "3", label: "Export formats" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl border border-border bg-ink/[0.02] space-y-1"
              >
                <div className="text-xl text-foreground">{item.stat}</div>
                <div className="text-[11px] font-medium text-subtle">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-l from-primary/15 to-transparent" />
  </section>
);
