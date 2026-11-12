"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRightLeft,
  Table2,
  Terminal,
  Workflow as Diagram,
} from "lucide-react";
import { EASE, Reveal, WordsIn } from "./motion";

const STEPS = [
  {
    icon: Terminal,
    title: "SQL editor",
    detail: "4 rows · 12 ms",
    body: "Write SQL with autocomplete for your schema. Destructive statements stay locked, and production asks twice.",
  },
  {
    icon: Table2,
    title: "Data explorer",
    detail: "status = 'paid'",
    body: "Filter and edit any table without SQL. Every value is saved as its real type, so an edit never corrupts a row.",
  },
  {
    icon: Diagram,
    title: "ER diagrams",
    detail: "customers → orders",
    body: "See how your schema fits together, drawn from the live database, and export it as PNG or PDF.",
  },
  {
    icon: ArrowRightLeft,
    title: "Sync and backup",
    detail: "prod → staging",
    body: "Copy schema and data between clusters in the right order, and back up or restore across engines.",
  },
];

// Canvas is 1000 × 250; cards zigzag along one line.
const AT = [
  { x: 20, y: 30 },
  { x: 270, y: 150 },
  { x: 520, y: 30 },
  { x: 760, y: 150 },
];
const PATH =
  "M130 62 C 255 62, 255 182, 380 182 C 505 182, 505 62, 630 62 C 750 62, 750 182, 870 182";
const CYCLE_MS = 3200;

export function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = STEPS[active];

  return (
    <section id="product-tour" className="px-3 pt-28 sm:px-5">
      <div className="mx-auto max-w-[900px] px-2 text-center">
        <WordsIn
          as="h2"
          text={"Built for the work\nyou do every day"}
          className="font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.02] tracking-[-0.04em] text-foreground"
        />
      </div>

      <div
        ref={ref}
        className="mx-auto mt-12 max-w-[1320px] rounded-[28px] bg-sand px-5 py-14 sm:py-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Desktop: four cards on one line, lit in turn */}
        <div className="relative mx-auto hidden h-[250px] w-[1000px] lg:block">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1000 250"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={PATH}
              stroke="var(--color-line-strong)"
              strokeWidth="1.5"
              strokeDasharray="5 6"
            />
            <motion.path
              d={PATH}
              stroke="var(--color-primary)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: inView ? (active + 0.5) / STEPS.length : 0,
              }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </svg>
          {STEPS.map((s, i) => (
            <motion.button
              key={s.title}
              onClick={() => setActive(i)}
              className={`absolute flex h-[64px] w-[220px] items-center gap-3 rounded-xl border bg-card px-3.5 text-left shadow-sm transition-[border-color,box-shadow] duration-300 ${
                i === active
                  ? "border-primary/50 shadow-[0_16px_40px_-16px_rgb(67_56_202/0.5)]"
                  : "border-border"
              }`}
              style={{ left: AT[i].x, top: AT[i].y }}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: i === active ? -4 : 0 } : {}}
              transition={{
                duration: 0.6,
                ease: EASE,
                delay: inView && active === 0 ? i * 0.1 : 0,
              }}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  i === active
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-accent-fg"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium text-foreground">
                  {s.title}
                </span>
                <span className="block truncate font-mono text-[11px] text-subtle">
                  {s.detail}
                </span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Smaller screens: a vertical list */}
        <div className="mx-auto flex max-w-[360px] flex-col gap-2.5 lg:hidden">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              className={`flex h-[60px] items-center gap-3 rounded-xl border bg-card px-3.5 text-left shadow-sm transition-colors ${
                i === active ? "border-primary/50" : "border-border"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  i === active
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-accent-fg"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[14px] font-medium text-foreground">
                  {s.title}
                </span>
                <span className="block font-mono text-[11px] text-subtle">
                  {s.detail}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[560px] text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step.title}
              className="min-h-[56px] text-[17px] leading-relaxed text-muted-foreground"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {step.body}
            </motion.p>
          </AnimatePresence>
          <Reveal className="mt-6 flex justify-center gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActive(i)}
                aria-label={s.title}
                className="relative h-1 w-10 overflow-hidden rounded-full bg-ink/[0.08]"
              >
                {i === active && (
                  <span
                    key={`${active}-${inView}`}
                    className="absolute inset-0 origin-left rounded-full bg-primary animate-tab-progress"
                    style={{
                      animationDuration: `${CYCLE_MS}ms`,
                      animationPlayState:
                        inView && !paused ? "running" : "paused",
                    }}
                    onAnimationEnd={() =>
                      setActive((v) => (v + 1) % STEPS.length)
                    }
                  />
                )}
                {i < active && (
                  <span className="absolute inset-0 rounded-full bg-primary/40" />
                )}
              </button>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
