"use client";

import React from "react";
import { Twitter, Github, Linkedin } from "lucide-react";
import { SynqLogo } from "@/components/ui/SynqLogo";

export const Footer = () => {
    return (
        <footer className="py-24 bg-[#0c1c24] relative overflow-hidden">
            {/* Subtle bottom glow to finish the page */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-6 cursor-pointer">
                            <SynqLogo className="h-6 w-6 text-primary translate-y-[1px]" />
                            <span className="text-xl font-serif tracking-tight text-white -ml-0.5">ynqDB</span>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            The industry standard for multi-cloud database orchestration and management.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Product</h4>
                        <nav className="flex flex-col gap-2 text-sm text-zinc-500 font-medium">
                            <a href="#" className="hover:text-primary transition-colors">Features</a>
                            <a href="#" className="hover:text-primary transition-colors">Integrations</a>
                            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
                            <a href="#" className="hover:text-primary transition-colors">Changelog</a>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Company</h4>
                        <nav className="flex flex-col gap-2 text-sm text-zinc-500 font-medium">
                            <a href="#" className="hover:text-primary transition-colors">About Us</a>
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact</a>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white transition-all"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white transition-all"><Github className="h-5 w-5" /></a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white transition-all"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                    <span>&copy; 2024 SynqDB, INC. ALL RIGHTS RESERVED.</span>
                    <span>MADE WITH &hearts; BY THE COMMUNITY.</span>
                </div>
            </div>
        </footer>
    );
};
