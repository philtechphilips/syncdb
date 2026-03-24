"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const reviews = [
    {
      name: "Sarah Chen",
      role: "Principal Data Engineer @ Linear",
      text: "SynqDB is architecture as poetry. Our team's velocity doubled overnight.",
    },
    {
      name: "Marcus Thorne",
      role: "Head of Infra @ Vortex",
      text: "The first database tool that treats architecture with the respect it deserves.",
    },
    {
      name: "Leo Hashimoto",
      role: "Lead Fullstack @ Hyperion",
      text: "Minimalism met with raw performance. This is the future of DB management.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="py-32 bg-background relative overflow-hidden flex flex-col justify-center">
      {/* Background Decorative "Echo" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif text-white/[0.02] select-none pointer-events-none italic">
        {reviews[index].name.split(" ")[0]}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="mb-24">
          <span className="text-primary text-xs font-black tracking-[0.4em] uppercase">
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mt-8 leading-[0.9] tracking-tighter">
            What Engineers <br />
            <span className="text-primary italic">Are Saying.</span>
          </h2>
        </div>

        <div className="relative h-[250px] md:h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-start"
            >
              <p className="text-3xl md:text-5xl font-serif text-white leading-[1.2] tracking-tighter max-w-4xl italic px-1">
                &quot;{reviews[index].text}&quot;
              </p>

              <div className="mt-12 flex items-center gap-6">
                <div className="h-[1px] w-24 bg-primary/40" />
                <div>
                  <div className="text-xl font-black text-white tracking-tight">
                    {reviews[index].name}
                  </div>
                  <div className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em] mt-1">
                    {reviews[index].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Switcher */}
        <div className="mt-16 flex items-center gap-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group relative py-4"
            >
              <div
                className={`h-[2px] transition-all duration-500 ${index === i ? "w-12 bg-primary" : "w-6 bg-white/10 group-hover:bg-white/30"}`}
              />
            </button>
          ))}
        </div>

        {/* Performance Stats Redesigned */}
        <div className="mt-20 pt-16 border-t border-white/5 flex flex-wrap gap-16 md:gap-32 opacity-40">
          {[
            { label: "Active Engineers", val: "10k+" },
            { label: "Queries Per Day", val: "50M+" },
            { label: "SLA Guaranteed", val: "99.9%" },
          ].map((stat, i) => (
            <div key={i} className="text-left group">
              <div className="text-2xl font-serif text-white group-hover:text-primary transition-colors">
                {stat.val}
              </div>
              <div className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
