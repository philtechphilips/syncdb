"use client";

import React from "react";
import { Cpu, GitBranch, ArrowRight, Sparkles, LayoutGrid } from "lucide-react";

export const DeveloperExperience = () => {
    return (
        <section id="experience" className="py-32 bg-[#06161c] relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Built for speed,<br />optimized for developers.</h2>
                    <p className="text-xl text-zinc-400 font-medium">MultiDBM provides a grounded, high-performance environment for database management. Focus on your data with our visual tools and AI-assisted editor.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* CLI Feature */}
                    <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-start justify-between mb-12">
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Intelligence</div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">AI-Assisted Editor</h3>
                        <p className="text-zinc-500 text-lg font-medium mb-10 leading-relaxed">Write, optimize, and debug SQL queries with our integrated AI copilot that understands your schema context perfectly.</p>

                        <div className="rounded-xl bg-[#021016] border border-white/5 p-6 font-mono text-xs">
                            <div className="flex gap-4 mb-4 text-zinc-600">
                                <span className="text-primary italic">-- Ask AI </span>
                            </div>
                            <div className="text-zinc-400 mb-2 italic">"Find top performing products..."</div>
                            <div className="h-0.5 w-full bg-primary/20 mb-4 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000"></div>
                            <div className="text-zinc-300">
                                SELECT * FROM products<br />
                                ORDER BY sales DESC<br />
                                LIMIT 10;
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure as Code Feature */}
                    <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-start justify-between mb-12">
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <LayoutGrid className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Visualization</div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Visual Schema Designer</h3>
                        <p className="text-zinc-500 text-lg font-medium mb-10 leading-relaxed">Map your data relationships visually. Our interactive ER engine turns complex table structures into clear, manageable diagrams.</p>

                        <div className="relative h-[180px] rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 tech-grid opacity-10"></div>
                            <div className="relative flex gap-4">
                                <div className="h-16 w-12 rounded bg-primary/20 border border-primary/40 animate-pulse"></div>
                                <div className="flex flex-col justify-center gap-2">
                                    <div className="h-1 w-20 bg-primary/40 rounded-full"></div>
                                    <div className="h-1 w-12 bg-primary/20 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
