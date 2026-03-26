"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Sarah Chen",
    role: "Principal Data Engineer",
    company: "Linear",
    text: "SynqDB is the first tool that made me forget I was working across multiple databases. Our team's velocity doubled overnight.",
    initials: "SC",
    color: "#277955",
  },
  {
    name: "Marcus Thorne",
    role: "Head of Infrastructure",
    company: "Vortex",
    text: "The first database tool that treats multi-engine architecture with the respect it deserves. Clean, fast, and actually enjoyable to use.",
    initials: "MT",
    color: "#336791",
  },
  {
    name: "Leo Hashimoto",
    role: "Lead Fullstack Engineer",
    company: "Hyperion",
    text: "Minimalism met raw performance. I manage PostgreSQL, MySQL, and SQLite from one tab. This is the future of DB management.",
    initials: "LH",
    color: "#4479A1",
  },
  {
    name: "Priya Rao",
    role: "Staff Engineer",
    company: "Nexus Labs",
    text: "The AI copilot understands our schema context perfectly. What used to take 15 minutes of schema-hunting now takes 10 seconds.",
    initials: "PR",
    color: "#7C3AED",
  },
  {
    name: "Daniel Park",
    role: "CTO",
    company: "Stackmesh",
    text: "We moved our entire on-call workflow into SynqDB. The visual ER diagrams alone saved us from two production incidents.",
    initials: "DP",
    color: "#D97706",
  },
  {
    name: "Aisha Williams",
    role: "Senior Backend Engineer",
    company: "Relay",
    text: "Finally — a tool built for engineers who actually write SQL. No drag-and-drop gimmicks, just clean performance and great DX.",
    initials: "AW",
    color: "#0891B2",
  },
];

const STATS = [
  { val: "10k+", label: "Active Engineers" },
  { val: "50M+", label: "Queries Per Day" },
  { val: "99.9%", label: "Uptime SLA" },
  { val: "4", label: "DB Engines" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export const Testimonials = () => {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase block mb-3">
              Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-[1.1] tracking-tighter">
              What engineers
              <br />
              <span className="text-primary italic">are saying.</span>
            </h2>
          </motion.div>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-zinc-500 font-medium max-w-sm leading-relaxed"
          >
            Thousands of engineers trust SynqDB to manage critical database
            infrastructure every day.
          </motion.p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              custom={i * 0.5}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 flex flex-col gap-5 hover:border-white/12 hover:bg-white/[0.03] transition-all duration-400 overflow-hidden"
            >
              {/* Top accent line on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to right, transparent, ${review.color}40, transparent)`,
                }}
              />

              {/* Quote icon */}
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${review.color}15`, border: `1px solid ${review.color}25` }}
              >
                <Quote className="h-3.5 w-3.5" style={{ color: review.color }} />
              </div>

              {/* Text */}
              <p className="text-sm text-zinc-400 leading-relaxed font-medium flex-1 group-hover:text-zinc-300 transition-colors duration-300">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white"
                  style={{ backgroundColor: `${review.color}30`, border: `1px solid ${review.color}40` }}
                >
                  {review.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">
                    {review.name}
                  </div>
                  <div className="text-[10px] text-zinc-600 font-medium mt-0.5">
                    {review.role} @ {review.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i * 0.5}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group cursor-default"
            >
              <div className="text-3xl md:text-4xl font-serif text-white group-hover:text-primary transition-colors duration-300">
                {stat.val}
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
