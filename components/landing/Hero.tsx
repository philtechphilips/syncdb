"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            <BackgroundBeams />
            
            {/* Faint, Continuously Animated Background Logo */}
            <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ 
                    opacity: 0.05, 
                    rotate: 360,
                    scale: [1, 1.05, 1] 
                }}
                transition={{ 
                    rotate: { duration: 100, repeat: Infinity, ease: "linear" },
                    scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 2 }
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
            >
                <SynqLogo className="h-[800px] w-[800px] text-primary" animate={false} />
            </motion.div>            
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center max-w-5xl mx-auto"
                >

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-[10rem] font-serif text-white mb-12 leading-[0.85] tracking-tighter"
                    >
                        Manage <br />
                        <span className="text-primary italic">Databases.</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="max-w-xl text-xl md:text-2xl text-zinc-500 mb-16 font-medium leading-relaxed tracking-tight"
                    >
                        One place to connect all your databases. <br />
                        <span className="text-white">Built for speed, made for developers.</span>
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-8"
                    >
                        <button
                            onClick={onLaunch}
                            className="group relative px-8 py-3.5 rounded-full bg-primary text-white font-black text-base transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10">
                                Get Started
                            </span>
                        </button>
                        
                        <div className="flex items-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                             <div className="h-[1px] w-12 bg-white/20" />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Trust Synchronized</span>
                             <div className="h-[1px] w-12 bg-white/20" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Abstract Background Scroll Indicator or Detail */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
                <div className="h-12 w-[1px] bg-gradient-to-b from-primary/40 to-transparent" />
            </motion.div>
        </section>
    );
};

