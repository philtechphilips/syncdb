"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, Github, Linkedin, Twitter } from "lucide-react";
import { Logotype } from "@/components/ui/SynqLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { EASE, Reveal, WordsIn, pill } from "./motion";
import { Window } from "./mockups";

/* ------------------------------------------------------------------ */
/* Local agent                                                         */
/* ------------------------------------------------------------------ */

const TERMINAL = [
  { t: "$ npm install -g synqdb-agent", c: "text-white" },
  { t: "$ synqdb-agent login", c: "text-white" },
  { t: "✓ Signed in through your browser", c: "text-[#86efac]" },
  { t: "$ synqdb-agent add local-dev sqlite:./dev.db", c: "text-white" },
  { t: "✓ Saved. Credentials stay on this machine", c: "text-[#86efac]" },
  { t: "$ synqdb-agent", c: "text-white" },
  { t: "→ Connected. Serving local-dev", c: "text-[#a5b4fc]" },
];

export function LocalAgent() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <section
      id="agent"
      className="mx-auto max-w-[1200px] scroll-mt-24 px-5 pt-32"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="text-sm text-accent-fg">Local agent</span>
            <h2 className="mt-4 text-balance font-display text-[clamp(2.2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.035em] text-foreground">
              Local databases, without opening a port
            </h2>
            <p className="mt-5 max-w-[460px] text-[17px] leading-relaxed text-muted-foreground">
              A small agent on your machine connects out to SynqDB, so databases
              on localhost or a private network work like any other cluster.
              Their passwords never leave your laptop.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={32}>
          <div ref={ref} className="rounded-[24px] bg-sand p-4 sm:p-8">
            <Window title="~/projects" dark>
              <div className="min-h-[218px] space-y-1.5 px-4 py-4 font-mono text-[12px]">
                {TERMINAL.map((l, i) => (
                  <motion.p
                    key={l.t}
                    className={l.c}
                    initial={{ opacity: 0, x: -6 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: 0.2 + i * 0.35,
                    }}
                  >
                    {l.t}
                  </motion.p>
                ))}
              </div>
            </Window>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

const QUOTES = [
  {
    text: "SynqDB is the first tool that made me forget I was working across multiple databases.",
    name: "Emeka Okafor",
    role: "Senior Backend Engineer",
  },
  {
    text: "Clean, fast, and actually enjoyable to use.",
    name: "Tunde Adewale",
    role: "Head of Infrastructure",
  },
  {
    text: "I manage PostgreSQL, MySQL, and SQLite from one tab.",
    name: "Chisom Eze",
    role: "Lead Fullstack Engineer",
  },
  {
    text: "The schema explorer saves me so much context-switching.",
    name: "Fatima Bello",
    role: "Staff Engineer",
  },
  {
    text: "The visual ER diagrams have already helped us catch schema issues early.",
    name: "Seun Akinwale",
    role: "CTO",
  },
  {
    text: "A tool built for engineers who actually write SQL.",
    name: "Ngozi Okonkwo",
    role: "Principal Data Engineer",
  },
];

