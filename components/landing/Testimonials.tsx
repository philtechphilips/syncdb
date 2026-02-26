"use client";

import React from "react";
import { Quote } from "lucide-react";

export const Testimonials = () => {
    const reviews = [
        {
            name: "Sarah Chen",
            role: "Principal Data Engineer",
            company: "Linear Scale",
            text: "The AI SQL Copilot is a game changer for our junior devs. It translates business logic into complex joins perfectly, saving us hours of code review.",
            image: "SC"
        },
        {
            name: "Marcus Thorne",
            role: "Head of Infrastructure",
            company: "Vortex Labs",
            text: "Being able to visually drag and expand table schemas in the ER Diagram makes architectural discussions 10x more productivity than raw SQL files.",
            image: "MT"
        },
        {
            name: "Leo Hashimoto",
            role: "Fullstack Developer",
            company: "Hyperion",
            text: "Unified management for Postgres, MySQL, and MSSQL from a single sidebar is exactly what we needed. The minimalist UI helps me stay in the flow longer.",
            image: "LH"
        }
    ];

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Loved by engineering teams.</h2>
                    <p className="text-xl text-zinc-500 font-medium">From startups to global enterprises, engineers rely on MultiDBM every day.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((r, i) => (
                        <div key={i} className="p-10 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 relative group">
                            <Quote className="absolute top-10 right-10 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />

                            <p className="text-zinc-400 text-lg font-medium leading-relaxed mb-10 italic">
                                "{r.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                                    {r.image}
                                </div>
                                <div>
                                    <div className="text-white font-bold">{r.name}</div>
                                    <div className="text-zinc-600 text-sm">{r.role} @ {r.company}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 pt-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-40">
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-serif text-white">10k+</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Engineers</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-serif text-white">50M+</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Queries/Day</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-serif text-white">100%</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Open Source</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-serif text-white">99.9%</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">SLA Guaranteed</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
