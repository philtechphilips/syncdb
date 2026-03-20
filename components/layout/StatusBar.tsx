"use client";

import React from "react";
import {
    Wifi,
    Clock,
    Database as DatabaseIcon,
    CheckCircle2,
    AlertCircle,
    Activity
} from "lucide-react";

const StatusBar = () => {
    return (
        <div className="fixed bottom-0 right-0 z-30 flex h-8 w-[calc(100%-16rem)] items-center justify-between border-t border-white/5 bg-[#021016] px-6 text-[11px] font-medium text-zinc-400 backdrop-blur-md">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <DatabaseIcon className="h-3.5 w-3.5 text-zinc-400" />
                    <span>PostgreSQL 14.2</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Latency: 42ms</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Load: 0.2%</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Query executed successfully</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">UTF-8</span>
                    <span className="opacity-50">|</span>
                    <span className="font-bold text-foreground">SQL</span>
                </div>
                <div className="flex items-center gap-1">
                    <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Stable</span>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
