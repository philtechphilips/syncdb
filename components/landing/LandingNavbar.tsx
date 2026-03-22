"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { useAuthStore } from "@/store/useAuthStore";

export const LandingNavbar = ({ onLaunch }: { onLaunch: () => void }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-[95%] max-w-7xl`}
        >
            <div className={`mx-auto px-8 flex items-center justify-between transition-all duration-700 rounded-full border border-white/5 ${isScrolled ? "bg-background/40 backdrop-blur-2xl py-3 border-white/10" : "bg-transparent py-5"}`}>
                {/* Brand */}
                <Link href="/" className="flex items-center group cursor-pointer shrink-0">
                    <SynqLogo className="h-6 w-6 text-primary translate-y-[1px]" />
                    <span className="text-lg font-serif tracking-tight text-white -ml-0.5 italic">ynqDB</span>
                </Link>

                {/* Nav Links - Focused and Clean */}
                <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    {[
                        { name: "Features", href: "#features" },
                        { name: "Databases", href: "#databases" },
                        { name: "Security", href: "#security" },
                        { name: "Pricing", href: "#pricing" }
                    ].map((link) => (
                        <a 
                            key={link.name}
                            href={link.href} 
                            className="hover:text-primary transition-colors relative group/link"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary transition-all duration-300 group-hover/link:w-full" />
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-10">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors">Workspace</Link>
                            <button
                                onClick={logout}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 hover:text-red-400 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors">Sign In</Link>
                            <Link
                                href="/auth/signup"
                                className="px-6 py-2.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                            >
                                Try Free
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};
