"use client";

import React from "react";
import { Search, Zap, Shield, CheckCircle2, Hash, Type } from "lucide-react";
import { motion } from "framer-motion";

export const DataExplorerSection = () => {
  const operators = [
    { label: "Is", icon: <CheckCircle2 className="h-3 w-3" /> },
    { label: "Is Not", icon: <Shield className="h-3 w-3" /> },
    { label: "Contains", icon: <Search className="h-3 w-3" /> },
    { label: "Starts with", icon: <Type className="h-3 w-3" /> },
    { label: "Greater than", icon: <Hash className="h-3 w-3" /> },
    { label: "Is Null", icon: <Zap className="h-3 w-3" /> },
  ];

  return (
    <section className="py-40 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          {/* Visual Side (Minimalist Query Bar) */}
          <div className="lg:col-span-7 order-2 lg:order-1 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Abstract Ambient Shadow */}
              <div className="absolute -inset-20 bg-primary/5 blur-[120px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>

              <div className="relative space-y-8">
                {/* The Query Bar */}
                <div className="p-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-2xl shadow-2xl">
                  <div className="bg-black/40 backdrop-blur-xl rounded-[15px] p-8 md:p-12 border border-white/5">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex items-center gap-4 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        Visual Filter
                      </div>

                      <div className="flex-1 flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            Property
                          </span>
                          <span className="text-lg font-bold text-white tracking-tight">
                            status
                          </span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">
                            Logic
                          </span>
                          <span className="text-lg font-medium text-primary italic tracking-tight uppercase">
                            is_not
                          </span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            Value
                          </span>
                          <span className="text-lg font-mono font-medium text-white/60 italic tracking-tight">
                            &quot;deleted&quot;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abstract Hint of Data */}
                <div className="flex justify-center gap-4 opacity-20">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                      }}
                      className="h-1 w-24 bg-white/40 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text Side */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-16">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[0.9] tracking-tighter">
                  Pure <br />
                  <span className="text-primary italic">Exploration.</span>
                </h2>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-sm">
                  Experience data without the noise. Our explorer delivers
                  results at the leaf with zero latency.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              {operators.map((op, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <div className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors duration-500" />
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors duration-500 tracking-widest uppercase">
                    {op.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Bottom Border */}
      <div className="absolute bottom-0 right-0 w-1/3 h-[1px] bg-gradient-to-l from-primary/20 to-transparent" />
    </section>
  );
};
