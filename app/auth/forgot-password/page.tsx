"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { useAuthStore } from "@/store/useAuthStore";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { forgotPassword, isLoading, error, clearError, isAuthenticated } = useAuthStore();
    
    React.useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (err) {
            // Error is handled by the store
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
            {/* Background elements */}
            <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center group mb-8">
                        <SynqLogo className="h-8 w-8 text-primary translate-y-[1px]" />
                        <span className="text-xl font-serif tracking-tight text-white -ml-0.5">ynqDB</span>
                    </Link>
                    <h1 className="text-3xl font-serif text-white mb-2">Reset password</h1>
                    <p className="text-zinc-500 font-medium whitespace-nowrap">We'll send you a link to get back into your account.</p>
                </div>

                <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <div className="flex-1 flex justify-between items-center">
                                        <span>{error}</span>
                                        <button onClick={clearError} className="hover:text-red-300">✕</button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-6">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                            <p className="text-zinc-500 font-medium mb-8">If an account exists for {email}, we've sent instructions to reset your password.</p>
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
