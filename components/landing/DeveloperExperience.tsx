"use client";

import React from "react";
import { Sparkles, Zap, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

export const DeveloperExperience = () => {
    return (
        <section id="experience" className="py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="space-y-32">
                    {/* Performance Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <span className="text-primary text-xs font-black tracking-[0.4em] uppercase">Built for speed</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-white leading-[0.9] tracking-tighter">
                                Faster <br />
                                <span className="text-primary italic">Execution.</span>
                            </h2>
                            <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-lg">
                                SynqDB is built for high-performance and is optimized for speed. Manage your databases without any lag or delays.
                            </p>
                        </motion.div>
                        
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative h-64 w-full max-w-sm flex flex-col items-start justify-center">
                                 <div className="text-[7rem] font-serif text-white/5 italic select-none">0.8ms</div>
                                 <motion.div 
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-[2px] w-full bg-gradient-to-r from-primary/40 to-transparent -mt-12 origin-left"
                                 />
                                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mt-4 ml-4">High-performance engine</span>
                            </div>
                        </div>
                    </div>

                    {/* Intelligence Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 lg:order-1 flex justify-center lg:justify-start"
                        >
                            <div className="relative h-64 w-64 flex items-center justify-center">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ 
                                            rotate: 360,
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
                                        }}
                                        className="absolute border border-primary/20 rounded-full"
                                        style={{ 
                                            width: 100 + i * 40, 
                                            height: 100 + i * 40,
                                            opacity: 0.1 - (i * 0.01)
                                        }}
                                    />
                                ))}
                                <motion.div 
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_rgba(39,121,85,1)]"
                                />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2 space-y-8"
                        >
                            <span className="text-primary text-xs font-black tracking-[0.4em] uppercase">AI Powered</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-white leading-[0.9] tracking-tighter">
                                SQL <br />
                                <span className="text-primary italic">Sidekick.</span>
                            </h2>
                            <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-lg">
                                Our AI helps you write SQL faster and better. It understands your database structure and suggests the right queries for you.
                            </p>
                        </motion.div>
                    </div>

                    {/* Structure Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <span className="text-primary text-xs font-black tracking-[0.4em] uppercase">Visual Tools</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-white leading-[0.9] tracking-tighter">
                                See your <br />
                                <span className="text-primary italic">Data.</span>
                            </h2>
                            <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-lg">
                                Don't just look at tables. See the relationships and the structure of your data in a clear, visual way.
                            </p>
                        </motion.div>

                        <div className="flex justify-center lg:justify-end">
                            <div className="relative h-96 w-full max-w-md flex items-center justify-center">
                                {/* Visual Data Structure Illustration (ER Diagram style) */}
                                <div className="relative w-full h-full">
                                    {/* table 1 */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="absolute top-10 left-10 p-4 border border-primary/20 bg-primary/5 rounded-xl backdrop-blur-sm w-36"
                                    >
                                        <div className="h-1.5 w-12 bg-primary/40 rounded-full mb-3" />
                                        <div className="space-y-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="h-1 w-full bg-white/10 rounded-full" />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* table 2 */}
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border border-primary/40 bg-primary/10 rounded-2xl backdrop-blur-md w-44 z-10"
                                    >
                                        <div className="h-2 w-16 bg-primary rounded-full mb-4" />
                                        <div className="space-y-3">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className={`h-1.5 w-full rounded-full ${i === 1 ? 'bg-primary/50' : 'bg-white/10'}`} />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* table 3 */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 }}
                                        className="absolute bottom-10 right-10 p-4 border border-primary/20 bg-primary/5 rounded-xl backdrop-blur-sm w-36"
                                    >
                                        <div className="h-1.5 w-12 bg-primary/40 rounded-full mb-3" />
                                        <div className="space-y-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="h-1 w-full bg-white/10 rounded-full" />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Connecting Lines (SVG) */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
                                        <motion.path 
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 1 }}
                                            d="M140 80 L220 180" 
                                            stroke="currentColor" 
                                            className="text-primary" 
                                            strokeWidth="1" 
                                            fill="none" 
                                        />
                                        <motion.path 
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 1.2 }}
                                            d="M260 220 L320 300" 
                                            stroke="currentColor" 
                                            className="text-primary" 
                                            strokeWidth="1" 
                                            fill="none" 
                                        />
                                    </svg>

                                    {/* Floating Data Points */}
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div 
                                            key={i}
                                            animate={{ 
                                                y: [0, -15, 0],
                                                opacity: [0.1, 0.3, 0.1]
                                            }}
                                            transition={{ 
                                                duration: 3 + i, 
                                                repeat: Infinity,
                                                delay: i * 0.5
                                            }}
                                            className="absolute h-1 w-1 rounded-full bg-primary"
                                            style={{ 
                                                top: `${20 + i * 15}%`,
                                                left: `${15 + i * 20}%`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


