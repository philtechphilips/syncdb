"use client";

import React, { useState } from "react";
import {
    X,
    Database,
    Shield,
    Globe,
    Lock,
    ChevronRight,
    Info
} from "lucide-react";

const ConnectionDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [selectedDb, setSelectedDb] = useState("PostgreSQL");

    if (!isOpen) return null;

    const databases = [
        { name: "PostgreSQL", icon: "🐘", color: "text-blue-400" },
        { name: "MySQL / MariaDB", icon: "🐬", color: "text-emerald-400" },
        { name: "MSSQL / SQL Server", icon: "🪟", color: "text-red-400" },
        { name: "SQLite", icon: "📦", color: "text-orange-400" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="relative w-full max-w-3xl rounded-[2.5rem] bg-background p-10 shadow-3xl border border-white/5 overflow-hidden">
                {/* Background Tech Elements */}
                <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/10 blur-[100px] pointer-events-none"></div>

                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                        <h2 className="text-3xl font-serif text-white tracking-tight">Add New Connection</h2>
                        <p className="text-zinc-500 font-medium">Configure your terminal to access remote clusters.</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2.5 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                    {/* Provider Selection */}
                    <div className="lg:col-span-5 space-y-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Select Provider</span>
                        <div className="grid grid-cols-1 gap-3">
                            {databases.map((db) => (
                                <button
                                    key={db.name}
                                    onClick={() => setSelectedDb(db.name)}
                                    className={`flex items-center gap-4 rounded-2xl border p-4 transition-all group relative overflow-hidden ${selectedDb === db.name
                                            ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(0,237,100,0.1)]"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/20"
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform ${selectedDb === db.name ? "text-primary" : "text-zinc-500"}`}>
                                        <Database className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className={`text-sm font-bold ${selectedDb === db.name ? "text-white" : "text-zinc-400"}`}>{db.name}</span>
                                        <span className="text-[10px] font-medium text-zinc-600">Standard Driver</span>
                                    </div>
                                    {selectedDb === db.name && (
                                        <div className="absolute top-0 right-0 h-10 w-10 bg-primary/10 rounded-bl-3xl flex items-center justify-center translate-x-1 -translate-y-1">
                                            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,237,100,1)]"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="lg:col-span-7 space-y-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Connection Details</span>
                        <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Host & Port</label>
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-8 relative">
                                        <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                                        <input type="text" placeholder="127.0.0.1" className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="col-span-4">
                                        <input type="text" placeholder="5432" className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Authentication</label>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Database Name" className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    <input type="text" placeholder="Username" className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                                        <input type="password" placeholder="Password" className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-between gap-6 relative z-10 border-t border-white/5 pt-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <Shield className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Tunnel</span>
                            <span className="text-[10px] text-zinc-600 font-medium">End-to-End TLS Encryption</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="rounded-xl px-8 py-3 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Discard</button>
                        <button className="flex items-center gap-3 rounded-xl bg-primary px-10 py-3 text-sm font-black text-primary-foreground shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:shadow-[0_0_30px_rgba(0,237,100,0.5)] transition-all active:scale-95 group">
                            Establish Connection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionDialog;
