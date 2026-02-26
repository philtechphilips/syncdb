"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, Key, CheckCircle2 } from "lucide-react";

export const SecuritySection = () => {
    const features = [
        "End-to-End Encryption",
        "Role-Based Access Control",
        "SSO & MFA Integration",
        "Audit Logging",
        "VPC Peering",
        "SOC2 Type II Compliant"
    ];

    return (
        <section id="security" className="py-32 bg-[#0c1c24] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full tech-grid opacity-[0.05] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full opacity-50"></div>

                        <div className="relative bg-background border border-white/10 rounded-[3rem] p-12 shadow-2xl overflow-hidden group">
                            <div className="flex justify-center mb-12">
                                <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
                                    <ShieldCheck className="h-12 w-12 text-primary" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 w-full bg-white/5 rounded-full relative overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-primary/20 rounded-full"
                                            style={{ width: `${i * 30}%`, transition: 'width 2s' }}
                                        ></div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
                                    <Lock className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Encrypted</span>
                                </div>
                                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
                                    <Key className="h-5 w-5 text-primary" />
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">MFA active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.25em] mb-8">
                            Enterprise Grade
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">Neural Intelligence.<br />Bit-level Security.</h2>
                        <p className="text-xl text-zinc-400 mb-12 font-medium leading-relaxed">MultiDBM combines AI-assisted policy generation with zero-trust architecture. We don't just secure your data; we secure every SQL execution and automated migration path.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span className="text-zinc-300 font-medium">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
