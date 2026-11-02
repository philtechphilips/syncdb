"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export const CTASection = ({ onLaunch }: { onLaunch: () => void }) => {
  return (
    <section className="py-8 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-transparent px-8 md:px-16 py-20 text-center">
          {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none"></div>

          {/* Grid overlay */}
          <div className="absolute inset-0 tech-grid opacity-[0.04] pointer-events-none" />

          {/* Top border accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Icon */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="h-14 w-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-8"
            >
              <Database className="h-6 w-6 text-subtle" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl md:text-6xl text-foreground leading-[1.1] tracking-tight mb-6 font-semibold"
            >
              Your databases.
              <br />
              <span className="text-accent-fg">One workspace.</span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed mb-10"
            >
              Stop juggling tools. SynqDB brings PostgreSQL, MySQL, MSSQL, and
              SQLite into a single, fast, developer-first workspace.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <button
                onClick={onLaunch}
                className="group flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium text-sm transition-all hover:bg-primary-hover shadow-[0_1px_2px_rgb(67_56_202/0.25)] w-full sm:w-auto justify-center"
              >
                Start for free — no card needed
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-full border border-line-strong text-foreground text-sm font-medium hover:bg-ink/[0.05] hover:border-line-strong transition-all w-full sm:w-auto">
                Talk to sales
              </button>
            </motion.div>

            {/* Engine pills */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-2 mt-10"
            >
              {[
                { name: "PostgreSQL", color: "#336791" },
                { name: "MySQL", color: "#4479A1" },
                { name: "MSSQL", color: "#A91D22" },
                { name: "SQLite", color: "#003B57" },
              ].map((e) => (
                <span
                  key={e.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-ink/[0.03] text-[11px] font-medium text-muted-foreground"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: e.color }}
                  />
                  {e.name}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
