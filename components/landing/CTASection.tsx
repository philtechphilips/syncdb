"use client";

import React from "react";

import { motion } from "framer-motion";

export const CTASection = ({ onLaunch }: { onLaunch: () => void }) => {
  return (
    <section className="py-32 bg-background relative overflow-hidden text-center border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="flex flex-col items-center">
            <div className="h-1 w-12 bg-primary/40 mb-12" />
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-[1.1] tracking-tighter">
              Ready to <br />
              <span className="text-primary italic">Start?</span>
            </h2>
          </div>

          <p className="text-xl text-zinc-500 font-medium max-w-xl mx-auto leading-relaxed">
            One place to connect all your databases. <br />
            <span className="text-white">
              Made for speed, built for developers.
            </span>
          </p>

          <div className="pt-8">
            <button
              onClick={onLaunch}
              className="group relative px-8 py-3.5 rounded-full border border-primary text-white hover:bg-primary transition-all active:scale-95 overflow-hidden font-black text-base"
            >
              <span className="relative z-10">Start now for free</span>
            </button>
          </div>

          <div className="pt-24 flex items-center justify-center gap-12 opacity-10">
            <div className="h-px flex-1 bg-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white shrink-0">
              SynqDB universal
            </span>
            <div className="h-px flex-1 bg-white" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
