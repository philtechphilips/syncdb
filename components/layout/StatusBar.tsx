"use client";

import React from "react";
import {
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
  const dbDisplay = selectedCluster
    ? `${selectedCluster.type} / ${selectedCluster.name}`
    : "Disconnected";

  return (
    <div className="hidden sm:flex h-8 w-full shrink-0 items-center justify-between border-t border-border bg-bg-200 px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group cursor-default">
          <DatabaseIcon className="h-3.5 w-3.5 text-subtle" />
          <span className={selectedCluster ? "text-foreground" : "text-subtle"}>
            {dbDisplay}
          </span>
        </div>

        {selectedCluster && (
          <>
            {selectedTable && (
              <div className="flex items-center gap-2">
                <Table className="h-3.5 w-3.5" />
                <span>{selectedTable}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
        {isDataLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Loading…</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-err">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="line-clamp-1 max-w-[200px]">{error}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-ok" />
            <span>Ready</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
