"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightLeft,
  Braces,
  Database,
  FileKey2,
  GitCompareArrows,
  HardDrive,
  Laptop,
  Lock,
  ShieldCheck,
  Table2,
  Terminal,
  Workflow,
} from "lucide-react";
import { EASE, Reveal, WordsIn } from "./motion";
import { ENGINES, EngineIcon } from "./mockups";

/* ------------------------------------------------------------------ */
/* Engines                                                             */
/* ------------------------------------------------------------------ */

export function Engines() {
  return (
    <section
      id="engines"
      className="mx-auto max-w-[1100px] scroll-mt-24 px-5 pt-28"
    >
      <Reveal>
        <p className="text-center text-[15px] text-muted-foreground">
          Works with the databases you already run
        </p>
      </Reveal>
      <div className="mt-9 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
        {ENGINES.map((e, i) => (
          <Reveal
            key={e.name}
            delay={0.08 * i}
            className="group flex items-center justify-center gap-3"
          >
            <EngineIcon
              icon={e.icon}
              className="h-8 w-8 opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            />
            <span className="text-[19px] font-medium tracking-tight text-foreground/80 transition-colors group-hover:text-foreground">
              {e.name}
            </span>
          </Reveal>
        ))}
      </div>
      <div className="mt-20 h-px bg-border" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Problem / solution                                                  */
/* ------------------------------------------------------------------ */

type Mode = "problem" | "solution";

const TOOLS: {
  problem: string;
  solution: string;
  icon: React.ReactNode;
  at: Record<Mode, { x: number; y: number; r: number }>;
}[] = [
  {
    problem: "Postgres GUI",
    solution: "orders-prod · PostgreSQL",
    icon: <EngineIcon icon={ENGINES[0].icon} className="h-4 w-4" />,
    at: { problem: { x: 20, y: 36, r: -6 }, solution: { x: 320, y: 78, r: 0 } },
  },
  {
    problem: "MySQL client",
    solution: "orders-staging · MySQL",
    icon: <EngineIcon icon={ENGINES[1].icon} className="h-4 w-4" />,
    at: {
      problem: { x: 540, y: 12, r: 5 },
      solution: { x: 320, y: 132, r: 0 },
    },
  },
  {
    problem: "SQL Server Studio",
    solution: "billing · SQL Server",
    icon: <EngineIcon icon={ENGINES[2].icon} className="h-4 w-4" />,
    at: {
      problem: { x: 300, y: 148, r: 2 },
      solution: { x: 320, y: 186, r: 0 },
    },
  },
  {
    problem: "sqlite3 in a terminal",
    solution: "local-dev · SQLite via agent",
    icon: <Terminal className="h-4 w-4 text-muted-foreground" />,
    at: {
      problem: { x: 610, y: 214, r: -4 },
      solution: { x: 320, y: 240, r: 0 },
    },
  },
  {
    problem: "passwords.txt",
    solution: "Credentials · encrypted",
    icon: <FileKey2 className="h-4 w-4 text-err" />,
    at: {
      problem: { x: 70, y: 262, r: 4 },
      solution: { x: 320, y: 294, r: 0 },
    },
  },
];

const COPY: Record<Mode, { title: string; body: string }> = {
  problem: {
    title: "Your data is scattered across five tools",
    body: "A GUI for Postgres, another client for MySQL, a terminal for SQLite and a shared file of passwords for production. Every switch costs context, and every copied password is a risk.",
  },
  solution: {
    title: "One workspace, every engine",
    body: "Connect each database once. Query, browse, diagram, sync and back up from the same place, with credentials encrypted and production clusters guarded.",
  },
};

export function ProblemSolution() {
  const [mode, setMode] = useState<Mode>("problem");
  return (
    <section className="px-3 pt-16 sm:px-5">
      <div className="mx-auto max-w-[1320px] rounded-[28px] bg-sand px-5 py-16 sm:py-24">
        <Reveal className="flex justify-center">
          <div className="relative flex rounded-full bg-background p-1 shadow-[inset_0_0_0_1px_var(--color-line)]">
            {(["problem", "solution"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative z-10 rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
                  mode === m
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="ps-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-sand-2"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                {m}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mx-auto mt-8 min-h-[190px] max-w-[760px] text-center sm:min-h-[170px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <h2 className="font-display text-[clamp(2.1rem,4.4vw,2.9rem)] leading-[1.08] tracking-[-0.03em] text-foreground">
                {COPY[mode].title}
              </h2>
              <p className="mx-auto mt-4 max-w-[620px] text-[17px] leading-relaxed text-muted-foreground">
                {COPY[mode].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mx-auto mt-6 hidden h-[370px] w-[860px] md:block">
          <motion.div
            className="absolute top-[18px] left-[260px] h-[340px] w-[340px] rounded-2xl border border-border bg-card shadow-[0_24px_60px_-24px_rgb(30_27_75/0.35)]"
            initial={false}
            animate={
              mode === "solution"
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.92 }
            }
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex h-11 items-center gap-2 border-b border-border px-4 text-[13px] font-medium">
              <Database className="h-4 w-4 text-accent-fg" /> SynqDB
              <span className="ml-auto rounded-full bg-ok/10 px-2 py-0.5 text-[11px] font-normal text-ok">
                5 connected
              </span>
            </div>
          </motion.div>

          {mode === "problem" && (
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 860 370"
              fill="none"
              aria-hidden="true"
            >
              {[
                "M130 70 Q 300 10 540 40",
                "M400 175 Q 520 240 610 240",
                "M180 290 Q 260 210 300 175",
              ].map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  stroke="var(--color-err)"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.2 }}
                />
              ))}
            </svg>
          )}

          {TOOLS.map((t, i) => {
            const at = t.at[mode];
            return (
              <motion.div
                key={t.problem}
                className="absolute top-0 left-0 flex h-[46px] w-[220px] items-center gap-2.5 rounded-xl border border-border bg-card px-3 text-[13px] shadow-sm"
                initial={false}
                animate={{ x: at.x, y: at.y, rotate: at.r }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }}
              >
                {mode === "solution" && i === 4 ? (
                  <Lock className="h-4 w-4 text-ok" />
                ) : (
                  t.icon
                )}
                <span className="truncate">
                  {mode === "problem" ? t.problem : t.solution}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Platform diagram                                                    */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { label: "SQL editor", icon: Terminal },
  { label: "Data explorer", icon: Table2 },
  { label: "ER diagrams", icon: Workflow },
  { label: "Schema sync", icon: GitCompareArrows },
  { label: "Backups", icon: HardDrive },
  { label: "Local agent", icon: Laptop },
];

const CARDS = [
  {
    icon: Braces,
    title: "Typed editing",
    body: "JSON, dates, BIGINT, decimals and binary values round-trip exactly, so an edit never corrupts a row.",
  },
  {
    icon: ShieldCheck,
    title: "Production guardrails",
    body: "Destructive statements are locked by default, and production clusters ask before every write.",
  },
  {
    icon: Lock,
    title: "Credentials stay yours",
    body: "Stored encrypted with AES-256-GCM, or kept on your own machine when you connect through the agent.",
  },
  {
    icon: ArrowRightLeft,
    title: "Schema-aware sync",
    body: "Tables, indexes and foreign keys copy across in the right order, between any two clusters.",
  },
];

export function Platform() {
  // Positions on the outer ring, left to right.
  const nodes = FEATURES.map((f, i) => {
    const angle = Math.PI - (Math.PI * (i + 0.5)) / FEATURES.length;
    return {
      ...f,
      left: 50 + 41 * Math.cos(angle),
      top: 100 - 82 * Math.sin(angle),
    };
  });
  return (
    <section id="product" className="scroll-mt-24 pt-32">
      <div className="mx-auto max-w-[1000px] px-5 text-center">
        <WordsIn
          as="h2"
          text={"Everything your data needs,\nin one workspace"}
          className="font-display text-[clamp(2.6rem,6.5vw,5rem)] leading-[1] tracking-[-0.04em] text-foreground"
        />
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-[580px] text-[17px] leading-relaxed text-muted-foreground">
            Six tools that share one engine layer, so every cluster behaves the
            same whether it runs in the cloud or on your laptop.
          </p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-14 aspect-[2/1] w-full max-w-[1100px] px-3 sm:px-5">
        <div className="relative h-full w-full">
          {[
            { r: 100, cls: "bg-sand" },
            { r: 66, cls: "bg-primary/[0.12] dark:bg-primary/20" },
            { r: 36, cls: "bg-primary" },
          ].map((ring, i) => (
            <motion.div
              key={ring.r}
              className={`absolute bottom-0 left-1/2 rounded-t-full ${ring.cls}`}
              style={{
                width: `${ring.r}%`,
                height: `${ring.r}%`,
                marginLeft: `-${ring.r / 2}%`,
                transformOrigin: "50% 100%",
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 * i }}
            />
          ))}

          {nodes.map((n, i) => (
            <motion.div
              key={n.label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
              style={{ left: `${n.left}%`, top: `${n.top}%` }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.08 }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-accent-fg shadow-sm sm:h-11 sm:w-11">
                <n.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="text-[11px] font-medium whitespace-nowrap text-foreground sm:text-[15px]">
                {n.label}
              </span>
            </motion.div>
          ))}

          <motion.div
            className="absolute bottom-[44%] left-1/2 hidden -translate-x-1/2 text-center md:block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm font-medium text-accent-fg">Engine layer</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Typed values · exact decimals · parameterized queries
            </p>
          </motion.div>

          <div className="absolute bottom-0 left-1/2 flex h-[34%] w-[36%] -translate-x-1/2 flex-col items-center justify-end pb-[3%] text-white">
            <div className="flex gap-1.5 sm:gap-2">
              {ENGINES.map((e) => (
                <span
                  key={e.name}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white sm:h-9 sm:w-9"
                >
                  <EngineIcon icon={e.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-white/80 sm:text-sm">
              Your clusters
            </p>
          </div>
        </div>
      </div>

      <div className="landing-band px-3 pt-14 pb-24 sm:px-5">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal
              key={c.title}
              delay={i * 0.08}
              className="flex flex-col rounded-2xl bg-card p-6 sm:min-h-[220px] shadow-[0_10px_30px_-12px_rgb(30_27_75/0.3)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-accent-fg">
                <c.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-auto pt-6 text-[17px] sm:pt-10 font-medium tracking-tight text-foreground">
                {c.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
