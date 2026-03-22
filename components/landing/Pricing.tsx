"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Pricing = () => {
    return (
        <section id="pricing" className="py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24 max-w-4xl">
                    <span className="text-primary text-xs font-black tracking-[0.4em] uppercase">Pricing</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-8 leading-[0.9] tracking-tighter">
                        Simple <br />
                        <span className="text-primary italic">Pricing.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Community Plan */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 border-t border-white/10 space-y-12"
                    >
                         <h3 className="text-2xl font-bold text-white tracking-tight">Community</h3>
                         <div className="text-4xl md:text-5xl font-serif text-zinc-500 leading-none tracking-tighter">Free</div>
                         <p className="text-xl text-zinc-500 leading-relaxed max-w-xs">
                            Essential performance for individual developers and small teams.
                         </p>
                         <ul className="space-y-6 text-zinc-400 font-medium">
                             <li>• Unlimited Local Clusters</li>
                             <li>• AI Copilot Integration</li>
                             <li>• Visual Schema Explorer</li>
                         </ul>
                         <button className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] group text-xs mt-12 transition-all">
                             Get Started Now
                         </button>
                    </motion.div>

                    {/* Enterprise Plan */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="p-12 border-t border-primary/40 bg-primary/[0.02] space-y-12"
                    >
                         <h3 className="text-2xl font-bold text-white tracking-tight">Enterprise</h3>
                         <div className="text-4xl md:text-5xl font-serif text-primary leading-none tracking-tighter italic">Custom</div>
                         <p className="text-xl text-zinc-500 leading-relaxed max-w-xs">
                            Unparalleled scale, security, and dedicated infrastructure support.
                         </p>
                         <ul className="space-y-6 text-zinc-400 font-medium">
                             <li>• SSO / RBAC Security</li>
                             <li>• Compliance Guardrails</li>
                             <li>• 24/7 Priority Mesh</li>
                         </ul>
                         <button className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] group text-xs mt-12 transition-all">
                             Contact Sales
                         </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

