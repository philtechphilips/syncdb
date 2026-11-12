"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, GitCompareArrows, Terminal } from "lucide-react";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { DriftingDots, EASE, Reveal, WordsIn, pill } from "./motion";
import { ENGINES, EngineIcon } from "./mockups";

const SOURCES = [
  { ...ENGINES[0], cluster: "orders-prod" },
  { ...ENGINES[1], cluster: "orders-staging" },
  { ...ENGINES[2], cluster: "billing" },
  { ...ENGINES[3], cluster: "local-dev" },
];

const OUTPUTS = [
  {
    icon: <Terminal className="h-4 w-4 text-accent-fg" />,
    text: "Query ran",
    detail: "4 rows · 12 ms",
  },
  {
    icon: <CheckCircle2 className="h-4 w-4 text-ok" />,
    text: "Backup ready",
    detail: "orders-prod.sql",
  },
  {
    icon: <GitCompareArrows className="h-4 w-4 text-accent-fg" />,
    text: "Staging in sync",
    detail: "2 tables",
  },
];

// Canvas is 1000 × 400; cards sit on these rows.
const SRC_Y = [40, 125, 210, 295];
const OUT_Y = [70, 177, 284];
const HUB = { x: 385, y: 140, w: 230, h: 120 };

const card =
  "absolute flex h-[46px] items-center gap-2.5 whitespace-nowrap rounded-xl border border-border bg-card px-3 text-[13px] shadow-sm";

function Line({ d, delay, show }: { d: string; delay: number; show: boolean }) {
  return (
    <>
      <motion.path
        d={d}
        stroke="var(--color-primary)"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={show ? { pathLength: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay }}
      />
      <motion.path
        d={d}
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        className="dash-flow"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.8 }}
      />
    </>
  );
}

/** The flow stacked vertically, for narrow spaces. */
export function FlowStack({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { once: true, amount: 0.3 });
  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: show ? { opacity: 1, y: 0, scale: 1 } : {},
    transition: { duration: 0.7, ease: EASE, delay },
  });
  return (
    <div
      ref={ref}
      className={`mx-auto flex max-w-[360px] flex-col items-stretch gap-2.5 ${className}`}
    >
      <div className="grid grid-cols-2 gap-2.5">
        {SOURCES.map((s, i) => (
          <motion.div
            key={s.cluster}
            className={`${card} relative`}
            {...appear(0.1 + i * 0.06)}
          >
            <EngineIcon icon={s.icon} className="h-4 w-4" />
            <span className="truncate">{s.name}</span>
          </motion.div>
        ))}
      </div>
      <span className="mx-auto h-6 w-px bg-primary/40" />
      <motion.div
        className="flex flex-col items-center gap-2 rounded-2xl border border-primary/25 bg-card py-5 shadow-[0_20px_50px_-20px_rgb(67_56_202/0.45)]"
        {...appear(0.4)}
      >
        <span className="flex items-center gap-2 text-[17px] font-medium tracking-tight">
          <SynqLogo className="h-7 w-7 text-primary" animate={false} /> SynqDB
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-ok/10 px-2.5 py-0.5 text-[11px] text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" /> 4 clusters
          connected
        </span>
      </motion.div>
      <span className="mx-auto h-6 w-px bg-primary/40" />
      {OUTPUTS.map((o, i) => (
        <motion.div
          key={o.text}
          className={`${card} relative`}
          {...appear(0.7 + i * 0.2)}
        >
          {o.icon}
          <span>{o.text}</span>
          <span className="ml-auto font-mono text-[11px] text-subtle">
            {o.detail}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** Your databases flow into SynqDB, and work comes out the other side. */
function HeroFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { once: true, amount: 0.35 });
  const appear = (delay: number, x = 0) => ({
    initial: { opacity: 0, x, y: x ? 0 : 10, scale: 0.98 },
    animate: show ? { opacity: 1, x: 0, y: 0, scale: 1 } : {},
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-14 max-w-[1320px] px-3 sm:mt-20 sm:px-5"
    >
      <div className="landing-panel overflow-hidden rounded-[28px] px-5 py-12 sm:py-16">
        {/* Desktop: the full flow */}
        <div className="relative mx-auto hidden h-[400px] w-[1000px] lg:block">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1000 400"
            fill="none"
            aria-hidden="true"
          >
            {SRC_Y.map((y, i) => (
              <Line
                key={`in-${y}`}
                d={`M230 ${y + 23} C 310 ${y + 23}, 305 ${HUB.y + 60}, ${HUB.x} ${HUB.y + 60}`}
                delay={0.35 + i * 0.08}
                show={show}
              />
            ))}
            {OUT_Y.map((y, i) => (
              <Line
                key={`out-${y}`}
                d={`M${HUB.x + HUB.w} ${HUB.y + 60} C 690 ${HUB.y + 60}, 685 ${y + 23}, 750 ${y + 23}`}
                delay={1.1 + i * 0.35}
                show={show}
              />
            ))}
          </svg>

          {SOURCES.map((s, i) => (
            <motion.div
              key={s.cluster}
              className={`${card} left-[20px] w-[210px]`}
              style={{ top: SRC_Y[i] }}
              {...appear(0.1 + i * 0.08, -16)}
            >
              <EngineIcon icon={s.icon} className="h-4 w-4" />
              <span>{s.name}</span>
              <span className="ml-auto font-mono text-[11px] text-subtle">
                {s.cluster}
              </span>
            </motion.div>
          ))}

          <motion.div
            className="absolute flex flex-col items-center justify-center gap-2 rounded-2xl border border-primary/25 bg-card shadow-[0_20px_50px_-20px_rgb(67_56_202/0.45)]"
            style={{ left: HUB.x, top: HUB.y, width: HUB.w, height: HUB.h }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={show ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
          >
            <span className="flex items-center gap-2 text-[17px] font-medium tracking-tight text-foreground">
              <SynqLogo className="h-7 w-7 text-primary" animate={false} />{" "}
              SynqDB
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-ok/10 px-2.5 py-0.5 text-[11px] text-ok">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />{" "}
              4 clusters connected
            </span>
          </motion.div>

          {OUTPUTS.map((o, i) => (
            <motion.div
              key={o.text}
              className={`${card} left-[750px] w-[240px]`}
              style={{ top: OUT_Y[i] }}
              {...appear(1.7 + i * 0.35, 16)}
            >
              {o.icon}
              <span>{o.text}</span>
              <span className="ml-auto font-mono text-[11px] text-subtle">
                {o.detail}
              </span>
            </motion.div>
          ))}
        </div>

        <FlowStack className="lg:hidden" />
      </div>
    </div>
  );
}

export function Hero({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="relative pt-14 sm:pt-24">
      <DriftingDots className="mx-auto max-w-[1200px]" />
      <div className="relative mx-auto max-w-[1100px] px-5 text-center">
        <WordsIn
          text={"One interface.\nEvery database."}
          className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.98] font-normal tracking-[-0.04em] text-foreground"
        />
        <Reveal delay={0.35}>
          <p className="mx-auto mt-6 max-w-[580px] text-[clamp(1.05rem,1.7vw,1.3rem)] leading-relaxed text-muted-foreground">
            Connect PostgreSQL, MySQL, SQL Server and SQLite once. Query,
            browse, sync and back up from one place.
          </p>
        </Reveal>
        <Reveal
          delay={0.5}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <button onClick={onLaunch} className={pill("primary", "lg")}>
            Get started for free
          </button>
          <a href="#product" className={pill("soft", "lg")}>
            See how it works
          </a>
        </Reveal>
      </div>
      <HeroFlow />
    </section>
  );
}
