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

    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden">
            <div className="absolute inset-0 tech-grid opacity-[0.05]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-3xl mb-24">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Built for the modern <br />developer.</h2>
                    <p className="text-xl text-zinc-400 font-medium">The same power you expect from industry leaders, with a developer experience that actually makes sense.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="group p-10 bg-background hover:bg-white/[0.02] transition-all duration-300"
                        >
                            <div className="mb-8 p-3 w-max rounded-lg bg-primary/10 border border-primary/20">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                            <p className="text-zinc-500 text-lg font-medium leading-relaxed group-hover:text-zinc-400 transition-colors">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
