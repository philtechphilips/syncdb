"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Fingerprint,
  Terminal,
  Globe,
  Shield,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";

export const SecuritySection = () => {
  const features = [
    {
      label: "End-to-End Encryption",
      desc: "Military-grade AES-256 bit encryption for all data at rest and in transit.",
    },
    {
      label: "Zero-Trust Architecture",
      desc: "Identity-aware proxy ensuring every request is verified and authorized.",
    },
    {
      label: "Neural Auditing",
      desc: "AI-powered anomaly detection for every SQL execution across your clusters.",
    },
  ];

  return (
    <section
      id="security"
      className="py-32 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          {/* Visual Side (Abstract Core) */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative h-[400px] w-[400px] flex items-center justify-center">
              {/* Abstract Ambient Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute h-64 w-64 bg-primary/20 blur-[100px] rounded-full"
              />

              {/* The Core */}
              <div className="relative h-72 w-72 rounded-full border border-white/5 flex items-center justify-center">
                {/* Orbiting Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 15 + i * 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border border-white/[0.03] rounded-full"
                    style={{ margin: i * 20 }}
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/40 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </motion.div>
                ))}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-32 w-32 rounded-full bg-black border border-white/10 flex items-center justify-center relative z-10"
                >
                  <ShieldCheck className="h-10 w-10 text-primary opacity-80" />
                  <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                </motion.div>

                {/* Connecting Lines */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>

              {/* Floating Labels */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 glass px-4 py-2 rounded-full border border-white/10 text-[9px] font-black text-primary uppercase tracking-[0.2em]"
              >
                AES-256
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-20 left-0 glass px-4 py-2 rounded-full border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]"
              >
                ISO-27001
              </motion.div>
            </div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2 space-y-16">
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-primary text-xs font-black tracking-[0.4em] uppercase"
              >
                Secure Connections
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-[0.9] tracking-tight">
                Protected <br />
                <span className="text-primary italic">by Design.</span>
              </h2>
              <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-lg">
                Your data and credentials are always encrypted. We make sure
                your database connections stay private and safe.
              </p>
            </div>

            <div className="space-y-12">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-primary/30 group-hover:w-12 transition-all duration-500" />
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {feature.label}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-md pl-12">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};
