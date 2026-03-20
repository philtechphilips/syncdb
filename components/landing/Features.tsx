"use client";

import React from "react";
import {
    Zap,
    Globe2,
    MousePointerClick,
    Sparkles,
    LayoutGrid,
    Search
} from "lucide-react";
import { motion, Variants } from "framer-motion";

export const Features = () => {
    const features = [
        {
            title: "AI SQL Copilot",
            description: "Translate natural language to optimized SQL instantly with our integrated neural engine.",
            icon: <Sparkles className="h-6 w-6 text-primary" />,
        },
        {
            title: "Visual ER Diagrams",
            description: "Visualize and organize your schema with interactive, draggable table relationships and auto-layout.",
            icon: <LayoutGrid className="h-6 w-6 text-primary" />,
        },
        {
            title: "Unified Multi-DB Explorer",
            description: "Manage Postgres, MySQL, MSSQL, and SQLite simultaneously from a single, high-performance sidebar.",
            icon: <Globe2 className="h-6 w-6 text-primary" />,
        },
        {
            title: "Minimalist Performance Controls",
            description: "A noise-free interface designed for deep focus and extreme database management speed.",
            icon: <Zap className="h-6 w-6 text-primary" />,
        },
        {
            title: "Smart Query Logs",
            description: "Review and re-run historical queries with grouped date views and instant execution stats.",
            icon: <Search className="h-6 w-6 text-primary" />,
        },
        {
            title: "One-Click Migration",
            description: "Zero-downtime migrations between database instances with built-in schema synchronization.",
            icon: <MousePointerClick className="h-6 w-6 text-primary" />,
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden">
            <div className="absolute inset-0 tech-grid opacity-[0.05]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Built for the modern <br />developer.</h2>
                    <p className="text-xl text-zinc-400 font-medium">The same power you expect from industry leaders, with a developer experience that actually makes sense.</p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group p-10 bg-background hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-8 p-3 w-max rounded-lg bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                                <p className="text-zinc-500 text-lg font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">{f.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
