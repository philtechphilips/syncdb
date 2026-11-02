"use client";

import React, { useEffect, useState } from "react";
import { Copy, Loader2, History } from "lucide-react";
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

  // Loading starts true; there is nothing to load without a cluster.
  useEffect(() => {
    setActiveTab("logs");
    if (!selectedCluster) return;
    let cancelled = false;
    fetchQueryLogs(selectedCluster.id)
      .then((data) => {
        if (!cancelled) setLogs(data as QueryLog[]);
      })
      .catch(() => toast.error("Failed to load audit logs"))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCluster, setActiveTab, fetchQueryLogs]);

  const formatDateGroup = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedLogs = logs.reduce(
    (acc, log) => {
      const group = formatDateGroup(log.createdAt);
      if (!acc[group]) acc[group] = [];
      acc[group].push(log);
      return acc;
    },
    {} as Record<string, QueryLog[]>,
  );

  if (!selectedCluster) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-subtle gap-4">
        <div className="h-16 w-16 rounded-full bg-ink/[0.02] border border-border flex items-center justify-center">
          <History className="h-8 w-8 opacity-20" />
        </div>
        <p className="text-[11px] opacity-40">Select a cluster to view logs</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto thin-scrollbar bg-background/20 h-full">
      <div className="px-4 py-6 sm:px-6 space-y-6 max-w-5xl w-full min-h-full">
        <div>
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-foreground">
            Query logs
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Every query run against this cluster.
          </p>
        </div>
        {isLoading && selectedCluster ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-accent-fg animate-spin" />
            <span className="text-[11px] font-medium text-subtle">
              Retrieving system logs...
            </span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <History className="h-12 w-12 text-subtle/50" />
            <h3 className="text-muted-foreground font-semibold text-sm">
              No Activity Yet
            </h3>
            <p className="text-[11px] text-subtle max-w-xs leading-relaxed">
              Every query you run in the SQL editor will be safely recorded here
              for auditing and history.
            </p>
          </div>
        ) : (
          Object.entries(groupedLogs).map(([group, dayLogs]) => (
            <div key={group} className="space-y-4">
              <div className="flex items-center gap-4 mb-2 px-2">
                <span className="text-[11px] font-medium text-subtle">
                  {group}
                </span>
                <div className="h-px flex-1 bg-ink/5"></div>
              </div>

              <div className="divide-y divide-border bg-bg-200 rounded-xl border border-border overflow-hidden">
                {dayLogs.map((log) => (
                  <div
                    key={log.id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 py-4 px-4 lg:px-6 hover:bg-ink/[0.03] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 lg:gap-6 shrink-0 lg:min-w-[160px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-mono text-subtle tabular-nums">
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${log.success ? "bg-primary" : "bg-err"}`}
                          ></div>
                          <span
                            className={`text-[11px] font-medium ${log.success ? "text-accent-fg/70" : "text-err/70"}`}
                          >
                            {log.success ? "Success" : "Error"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-8">
                      <div className="flex flex-col min-w-0">
                        <code className="font-mono text-[11px] text-foreground/80 truncate group-hover:text-foreground transition-colors block leading-relaxed">
                          {log.query}
                        </code>
                        {!log.success && log.errorMessage && (
                          <span className="text-[11px] text-err/80 mt-1 font-mono truncate max-w-lg italic">
                            {log.errorMessage}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                        <div className="flex flex-col items-end gap-1 opacity-60 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                          <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                            {log.executionTimeMs}ms
                          </span>
                          <span className="text-[11px] font-medium text-subtle">
                            By{" "}
                            {currentUser?.id === log.userId
                              ? "You"
                              : `User ${log.userId.substring(0, 8)}`}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(log.query);
                            toast.success("Query copied to clipboard");
                          }}
                          className="p-2.5 rounded-xl bg-ink/[0.02] border border-border text-subtle hover:text-foreground hover:bg-ink/[0.05] transition-all sm:opacity-0 group-hover:opacity-100"
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
