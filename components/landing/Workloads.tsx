"use client";

import React, { useState } from "react";
import { Database, Server, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Workloads = () => {
  const workloads = [
    { name: "PostgreSQL", icon: Database, version: "v15.2" },
    { name: "SQL Server", icon: Server, version: "2022" },
    { name: "SQLite", icon: Zap, version: "3.45" },
    { name: "MySQL", icon: Database, version: "8.0" },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      id="workloads"
      className="py-32 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          {/* Text Side */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent-fg text-xs font-medium block mb-3">
                Connectivity
              </span>
              <h2 className="text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight font-semibold">
                Every Database. <br />
                <span className="text-accent-fg">One Interface.</span>
              </h2>
              <p className="text-xl text-subtle leading-relaxed max-w-lg mt-6">
                Stop switching tools. Use one simple interface to manage every
                database in your stack — from local files to large clusters.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              {workloads.map((w, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`px-6 py-3 rounded-full border transition-all duration-500 flex items-center gap-3 ${
                    activeIdx === i
                      ? "bg-primary border-primary text-white"
                      : "bg-ink/[0.02] border-border text-subtle hover:border-line-strong"
                  }`}
                >
                  <w.icon className="h-4 w-4" />
                  <span className="text-[11px] font-medium">{w.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Side - The Unified Core */}
          <div className="relative h-96 flex items-center justify-center">
            <div className="relative">
              {/* Unified Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20 + i * 10,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i,
                    },
                  }}
                  className="absolute inset-0 border border-primary/10 rounded-full"
                  style={{ padding: i * 24 }}
                />
              ))}

              <div className="h-80 w-80 rounded-full border border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 tech-grid opacity-[0.03]" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ scale: 0.95, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 1.05, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center justify-center gap-6"
                  >
                    <div className="relative p-8 rounded-xl bg-primary/10 border border-primary/20">
                      {React.createElement(workloads[activeIdx].icon, {
                        className: "h-16 w-16 text-accent-fg",
                      })}
                    </div>

                    <div className="text-center">
                      <div className="text-[11px] font-medium text-foreground opacity-40 mb-1">
                        Instance Layer
                      </div>
                      <div className="text-sm font-mono font-semibold text-accent-fg">
                        {workloads[activeIdx].name}{" "}
                        {workloads[activeIdx].version}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Metadata */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -right-10 px-5 py-2.5 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm text-[11px] font-medium text-accent-fg"
              >
                Unified Engine: Active
              </motion.div>
            </div>
          </div>
        </div>

        {/* Groundedness Statement */}
        <div className="mt-20 pt-16 border-t border-border flex flex-col md:flex-row justify-between items-start gap-12 text-subtle">
          <div className="max-w-xs space-y-4">
            <div className="h-1 w-12 bg-primary/40" />
            <p className="text-xs leading-relaxed text-subtle">
              SynqDB doesn&apos;t just connect; <br />
              it harmonizes.
            </p>
          </div>

          <div className="flex-1 max-w-2xl text-lg font-medium leading-relaxed">
            Industry leaders rely on tools that disappear. We provide the
            silence and performance of a native engine, with the flexibility of
            a modern cloud interface.
          </div>
        </div>
      </div>
    </section>
  );
};
