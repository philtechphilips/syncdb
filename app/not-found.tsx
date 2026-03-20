"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, Terminal } from "lucide-react";
import { SynqLogo } from "@/components/ui/SynqLogo";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            {/* Animated Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <div className="relative z-10 max-w-2xl w-full">
                {/* Brand Logo */}
                <Link href="/" className="inline-flex items-center group mb-16 opacity-80 hover:opacity-100 transition-opacity">
                    <SynqLogo className="h-10 w-10 text-primary translate-y-[1px]" />
                    <span className="text-2xl font-serif tracking-tight text-white -ml-0.5">ynqDB</span>
                </Link>

                {/* 404 Visual */}
                <div className="relative mb-12 select-none">
                    <h1 className="text-[180px] md:text-[240px] font-black text-white/5 leading-none tracking-tighter">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-4">
                        <div className="flex flex-col items-center gap-6">
                            <div className="h-24 w-24 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-2xl backdrop-blur-sm group">
                                <Search className="h-10 w-10 text-primary animate-bounce duration-3000" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif text-white max-w-md">Data cluster not found</h2>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <p className="text-zinc-500 font-medium text-lg mb-12 max-w-sm mx-auto leading-relaxed">
                    The requested node seems to have been dropped or moved to a different coordinate.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] transition-all active:scale-95 group"
                    >
                        <Home className="h-4 w-4" />
                        Back to Base
                    </Link>
                    <Link 
                        href="/dashboard"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.03] border border-white/5 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/[0.08] transition-all group"
                    >
                        <Terminal className="h-4 w-4 text-zinc-500 group-hover:text-primary transition-colors" />
                        SQL Console
                    </Link>
                </div>

                {/* Command Hint */}
                <div className="mt-16 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.01] text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                    <span className="h-1 w-1 rounded-full bg-red-500"></span>
                    Packet Loss Detected: error_code_404
                </div>
            </div>

            {/* Decorations */}
            <div className="absolute top-10 left-10 p-4 border border-white/5 rounded-xl opacity-20 hidden md:block">
                <div className="h-1 w-20 bg-primary/20 rounded-full mb-2"></div>
                <div className="h-1 w-12 bg-white/10 rounded-full mb-2"></div>
                <div className="h-1 w-16 bg-white/10 rounded-full"></div>
            </div>
            <div className="absolute bottom-10 right-10 p-4 border border-white/5 rounded-xl opacity-20 hidden md:block">
                <div className="h-1 w-12 bg-white/10 rounded-full mb-2"></div>
                <div className="h-1 w-20 bg-secondary/20 rounded-full mb-2"></div>
                <div className="h-1 w-16 bg-white/10 rounded-full"></div>
            </div>
        </div>
    );
}