export function Testimonials() {
  const row = [...QUOTES, ...QUOTES];
  return (
    <section className="pt-32">
      <Reveal className="mx-auto max-w-[900px] px-5 text-center">
        <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.035em] text-foreground">
          Loved by engineers who live in SQL
        </h2>
      </Reveal>
      <div className="marquee-mask group mt-12 overflow-hidden">
        <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {row.map((q, i) => (
            <figure
              key={i}
              aria-hidden={i >= QUOTES.length}
              className="w-[320px] shrink-0 rounded-2xl bg-sand p-6"
            >
              <blockquote className="text-[16px] leading-relaxed text-foreground">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-[13px]">
                <span className="font-medium text-foreground">{q.name}</span>
                <span className="text-subtle"> · {q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    name: "Community",
    tagline: "For individual developers",
    monthly: 0,
    annual: 0,
    cta: "Get started free",
    features: [
      "Unlimited local clusters",
      "All four engines",
      "AI SQL Copilot, 50 queries a day",
      "ER diagrams and data explorer",
    ],
  },
  {
    name: "Pro",
    tagline: "For growing teams",
    monthly: 19,
    annual: 15,
    cta: "Start free trial",
    featured: true,
    features: [
      "Everything in Community",
      "Unlimited AI SQL Copilot",
      "Up to 10 seats",
      "Role-based access",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For engineering orgs",
    monthly: null,
    annual: null,
    cta: "Contact sales",
    features: [
      "Everything in Pro",
      "Unlimited seats",
      "SSO and SAML",
      "Dedicated infrastructure",
    ],
  },
];

export function Pricing({ onLaunch }: { onLaunch: () => void }) {
  const [annual, setAnnual] = useState(true);
  return (
    <section
      id="pricing"
      className="mx-auto max-w-[1100px] scroll-mt-24 px-5 pt-32"
    >
      <div className="text-center">
        <WordsIn
          as="h2"
          text="Start free. Scale when ready."
          className="font-display text-[clamp(2.4rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.04em] text-foreground"
        />
        <Reveal delay={0.2} className="mt-7 flex justify-center">
          <div className="relative flex rounded-full bg-sand p-1">
            {[
              { v: false, label: "Monthly" },
              { v: true, label: "Annual · save 20%" },
            ].map((o) => (
              <button
                key={o.label}
                onClick={() => setAnnual(o.v)}
                className={`relative z-10 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  annual === o.v
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {annual === o.v && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-background shadow-sm"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                {o.label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PLANS.map((p, i) => {
          const price = annual ? p.annual : p.monthly;
          return (
            <Reveal
              key={p.name}
              delay={i * 0.08}
              className={`flex flex-col rounded-2xl p-7 ${
                p.featured
                  ? "bg-card shadow-[0_0_0_1.5px_var(--color-primary),0_20px_50px_-24px_rgb(67_56_202/0.45)]"
                  : "bg-sand"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-medium text-foreground">
                  {p.name}
                </h3>
                {p.featured && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-accent-fg">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-[44px] leading-none tracking-[-0.03em] text-foreground">
                  {price === null
                    ? "Custom"
                    : price === 0
                      ? "Free"
                      : `$${price}`}
                </span>
                {!!price && (
                  <span className="text-sm text-muted-foreground">
                    / seat / month
                  </span>
                )}
              </p>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[15px] text-foreground/85"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-fg" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onLaunch}
                className={`${pill(p.featured ? "primary" : "soft")} mt-8 w-full`}
              >
                {p.cta}
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing call to action and footer                                   */
/* ------------------------------------------------------------------ */

const FOOTER = {
  Product: [
    { label: "Features", href: "#product" },
    { label: "Databases", href: "#engines" },
    { label: "Local agent", href: "#agent" },
    { label: "Pricing", href: "#pricing" },
  ],
  Account: [
    { label: "Sign in", href: "/auth/login" },
    { label: "Create account", href: "/auth/signup" },
    { label: "Reset password", href: "/auth/forgot-password" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
  ],
};

const SOCIALS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Closing({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="landing-cta relative mt-32 overflow-hidden text-white">
      <div className="mx-auto max-w-[1000px] px-5 pt-28 pb-24 text-center sm:pt-36">
        <WordsIn
          as="h2"
          text={"Your databases.\nOne workspace."}
          className="font-display text-[clamp(2.8rem,7vw,5.25rem)] leading-[0.98] tracking-[-0.04em]"
        />
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-[460px] text-balance text-[18px] leading-relaxed text-white/80">
            Free to start. Connect your first database in under a minute.
          </p>
        </Reveal>
        <Reveal
          delay={0.45}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <button onClick={onLaunch} className={pill("white", "lg")}>
            Get started for free
          </button>
          <Link href="/auth/login" className={pill("ghost-white", "lg")}>
            Sign in
          </Link>
        </Reveal>
      </div>

      <footer className="relative mx-auto max-w-[1200px] px-5 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="SynqDB home" className="inline-block">
              <Logotype className="text-[24px]" inverted />
            </Link>
            <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-white/75">
              One workspace for PostgreSQL, MySQL, SQL Server and SQLite.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/85 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER).map(([title, links]) => (
            <div key={title}>
              <p className="text-[13px] text-white/60">{title}</p>
              <ul className="mt-4 space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[15px] text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 py-6 text-[13px] text-white/60">
          <p>© {new Date().getFullYear()} SynqDB. All rights reserved.</p>
          <ThemeToggle className="border-white/25 [&_button]:text-white/70 [&_button[aria-checked=true]]:bg-white/20 [&_button[aria-checked=true]]:text-white" />
        </div>

        <motion.p
          aria-hidden="true"
          className="pointer-events-none -mb-[3.5vw] text-center font-display text-[clamp(5rem,20vw,17rem)] leading-[0.8] tracking-[-0.05em] text-white/10 select-none"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          SynqDB
        </motion.p>
      </footer>
    </section>
  );
}
