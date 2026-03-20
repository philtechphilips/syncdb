"use client";

import React, { useEffect, useState } from "react";
import { Database, Plus, ChevronRight, Loader2, Server, Activity, ArrowRight, LogOut } from "lucide-react";
import { useClusterStore, Cluster } from "@/store/useClusterStore";
import { useAuthStore } from "@/store/useAuthStore";
import { SynqLogo } from "@/components/ui/SynqLogo";
import ConnectionDialog from "./ConnectionDialog";

export default function ClusterGate({ children }: { children: React.ReactNode }) {
    const { clusters, selectedCluster, fetchClusters, selectCluster, isLoading: isClustersLoading } = useClusterStore();
    const { user, logout } = useAuthStore();
    const [isConnectOpen, setIsConnectOpen] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        fetchClusters().finally(() => setHasChecked(true));
    }, [fetchClusters]);

    if (!hasChecked || isClustersLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse">Syncing Clusters...</p>
            </div>
        );
    }

    // Goal: if user has dbs, they must select one. If they have none, they must connect one.
    if (!selectedCluster) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Tech Elements */}
                <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
                    <div className="text-center mb-12 flex flex-col items-center">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 mb-8 p-4 text-primary">
                            <SynqLogo className="h-full w-full" />
                        </div>
                        <div className="flex flex-col mb-6">
                            <span className="text-2xl font-black text-white tracking-tight">SynqDB</span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-80 mt-1">Professional Interface</span>
                        </div>
                        <h1 className="text-3xl font-serif text-white mb-3 tracking-tight">
                            {clusters.length === 0 ? "Establish your first connection" : "Select an active cluster"}
                        </h1>
                        <p className="text-zinc-500 font-medium max-w-md mx-auto">
                            {clusters.length === 0 
                                ? "Before exploring the dashboard, you need to connect to a PostgreSQL or MySQL database." 
                                : "Choose a database cluster from your repository to start managing your data."}
                        </p>
                    </div>

                    {clusters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
                            {clusters.map((cluster) => (
                                <button
                                    key={cluster.id}
                                    onClick={() => selectCluster(cluster)}
                                    className="group relative flex items-center gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-primary/[0.02] transition-all text-left"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                        <Database className="h-6 w-6 text-zinc-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider truncate">{cluster.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{cluster.type}</span>
                                            <span className="h-1 w-1 bg-zinc-800 rounded-full"></span>
                                            <span className="text-[10px] font-medium text-zinc-500 truncate">{cluster.host}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                            
                            <button
                                onClick={() => setIsConnectOpen(true)}
                                className="flex items-center gap-5 p-6 rounded-3xl border border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/[0.02] transition-all text-left group"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                    <Plus className="h-6 w-6 text-zinc-600 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-wider group-hover:text-white transition-colors">Add Connection</h3>
                                    <p className="text-[10px] font-medium text-zinc-600 mt-1">Connect another database</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsConnectOpen(true)}
                            className="group relative flex items-center gap-4 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-[0_0_20px_rgba(0,237,100,0.2)] hover:shadow-[0_0_30px_rgba(0,237,100,0.4)] transition-all active:scale-95 mb-10"
                        >
                            Connect Database
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}

                    <div className="flex items-center gap-8 pt-6 border-t border-white/5 w-full justify-center">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Server className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">TLS 1.3 Secure</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600">
                            <Activity className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Real-time Sync</span>
                        </div>
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                        </button>
                    </div>
                </div>

                <ConnectionDialog isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
            </div>
        );
    }

    return <>{children}</>;
}
