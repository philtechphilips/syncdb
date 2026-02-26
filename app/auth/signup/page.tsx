"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Database, Github, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
            {/* Background elements */}
            <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-8">
                        <div className="h-8 w-8 flex items-center justify-center rounded-md bg-primary shadow-[0_0_15px_rgba(0,237,100,0.3)] transition-transform group-hover:scale-105">
                            <Database className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-serif tracking-tight text-white">MultiDBM</span>
                    </Link>
                    <h1 className="text-3xl font-serif text-white mb-2">Build faster together</h1>
                    <p className="text-zinc-500 font-medium">Create your developer account in seconds.</p>
                </div>

                <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl">
                    <div className="space-y-6">
                        <button className="w-full py-3.5 px-4 rounded-xl bg-white/[0.03] border border-white/5 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/[0.08] transition-all">
                            <Github className="h-5 w-5" />
                            Sign up with GitHub
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-zinc-600">
                                <span className="bg-background px-4">Or use email</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                    <input
                                        type="text"
                                        placeholder="Alex Rivera"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Secure Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-[0.05em]">I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.</p>
                            </div>
                        </div>

                        <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group">
                            Create Account
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-zinc-600 font-medium">
                    Already have an account? <Link href="/auth/login" className="text-primary hover:underline">Sign in instead</Link>
                </p>
            </div>
        </div>
    );
}
