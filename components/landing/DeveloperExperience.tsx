"use client";

import React from "react";
import { Cpu, GitBranch, ArrowRight, Sparkles, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export const DeveloperExperience = () => {
    return (
        <section id="experience" className="py-32 bg-[#06161c] relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Built for speed,<br />optimized for developers.</h2>
                    <p className="text-xl text-zinc-400 font-medium">SynqDB provides a grounded, high-performance environment for database management. Focus on your data with our visual tools and AI-assisted editor.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* CLI Feature */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-12">
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Intelligence</div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">AI-Assisted Editor</h3>
                            <p className="text-zinc-500 text-lg font-medium mb-10 leading-relaxed">Write, optimize, and debug SQL queries with our integrated AI copilot that understands your schema context perfectly.</p>

                            <div className="rounded-xl bg-[#021016] border border-white/5 p-6 font-mono text-xs relative group/editor shadow-2xl">
                                <div className="flex gap-4 mb-4 text-zinc-600">
                                    <span className="text-primary italic">-- Ask AI </span>
                                </div>
                                <div className="text-zinc-400 mb-2 italic">"Find top performing products..."</div>
                                <div className="h-0.5 w-full bg-primary/20 mb-4 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000"></div>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="text-zinc-300"
                                >
                                    <span className="text-primary">SELECT</span> * <span className="text-primary">FROM</span> products<br />
                                    <span className="text-primary">ORDER BY</span> sales <span className="text-primary">DESC</span><br />
                                    <span className="text-primary">LIMIT</span> 10;
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Infrastructure as Code Feature */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-12">
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                                    <LayoutGrid className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Visualization</div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Visual Schema Designer</h3>
                            <p className="text-zinc-500 text-lg font-medium mb-10 leading-relaxed">Map your data relationships visually. Our interactive ER engine turns complex table structures into clear, manageable diagrams.</p>

                            <div className="relative h-[180px] rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden flex items-center justify-center group/schema">
                                <div className="absolute inset-0 tech-grid opacity-10"></div>
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 1, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative flex gap-4"
                                >
                                    <div className="h-16 w-12 rounded bg-primary/20 border border-primary/40 flex flex-col p-2 gap-1">
                                        <div className="h-1 w-full bg-primary/40 rounded-full"></div>
                                        <div className="h-0.5 w-full bg-primary/20 rounded-full"></div>
                                        <div className="h-0.5 w-3/4 bg-primary/20 rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-2">
                                        <motion.div 
                                            animate={{ width: [40, 60, 40] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="h-1 bg-primary/40 rounded-full"
                                        ></motion.div>
                                        <div className="h-1 w-12 bg-primary/20 rounded-full"></div>
                                    </div>
                                    <div className="h-16 w-12 rounded bg-white/5 border border-white/10 flex flex-col p-2 gap-1">
                                        <div className="h-1 w-full bg-white/20 rounded-full"></div>
                                        <div className="h-0.5 w-full bg-white/10 rounded-full"></div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
