"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";

const PLANS = [
  {
    id: "community",
    name: "Community",
    tagline: "For individual developers",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Get started free",
    ctaVariant: "outline" as const,
    featured: false,
    features: [
      "Unlimited local clusters",
      "PostgreSQL, MySQL, SQLite, MSSQL",
      "AI SQL Copilot (50 queries/day)",
      "Visual ER Diagram",
      "Data Explorer",
      "Query history (30 days)",
      "CSV / JSON export",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growing teams",
    monthlyPrice: 19,
    annualPrice: 15,
    cta: "Start free trial",
    ctaVariant: "primary" as const,
    featured: true,
    badge: "Most popular",
    features: [
      "Everything in Community",
      "Unlimited AI SQL Copilot",
      "Team dashboard (up to 10 seats)",
      "Role-based access control",
      "Query history (unlimited)",
      "Priority support",
      "PDF / Excel export",
      "Saved query library",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For engineering orgs",
    monthlyPrice: null,
    annualPrice: null,
    cta: "Contact sales",
    ctaVariant: "outline" as const,
    featured: false,
    features: [
      "Everything in Pro",
      "Unlimited seats",
      "SSO / SAML integration",
      "Compliance guardrails",
      "Dedicated infrastructure",
      "SLA guarantees",
      "24 / 7 priority support",
      "Custom onboarding",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export const Pricing = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="py-28 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-primary text-[10px] font-black tracking-[0.4em] uppercase block mb-3"
          >
            Pricing
          </motion.span>
          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-8 leading-[1.1] tracking-tighter"
          >
            Start free.
            <br />
            <span className="text-primary italic">Scale when ready.</span>
          </motion.h2>

          {/* Billing toggle */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 p-1 rounded-full border border-white/10 bg-white/[0.03]"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                !annual
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                annual
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Annual
              <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25 text-primary text-[9px]">
                −20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              custom={i * 0.5}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`relative rounded-2xl p-6 flex flex-col gap-6 transition-all duration-300 ${
                plan.featured
                  ? "border border-primary/30 bg-primary/[0.04] shadow-xl shadow-primary/5 lg:-mt-4"
                  : "border border-white/[0.07] bg-white/[0.02] hover:border-white/12"
              }`}
            >
              {/* Featured glow */}
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              )}

              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                  <Zap className="h-2.5 w-2.5" />
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div>
                <div className="text-sm font-bold text-white mb-0.5">
                  {plan.name}
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  {plan.tagline}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2">
                {plan.monthlyPrice !== null ? (
                  <>
                    <span className="text-4xl font-serif text-white leading-none tracking-tighter">
                      {plan.monthlyPrice === 0
                        ? "Free"
                        : `$${annual ? plan.annualPrice : plan.monthlyPrice}`}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-zinc-500 text-sm mb-0.5 font-medium">
                        / seat / mo
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-4xl font-serif text-primary italic leading-none tracking-tighter">
                    Custom
                  </span>
                )}
              </div>

              {/* Annual savings note */}
              {plan.monthlyPrice !== null &&
                plan.monthlyPrice > 0 &&
                annual && (
                  <p className="text-[10px] text-primary/70 font-medium -mt-4">
                    Billed annually — save $
                    {(plan.monthlyPrice - plan.annualPrice!) * 12}/yr per seat
                  </p>
                )}

              {/* CTA */}
              <button
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  plan.ctaVariant === "primary"
                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                    : "border border-white/15 text-white hover:bg-white/[0.05]"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Feature list */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.featured
                          ? "bg-primary/15 border border-primary/25"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <Check
                        className={`h-2.5 w-2.5 ${plan.featured ? "text-primary" : "text-zinc-400"}`}
                      />
                    </div>
                    <span className="text-zinc-400 font-medium leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-12 text-xs text-zinc-600 font-medium"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
};
