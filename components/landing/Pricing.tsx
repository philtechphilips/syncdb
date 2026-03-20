"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";

export const Pricing = () => {
    const plans = [
        {
            name: "Community",
            price: "Free",
            description: "Perfect for individual developers and open source projects.",
            features: [
                "Unlimited local connections",
                "Community SQL editor",
                "Visual ER diagrams",
                "Standard query console"
            ],
            cta: "Get Started",
            highlighted: false
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Advanced features and support for high-scale organizations.",
            features: [
                "Everything in Community",
                "SSO & RBAC security",
                "Advanced data obfuscation",
                "24/7 Priority support",
                "Custom visual reporting"
            ],
            cta: "Contact Sales",
            highlighted: true
        }
    ];

    return (
        <section id="pricing" className="py-32 bg-background relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Simple, transparent pricing.</h2>
                    <p className="text-xl text-zinc-500 font-medium">Choose the plan that fits your team's scale. Start for free, upgrade as you grow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`p-12 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${plan.highlighted
                                    ? "bg-primary/5 border-primary/20 shadow-[0_0_50px_rgba(0,237,100,0.1)] scale-105 z-10"
                                    : "bg-white/[0.01] border-white/5 hover:border-white/10"
                                }`}
                        >
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="text-4xl font-serif text-white mb-4">{plan.price}</div>
                                <p className="text-zinc-500 font-medium">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-zinc-400 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 group ${plan.highlighted
                                    ? "bg-primary text-primary-foreground hover:bg-opacity-90"
                                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                                }`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
