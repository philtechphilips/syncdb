"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Database, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

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
                    <h1 className="text-3xl font-serif text-white mb-2">Reset password</h1>
                    <p className="text-zinc-500 font-medium">We'll send you a link to get back into your account.</p>
                </div>

                <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl">
                    {!isSubmitted ? (
                        <div className="space-y-6">
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

                            <button
                                onClick={() => setIsSubmitted(true)}
                                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                Send Reset Link
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-6">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                            <p className="text-zinc-500 font-medium mb-8">If an account exists for that email, we've sent instructions to reset your password.</p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-primary font-bold hover:underline"
                            >
                                Didn't receive it? Try again
                            </button>
                        </div>
                    )}
                </div>

                <Link href="/auth/login" className="mt-8 flex items-center justify-center gap-2 text-zinc-500 font-medium hover:text-white transition-colors group">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to sign in
                </Link>
            </div>
        </div>
    );
}
