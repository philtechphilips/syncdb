"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Download, Search } from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────

const ROWS = [
  { name: "Sarah Chen",    email: "sarah@linear.io",   status: "active",   plan: "Pro",       arr: "$12,400", joined: "Jan 12, 2024" },
  { name: "Marcus Thorne", email: "marcus@vortex.dev", status: "active",   plan: "Pro",       arr: "$9,600",  joined: "Jan 28, 2024" },
  { name: "Leo Hashimoto", email: "leo@hyperion.co",   status: "active",   plan: "Community", arr: "—",       joined: "Feb 3, 2024"  },
  { name: "Priya Rao",     email: "priya@nexus.io",    status: "active",   plan: "Pro",       arr: "$6,000",  joined: "Feb 17, 2024" },
  { name: "Daniel Park",   email: "dan@stack.com",     status: "inactive", plan: "Community", arr: "—",       joined: "Mar 1, 2024"  },
];

const COLUMNS = [
  { label: "Name",    key: "name"   },
  { label: "Email",   key: "email"  },
  { label: "Status",  key: "status" },
  { label: "Plan",    key: "plan"   },
  { label: "ARR",     key: "arr"    },
  { label: "Joined",  key: "joined" },
];

const CHIPS = [
  { field: "status", op: "is not", value: "deleted" },
  { field: "plan",   op: "is",     value: "Pro"     },
];

const STATUS_CLS: Record<string, string> = {
  active:   "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  inactive: "bg-zinc-500/10 border-zinc-600/20 text-zinc-500",
};
const PLAN_CLS: Record<string, string> = {
  Pro:       "bg-primary/10 border-primary/20 text-primary",
  Community: "bg-white/5 border-white/10 text-zinc-500",
};

// ── Table mockup ─────────────────────────────────────────────────────────────

const DataTableMockup = () => {
  const [sortCol, setSortCol] = useState(0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [chips, setChips] = useState(CHIPS);

  const toggle = (i: number) => {
    if (i === sortCol) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(i); setSortDir("asc"); }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-[#061018] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#040c14] flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 w-36 shrink-0">
          <Search className="h-3 w-3 text-zinc-600" />
          <span className="text-[10px] font-mono text-zinc-600">Search…</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          <AnimatePresence>
            {chips.map((c, i) => (
              <motion.div
                key={c.field + c.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/8 border border-primary/18 text-[9px] font-mono whitespace-nowrap"
              >
                <span className="text-zinc-400">{c.field}</span>
                <span className="text-primary/60 mx-0.5">{c.op}</span>
                <span className="text-white">&quot;{c.value}&quot;</span>
                <button
                  onClick={() => setChips((prev) => prev.filter((_, j) => j !== i))}
                  className="ml-0.5 text-zinc-600 hover:text-zinc-300 transition-colors"
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/8 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/15 transition-colors"
          >
            <SlidersHorizontal className="h-3 w-3" />
            Filter
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/8 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/15 transition-colors">
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[560px]">
          <thead>
            <tr className="border-b border-white/5">
              {COLUMNS.map((col, i) => (
                <th
                  key={col.key}
                  onClick={() => toggle(i)}
                  className="px-4 py-2.5 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-colors ${sortCol === i ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                      {col.label}
                    </span>
                    {sortCol === i ? (
                      sortDir === "asc"
                        ? <ChevronUp className="h-3 w-3 text-primary" />
                        : <ChevronDown className="h-3 w-3 text-primary" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                className="border-b border-white/[0.03] hover:bg-primary/[0.025] transition-colors cursor-default"
              >
                <td className="px-4 py-2.5 font-medium text-white whitespace-nowrap">{row.name}</td>
                <td className="px-4 py-2.5 text-zinc-500 font-mono text-[10px] whitespace-nowrap">{row.email}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_CLS[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${PLAN_CLS[row.plan]}`}>
                    {row.plan}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-zinc-400 whitespace-nowrap">{row.arr}</td>
                <td className="px-4 py-2.5 text-zinc-600 font-mono text-[10px] whitespace-nowrap">{row.joined}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 bg-[#040c14]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-mono text-zinc-500">
              <span className="text-white">5</span> of <span className="text-white">2,847</span> rows · 14ms
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <div key={p} className={`h-5 w-5 rounded flex items-center justify-center text-[9px] font-bold cursor-pointer transition-colors ${p === 1 ? "bg-primary/15 border border-primary/25 text-primary" : "text-zinc-600 hover:text-zinc-300"}`}>
              {p}
            </div>
          ))}
          <span className="text-zinc-700 text-[9px] ml-1">…</span>
        </div>
      </div>
    </div>
  );
};

// ── Section ──────────────────────────────────────────────────────────────────

export const DataExplorerSection = () => (
  <section className="py-32 bg-background relative overflow-hidden">
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="lg:col-span-7 order-2 lg:order-1"
        >
          <div className="rounded-2xl p-[1px] bg-gradient-to-b from-white/10 via-white/[0.04] to-transparent">
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
            <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase block mb-3">
              Data Explorer
            </span>
            <h2 className="text-5xl md:text-6xl font-serif text-white leading-[1.1] tracking-tighter">
              Inspect.
              <br />
              <span className="text-primary italic">Without limits.</span>
            </h2>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed mt-6">
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
              { stat: "10",      label: "Concurrent filters" },
              { stat: "Sub-20ms", label: "Server-side response" },
              { stat: "2,847+",  label: "Rows handled live" },
              { stat: "3",       label: "Export formats" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                <div className="text-xl font-serif text-white">{item.stat}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
    <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-l from-primary/15 to-transparent" />
  </section>
);
