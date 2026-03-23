"use client";

import React, { useEffect, useState } from "react";
import { Copy, Loader2, History, AlertCircle, CheckCircle2 } from "lucide-react";
import { useClusterStore } from "@/store/useClusterStore";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface QueryLog {
    id: string;
    query: string;
    clusterId: string;
    userId: string;
    executionTimeMs: number;
    success: boolean;
    errorMessage: string | null;
    createdAt: string;
}

export default function LogsPage() {
    const { setActiveTab, selectedCluster, fetchQueryLogs } = useClusterStore();
    const { user: currentUser } = useAuthStore();
    const [logs, setLogs] = useState<QueryLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setActiveTab("logs");
        if (selectedCluster) {
            loadLogs();
        } else {
            setIsLoading(false);
        }
    }, [selectedCluster]);

    const loadLogs = async () => {
        setIsLoading(true);
        try {
            const data = await fetchQueryLogs(selectedCluster!.id);
            setLogs(data);
        } catch (error) {
            toast.error("Failed to load audit logs");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateGroup = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const groupedLogs = logs.reduce((acc, log) => {
        const group = formatDateGroup(log.createdAt);
        if (!acc[group]) acc[group] = [];
        acc[group].push(log);
        return acc;
    }, {} as Record<string, QueryLog[]>);

    if (!selectedCluster) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-zinc-600 gap-4">
                <div className="h-16 w-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <History className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Select a cluster to view logs</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col overflow-y-auto scrollbar-hide bg-[#021016]/20 h-full">
            <div className="p-4 lg:p-8 space-y-6 lg:space-y-10 max-w-5xl mx-auto w-full min-h-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Retrieving system logs...</span>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <History className="h-12 w-12 text-zinc-800" />
                        <h3 className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No Activity Yet</h3>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider max-w-xs leading-relaxed">
                            Every query you run in the SQL editor will be safely recorded here for auditing and history.
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedLogs).map(([group, dayLogs]) => (
                        <div key={group} className="space-y-4">
                            <div className="flex items-center gap-4 mb-2 px-2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    {group}
                                </span>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            <div className="divide-y divide-white/[0.02] bg-black/20 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
                                {dayLogs.map((log) => (
                                    <div key={log.id} className="group flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 py-4 px-4 lg:px-6 hover:bg-white/[0.03] transition-all duration-300">
                                        <div className="flex items-center gap-4 lg:gap-6 shrink-0 lg:min-w-[160px]">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-mono text-zinc-500 tabular-nums">
                                                    {new Date(log.createdAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${log.success ? 'bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                                    <span className={`text-[8px] font-black uppercase tracking-widest ${log.success ? 'text-primary/70' : 'text-red-500/70'}`}>
                                                        {log.success ? 'Success' : 'Error'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-8">
                                            <div className="flex flex-col min-w-0">
                                                <code className="font-mono text-[11px] text-zinc-300 truncate group-hover:text-white transition-colors block leading-relaxed">
                                                    {log.query}
                                                </code>
                                                {!log.success && log.errorMessage && (
                                                    <span className="text-[9px] text-red-500/80 mt-1 font-mono truncate max-w-lg italic">
                                                        {log.errorMessage}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                                                <div className="flex flex-col items-end gap-1 opacity-60 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest tabular-nums">
                                                        {log.executionTimeMs}ms
                                                    </span>
                                                    <span className="text-[7px] font-medium text-zinc-600 uppercase tracking-tighter">
                                                        By {currentUser?.id === log.userId ? 'You' : `User ${log.userId.substring(0, 8)}`}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(log.query);
                                                        toast.success("Query copied to clipboard");
                                                    }}
                                                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all sm:opacity-0 group-hover:opacity-100"
                                                    title="Copy SQL Query"
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
