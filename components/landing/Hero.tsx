"use client";

import React from "react";
import {
    Terminal,
    Shield,
    Cpu,
    Zap,
    Layers,
    ArrowRight,
    Play
} from "lucide-react";
import { motion, Variants } from "framer-motion";

import { BackgroundBeams } from "@/components/ui/BackgroundBeams";
import { SynqLogo } from "@/components/ui/SynqLogo";

export const Hero = ({ onLaunch }: { onLaunch: () => void }) => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const codeLineVariants: Variants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: 1.5 + (i * 0.2),
                duration: 0.5
            }
        })
    };

    return (
        <section className="relative pt-48 pb-32 overflow-hidden bg-background">
            {/* MongoDB LeafyGreen Style Background Elements */}
            <BackgroundBeams />
            
            <div className="absolute top-0 left-0 w-full h-[150vh] tech-grid opacity-[0.1] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none"></div>

            {/* Moving background blobs */}
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse pointer-events-none opacity-50"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] animate-pulse pointer-events-none opacity-50" style={{ animationDelay: '2s' }}></div>

            {/* Decorative "Bits" */}
            <motion.div 
                animate={{ y: [0, -10, 0], rotate: [12, 15, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-[10%] w-4 h-4 bg-primary/20 rounded-sm rotate-12 blur-[1px]"
            ></motion.div>
            <motion.div 
                animate={{ y: [0, 8, 0], rotate: [-12, -15, -12] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-40 right-[15%] w-2 h-2 bg-primary/40 rounded-sm -rotate-12"
            ></motion.div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20"
                >
                    <motion.div 
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/20 border border-secondary/30 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-8 relative group cursor-default"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
                        <SynqLogo className="h-3 w-3 relative z-10" />
                        <span className="relative z-10">AI Driven Database Management</span>
                    </motion.div>

                    <motion.h1 
                        variants={itemVariants}
                        className="text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight"
                    >
                        Visualize, Query, <br />
                        <span className="text-primary italic">& Automate.</span>
                    </motion.h1>

                    <motion.p 
                        variants={itemVariants}
                        className="max-w-2xl text-xl text-zinc-400 mb-12 font-medium leading-relaxed"
                    >
                        A unified workspace for your entire data stack. Design schemas with interactive visual diagrams and write complex SQL effortlessly with our AI-powered Copilot.
                    </motion.p>

                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <button
                            onClick={onLaunch}
                            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg transition-all hover:bg-opacity-90 active:scale-95 shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:shadow-[0_0_30px_rgba(0,237,100,0.5)]"
                        >
                            Try SynqDB Free
                        </button>
                        <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                            <Play className="h-5 w-5 fill-white" />
                            Watch Video
                        </button>
                    </motion.div>
                </motion.div>

                {/* MongoDB Style Product Mockup */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mt-20 max-w-5xl mx-auto"
                >
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 rounded-[2.5rem] blur-2xl opacity-50"></div>

                    <motion.div 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative glass rounded-[2rem] p-4 shadow-2xl border border-white/10 overflow-hidden group"
                    >
                        <div className="bg-[#0c1c24] border-b border-white/5 p-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500/20 border border-green-500/30"></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-1.5 w-24 rounded-full bg-white/5"></div>
                                <div className="h-1.5 w-12 rounded-full bg-white/5"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-0 min-h-[460px]">
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
                                        <div className="h-2.5 w-40 rounded-full bg-white/10"></div>
                                        <div className="h-1 w-20 rounded-full bg-white/5"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-7 w-20 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <div className="h-1 w-10 bg-primary/40 rounded-full"></div>
                                        </div>
                                        <div className="h-7 w-7 rounded bg-white/5 border border-white/10"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-10">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
                                            <div className="h-1 w-12 rounded-full bg-zinc-700 mb-4"></div>
                                            <div className="h-3 w-3/4 rounded bg-white/5 mb-2"></div>
                                            <div className="h-1.5 w-10 rounded-full bg-white/5"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Code Editor Mockup */}
                                <div className="rounded-xl bg-[#021016] border border-white/5 p-8 font-mono text-sm relative group/editor overflow-hidden shadow-inner">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                                    
                                    <motion.div custom={0} variants={codeLineVariants} initial="hidden" animate="visible" className="flex gap-4 mb-4 text-zinc-600">
                                        <span className="text-primary italic font-bold">SELECT</span>
                                        <span className="text-zinc-400">users.id, profiles.avatar</span>
                                    </motion.div>
                                    <motion.div custom={1} variants={codeLineVariants} initial="hidden" animate="visible" className="flex gap-4 mb-4 text-zinc-600">
                                        <span className="text-primary italic font-bold">FROM</span>
                                        <span className="text-zinc-400">users</span>
                                    </motion.div>
                                    <motion.div custom={2} variants={codeLineVariants} initial="hidden" animate="visible" className="flex gap-4 text-zinc-600">
                                        <span className="text-primary italic font-bold">JOIN</span>
                                        <span className="text-zinc-400">profiles </span>
                                        <span className="text-primary italic font-bold">ON</span>
                                        <span className="text-zinc-400">users.id = profiles.user_id</span>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.5, duration: 1 }}
                                        className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,237,100,0.8)]"></div>
                                            <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Query Optimal</span>
                                        </div>
                                        <div className="text-zinc-500 font-mono text-xs">2.4ms</div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Decorative Elements */}
                    <motion.div 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 glass rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl z-20 border-primary/20"
                    >
                        <Zap className="h-7 w-7 text-primary" />
                    </motion.div>
                    
                    <motion.div 
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute -left-8 bottom-1/4 w-12 h-12 glass rounded-2xl flex items-center justify-center shadow-2xl z-20 border-white/5"
                    >
                        <Layers className="h-6 w-6 text-zinc-400" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
