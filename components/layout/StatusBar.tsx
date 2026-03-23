"use client";

import React from "react";
import {
  Wifi,
  Clock,
  Database as DatabaseIcon,
  CheckCircle2,
  AlertCircle,
  Table,
  Loader2,
} from "lucide-react";
import { useClusterStore } from "@/store/useClusterStore";

const StatusBar = () => {
  const { selectedCluster, selectedTable, isDataLoading, error } =
    useClusterStore();
  const [ping, setPing] = React.useState(12);

  React.useEffect(() => {
    if (!selectedCluster) return;
    const interval = setInterval(() => {
      setPing((prev) => {
        const jitter = Math.floor(Math.random() * 5) - 2; // small jitter
        return Math.max(4, Math.min(28, prev + jitter));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedCluster]);

  const dbDisplay = selectedCluster
    ? `${selectedCluster.type.toUpperCase()} / ${selectedCluster.database}`
    : "Disconnected";

  return (
    <div className="hidden sm:flex h-8 w-full shrink-0 items-center justify-between border-t border-white/10 bg-[#021016] px-6 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group cursor-default">
          <DatabaseIcon
            className={`h-3.5 w-3.5 ${selectedCluster ? "text-primary" : "text-zinc-500"}`}
          />
          <span className={selectedCluster ? "text-zinc-200" : "text-zinc-500"}>
            {dbDisplay}
          </span>
        </div>

        {selectedCluster && (
          <>
            <div className="flex items-center gap-2">
              <Wifi className="h-3.5 w-3.5 text-emerald-500" />
              <span>Connected: {selectedCluster.host}</span>
            </div>
            {selectedTable && (
              <div className="flex items-center gap-2 text-primary/80">
                <Table className="h-3.5 w-3.5" />
                <span>{selectedTable}</span>
              </div>
            )}
          </>
        )}

        <div className="flex items-center gap-2 opacity-50">
          <Clock className="h-3.5 w-3.5" />
          <span>Ping: {ping}ms</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {isDataLoading ? (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-[9px]">
              Syncing...
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="font-bold uppercase tracking-widest text-[9px] line-clamp-1 max-w-[200px]">
              {error}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-bold uppercase tracking-widest text-[9px]">
              Operational
            </span>
          </div>
        )}

        <div className="h-3 w-px bg-white/10"></div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">UTF-8</span>
          <span className="opacity-50">|</span>
          <span className="font-bold text-foreground uppercase tracking-widest text-[9px]">
            {selectedCluster?.type || "SQL"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
