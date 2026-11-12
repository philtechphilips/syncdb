"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades, lifts and un-blurs its children the first time they scroll into view. */
export function Reveal({
  delay = 0,
  y = 24,
  amount = 0.3,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number; amount?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Headline that rises in word by word. */
export function WordsIn({
  text,
  className,
  delay = 0,
  as = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
}) {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  const lines = text.split("\n");
  let index = 0;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(" ").map((word, wi) => {
            const i = index++;
            return (
              <motion.span
                key={wi}
                className="inline-block whitespace-pre"
                variants={{
                  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.9,
                      ease: EASE,
                      delay: delay + i * 0.06,
                    },
                  },
                }}
              >
                {word}
                {wi < line.split(" ").length - 1 ? " " : ""}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

// Fixed positions so server and client render the same dots.
const DOTS = [
  { x: 11, y: 22, s: 4, d: 0 },
  { x: 86, y: 18, s: 3, d: 1.2 },
  { x: 9, y: 64, s: 3, d: 2.1 },
  { x: 92, y: 58, s: 4, d: 0.6 },
  { x: 22, y: 86, s: 2, d: 1.7 },
  { x: 78, y: 84, s: 3, d: 2.6 },
  { x: 4, y: 40, s: 2, d: 3.1 },
  { x: 96, y: 36, s: 2, d: 0.3 },
];

/** Small accent dots drifting at the edges of a section. */
export function DriftingDots({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/50 animate-drift"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s * 2,
            height: d.s * 2,
            animationDelay: `${d.d}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Pill-shaped button or link used across the landing page. */
export function pill(
  variant: "primary" | "soft" | "white" | "ghost-white" = "primary",
  size: "md" | "lg" = "md",
) {
  const sizes = { md: "h-10 px-5 text-[15px]", lg: "h-12 px-6 text-[17px]" };
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-[0_1px_2px_rgb(67_56_202/0.3)]",
    soft: "bg-sand-2 text-foreground hover:bg-ink/[0.08]",
    white: "bg-white text-[#111] hover:bg-white/90",
    "ghost-white": "border border-white/40 text-white hover:bg-white/10",
  };
  return `inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 ${sizes[size]} ${variants[variant]}`;
}
