"use client";

import React from "react";
import {
  Zap,
  Globe2,
  MousePointerClick,
  Sparkles,
  LayoutGrid,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

export const Features = () => {
  const features = [
    {
      title: "Engine-Aware AI",
      description:
        "Neural SQL engine that understands T-SQL, PL/pgSQL, and MySQL dialects for precise generation.",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      title: "Data Explorer",
      description:
        "High-performance exploration with 10-operator server-side filtering for massive datasets.",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      title: "Schema Intel",
      description:
        "Deep introspection of foreign keys and automated relationship mapping across all engines.",
      icon: <Globe2 className="h-5 w-5" />,
    },
    {
      title: "Zero-Trust",
      description:
        "AES-256 bit-level encryption for all connection metadata, ensuring industrial-grade security.",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      title: "Smart Logs",
      description:
        "Review and re-exec historical queries with execution stats and engine-specific metrics.",
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: "Visual ER",
      description:
        "Interact with database architecture using draggable relationships and automated layouts.",
      icon: <MousePointerClick className="h-5 w-5" />,
    },
  ];

  return (
    <section
      id="features"
      className="py-32 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 mb-40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <span className="text-primary text-xs font-black tracking-[0.4em] uppercase">
              Top Features
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-[0.9] tracking-tighter">
              Made for <br />
              <span className="text-primary italic">Developers.</span>
            </h2>
          </motion.div>

          <div className="flex items-end">
            <p className="text-2xl text-zinc-500 font-medium leading-relaxed max-w-lg mb-4">
              Get all the power you need with a tool that's actually easy to
              use. Built for speed and made to help you work faster.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-primary/60 group-hover:text-primary group-hover:border-primary/40 transition-all duration-500">
                  {f.icon}
                </div>
                <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-primary/20 transition-all duration-500" />
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-serif text-white group-hover:text-primary transition-colors duration-500">
                  {f.title}
                </h3>
                <p className="text-lg text-zinc-500 leading-relaxed font-medium group-hover:text-zinc-300 transition-colors duration-500">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
