"use client";

import React, { useEffect } from "react";
import { Copy } from "lucide-react";
import { useClusterStore } from "@/store/useClusterStore";

export default function LogsPage() {
    const { setActiveTab } = useClusterStore();

    useEffect(() => {
        setActiveTab("logs");
    }, []);

    const mockLogs = [
        { id: 1, date: "Today", query: "SELECT * FROM users LIMIT 10;", status: "Success", duration: "12ms", user: "admin", timestamp: "10:45:01" },
        { id: 2, date: "Today", query: "UPDATE orders SET status = 'Shipped' WHERE id = 45;", status: "Success", duration: "45ms", user: "admin", timestamp: "10:48:12" },
        { id: 3, date: "Yesterday", query: "DELETE FROM logs WHERE created_at < '2023-01-01';", status: "Error", duration: "1.2s", user: "system", timestamp: "23:10:00" },
        { id: 4, date: "Yesterday", query: "SELECT COUNT(*) FROM products;", status: "Success", duration: "5ms", user: "viewer_1", timestamp: "15:05:45" },
        { id: 5, date: "Feb 24, 2026", query: "INSERT INTO analytics (event) VALUES ('page_load');", status: "Success", duration: "8ms", user: "admin", timestamp: "09:12:22" },
        { id: 6, date: "Feb 24, 2026", query: "CREATE TABLE temp_cache (id SERIAL, data JSONB);", status: "Success", duration: "120ms", user: "system", timestamp: "08:00:15" },
    ];

    const groupedLogs = mockLogs.reduce((acc, log) => {
        if (!acc[log.date]) acc[log.date] = [];
        acc[log.date].push(log);
        return acc;
    }, {} as Record<string, typeof mockLogs>);

    return (
        <div className="flex flex-1 flex-col overflow-y-auto scrollbar-hide bg-[#021016]/20 h-full">
            <div className="p-8 space-y-10 max-w-5xl mx-auto w-full">
                {Object.entries(groupedLogs).map(([date, logs]) => (
                    <div key={date} className="space-y-3">
                        <div className="flex items-center gap-4 mb-1 px-2">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{date}</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>

                        <div className="divide-y divide-white/[0.03] bg-white/[0.01] rounded-xl border border-white/5 overflow-hidden">
                            {logs.map((log) => (
                                <div key={log.id} className="group flex items-center gap-6 py-3 px-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4 shrink-0 min-w-[140px]">
                                        <div className={`h-1.5 w-1.5 rounded-full ${log.status === 'Success' ? 'bg-primary' : 'bg-red-500'}`}></div>
                                        <span className="text-[9px] font-mono text-zinc-400 w-14">{log.timestamp}</span>
                                        <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${log.status === 'Success' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-red-500/5 text-red-400 border-red-500/20'}`}>
                                            {log.status}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 flex items-center justify-between">
                                        <code className="font-mono text-[11px] text-zinc-300 truncate group-hover:text-white transition-colors">
                                            {log.query}
                                        </code>
                                        <div className="flex items-center gap-6 pr-2 ml-4">
                                            <div className="flex items-center gap-4 text-[8px] font-black text-zinc-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                <span>@{log.user}</span>
                                                <span className="h-1 w-1 bg-zinc-700 rounded-full"></span>
                                                <span>{log.duration}</span>
                                            </div>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(log.query)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-primary transition-all shrink-0"
                                                title="Copy Query"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
