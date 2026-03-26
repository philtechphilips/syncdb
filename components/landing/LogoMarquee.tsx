"use client";

import React from "react";

// Text-based trust bar — no external image dependencies
const COMPANIES = [
  "Vercel",
  "Linear",
  "Stripe",
  "Notion",
  "Supabase",
  "PlanetScale",
  "Resend",
  "Railway",
  "Clerk",
  "Upstash",
  "Trigger.dev",
  "Neon",
];

const Dot = () => (
  <span className="h-1 w-1 rounded-full bg-zinc-700 shrink-0" />
);

export const LogoMarquee = () => {
  const items = [...COMPANIES, ...COMPANIES];

  return (
    <section className="py-14 bg-background relative overflow-hidden">
      {/* Separators */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Label */}
      <div className="text-center mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.45em] text-zinc-700">
          Trusted by engineers at world-class teams
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className="flex items-center gap-10 w-max"
          style={{ animation: "marquee 35s linear infinite" }}
        >
          {items.map((name, i) => (
            <React.Fragment key={i}>
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-600 whitespace-nowrap cursor-default hover:text-zinc-300 transition-colors duration-300">
                {name}
              </span>
              <Dot />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
