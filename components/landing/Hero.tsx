"use client";

import React from "react";
import {
    Terminal,
    Shield,
    Cpu,
    Zap,
    Layers,
    ArrowRight,
    Play,
    Database
} from "lucide-react";

export const Hero = ({ onLaunch }: { onLaunch: () => void }) => {
    return (
        <section className="relative pt-48 pb-32 overflow-hidden bg-background">
            {/* MongoDB LeafyGreen Style Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[150vh] tech-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none"></div>

            {/* Decorative "Bits" - MongoDB Theme */}
            <div className="absolute top-20 right-[10%] w-4 h-4 bg-primary/20 rounded-sm rotate-12 blur-[1px]"></div>
            <div className="absolute top-40 right-[15%] w-2 h-2 bg-primary/40 rounded-sm -rotate-12"></div>
            <div className="absolute bottom-40 left-[10%] w-6 h-6 border border-primary/20 rounded-sm rotate-45"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/20 border border-secondary/30 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-8">
                        <Database className="h-3 w-3" />
                        AI Driven Database Management
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight">
                        Visualize, Query, <br />
                        <span className="text-primary italic">& Automate.</span>
                    </h1>

                    <p className="max-w-2xl text-xl text-zinc-400 mb-12 font-medium leading-relaxed">
                        A unified workspace for your entire data stack. Design schemas with interactive visual diagrams and write complex SQL effortlessly with our AI-powered Copilot.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button
                            onClick={onLaunch}
                            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg transition-all hover:bg-opacity-90 active:scale-95 shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:shadow-[0_0_30px_rgba(0,237,100,0.5)]"
                        >
                            Try MultiDBM Free
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                            <Play className="h-5 w-5 fill-white" />
                            Watch Video
                        </button>
                    </div>
                </div>

                {/* MongoDB Style Product Mockup - "2D-but-3D" Perspective */}
                <div className="relative mt-20 max-w-5xl mx-auto">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 rounded-[2.5rem] blur-2xl opacity-50"></div>

                    <div className="relative glass rounded-[2rem] p-4 shadow-2xl border border-white/10 overflow-hidden group">
                        <div className="bg-[#0c1c24] border-b border-white/5 p-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-1 w-20 rounded-full bg-white/5"></div>
                                <div className="h-1 w-12 rounded-full bg-white/5"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-0 min-h-[400px]">
                            {/* Left Sidebar Mockup */}
                            <div className="col-span-3 border-r border-white/5 p-6 space-y-6 bg-white/[0.01]">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3 group/item cursor-pointer">
                                        <div className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-primary shadow-[0_0_8px_rgba(0,237,100,0.8)]' : 'bg-zinc-700'}`}></div>
                                        <div className={`h-1.5 rounded-full flex-1 ${i === 1 ? 'bg-white/20' : 'bg-white/5'}`}></div>
                                    </div>
                                ))}
                                <div className="pt-10">
                                    <div className="h-1.5 w-1/2 rounded-full bg-zinc-800 mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-1 w-full rounded-full bg-zinc-800/50"></div>
                                        <div className="h-1 w-4/5 rounded-full bg-zinc-800/50"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Mockup */}
                            <div className="col-span-9 p-8 bg-[#06161c]">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-2">
                                        <div className="h-2 w-32 rounded-full bg-white/10"></div>
                                        <div className="h-1 w-20 rounded-full bg-white/5"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-16 rounded bg-primary/10 border border-primary/20"></div>
                                        <div className="h-6 w-6 rounded bg-white/5"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-10">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                            <div className="h-1 w-1/2 rounded-full bg-zinc-700 mb-3"></div>
                                            <div className="h-4 w-2/3 rounded bg-white/5"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Code Editor Mockup */}
                                <div className="rounded-xl bg-[#021016] border border-white/5 p-6 font-mono text-xs">
                                    <div className="flex gap-4 mb-4 text-zinc-600">
                                        <span className="text-primary italic">SELECT</span>
                                        <span className="text-zinc-400">users.id, profiles.avatar</span>
                                    </div>
                                    <div className="flex gap-4 mb-4 text-zinc-600">
                                        <span className="text-primary italic">FROM</span>
                                        <span className="text-zinc-400">users</span>
                                    </div>
                                    <div className="flex gap-4 text-zinc-600">
                                        <span className="text-primary italic">JOIN</span>
                                        <span className="text-zinc-400">profiles </span>
                                        <span className="text-primary italic">ON</span>
                                        <span className="text-zinc-400">users.id = profiles.user_id</span>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-[10px] text-primary/60 uppercase tracking-widest font-bold">Query Plan: Optimal</span>
                                        </div>
                                        <div className="text-zinc-500">2.4ms</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Decorative Elements */}
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </div>
        </section>
    );
};
