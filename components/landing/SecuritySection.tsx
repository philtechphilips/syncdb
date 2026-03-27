"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  UserCheck,
  FileCode2,
  Globe,
} from "lucide-react";

const PILLARS = [
  {
    icon: Lock,
    title: "AES-256-GCM Credential Encryption",
    description:
      "Every connection credential — host, username, password — is encrypted with AES-256-GCM before it hits the database. A random 12-byte IV and authentication tag are generated per record.",
  },
  {
    icon: KeyRound,
    title: "JWT + Secure Token Refresh",
    description:
      "Access tokens expire in 30 minutes. Refresh tokens are stored server-side and validated against their expiry date. The frontend automatically retries with a fresh token on 401.",
  },
  {
    icon: ShieldCheck,
    title: "bcrypt Password Hashing",
    description:
      "User passwords are hashed with bcrypt at 10 salt rounds before storage. Plain-text passwords are never persisted or returned by the API.",
  },
  {
    icon: FileCode2,
    title: "Parameterized Queries",
    description:
      "All database interactions across PostgreSQL, MySQL, MSSQL, and SQLite use parameterized inputs — ? placeholders, $1 positional params, and @named params — eliminating SQL injection at the driver level.",
  },
  {
    icon: UserCheck,
    title: "RBAC + User-Scoped Data",
    description:
      "Every endpoint is protected by role-based access guards. Cluster operations are always scoped to the authenticated user's ID — no cross-user data access is possible.",
  },
  {
    icon: Globe,
    title: "HTTP Security Headers",
    description:
      "Helmet.js is applied globally, setting headers for XSS protection, content-type sniffing prevention, clickjacking protection, and strict CORS to the frontend origin only.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.07,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export const SecuritySection = () => (
  <section
    id="security"
    className="py-32 bg-background relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.04] blur-[130px] rounded-full pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase block mb-3">
            Security
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-[1.1] tracking-tighter">
            Protected
            <br />
            <span className="text-primary italic">by design.</span>
          </h2>
          <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-xl mt-6">
            Here&apos;s exactly what we do to protect your credentials and data
            — no marketing speak, just what&apos;s actually in the code.
          </p>
        </motion.div>
      </div>

      {/* Pillars grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              custom={i * 0.5}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group flex gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-primary/20 hover:bg-primary/[0.03] transition-all duration-300"
            >
              <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom note */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between flex-wrap gap-4"
      >
        <p className="text-sm text-zinc-600 font-medium">
          See something we should add?{" "}
          <a
            href="#"
            className="text-zinc-400 underline underline-offset-4 hover:text-white transition-colors"
          >
            Open an issue on GitHub
          </a>
        </p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
            No open security incidents
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);
