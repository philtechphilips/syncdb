"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, User } from "lucide-react";
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-8"}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center group cursor-pointer">
                    <SynqLogo className="h-7 w-7 text-primary translate-y-[1px]" />
                    <span className="text-xl font-serif tracking-tight text-white -ml-0.5">ynqDB</span>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-zinc-500">
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                    <a href="#databases" className="hover:text-primary transition-colors">Databases</a>
                    <a href="#security" className="hover:text-primary transition-colors">Security</a>
                    <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                </div>

                <div className="flex items-center gap-8">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
                            <button 
                                onClick={logout}
                                className="text-[10px] font-bold uppercase tracking-widest text-red-500/80 hover:text-red-400 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Sign In</Link>
                            <Link
                                href="/auth/signup"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-opacity-90 active:scale-95 shadow-[0_0_20px_rgba(0,237,100,0.2)]"
                            >
                                Try Free
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
