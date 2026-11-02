"use client";

import React, { useState } from "react";
import {
  Database,
  Plus,
  ChevronRight,
  ArrowRight,
  LogOut,
  Pencil,
} from "lucide-react";
import { useClusterStore, Cluster } from "@/store/useClusterStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Logotype } from "@/components/ui/SynqLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import ConnectionDialog from "./ConnectionDialog";

export default function ClusterGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clusters, selectedCluster, selectCluster, isLoading } =
    useClusterStore();
  const { logout } = useAuthStore();
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);

  // Loading state for initial fetch
  if (isLoading && clusters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
        <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
          <div className="mb-12 flex flex-col items-center">
            <Skeleton className="h-20 w-20 rounded-xl mb-8" />
            <Skeleton className="h-4 w-48 mb-3" />
            <Skeleton className="h-3 w-64 opacity-60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-5 p-6 rounded-xl bg-ink/[0.02] border border-border"
              >
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4 rounded-sm" />
                  <Skeleton className="h-2 w-1/2 rounded-sm opacity-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no cluster is selected, show the selector screen
  if (!selectedCluster) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>

        <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
          <div className="text-center mb-12 flex flex-col items-center">
            <Logotype className="mb-8 text-[22px]" />
            <h1 className="text-3xl text-foreground mb-3 tracking-tight font-semibold">
              {clusters.length === 0
                ? "Establish your first connection"
                : "Select an active cluster"}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {clusters.length === 0
                ? "Before exploring the dashboard, you need to connect to a PostgreSQL or MySQL database."
                : "Choose a database cluster from your repository to start managing your data."}
            </p>
          </div>

          {clusters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
              {clusters.map((cluster) => (
                <div key={cluster.id} className="relative group/card">
                  <button
                    onClick={() => selectCluster(cluster)}
                    className="group w-full relative flex items-center gap-5 p-6 rounded-xl bg-ink/[0.02] border border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all text-left"
                  >
                    <div className="h-12 w-12 rounded-xl bg-ink/5 border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shrink-0">
                      <Database className="h-6 w-6 text-muted-foreground group-hover:text-accent-fg transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {cluster.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] font-medium text-subtle">
                          {cluster.type}
                        </span>
                        {cluster.isLocal && (
                          <>
                            <span className="h-1 w-1 bg-muted rounded-full"></span>
                            <span className="text-[11px] font-medium text-accent-fg/60">
                              Local
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-subtle/70 group-hover:text-accent-fg group-hover:translate-x-1 transition-all" />
                  </button>
                  {/* Edit button — appears on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCluster(cluster);
                    }}
                    className="absolute top-3 right-10 h-7 w-7 rounded-lg flex items-center justify-center text-subtle/70 hover:text-foreground hover:bg-ink/8 transition-all opacity-0 group-hover/card:opacity-100"
                    title="Edit connection"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setIsConnectOpen(true)}
                className="flex items-center gap-5 p-6 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-primary/[0.02] transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-xl bg-ink/5 border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <Plus className="h-6 w-6 text-subtle group-hover:text-accent-fg transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    Add Connection
                  </h3>
                  <p className="text-[11px] text-subtle mt-1">
                    Connect another database
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsConnectOpen(true)}
              className="group relative flex items-center gap-4 px-10 py-2 rounded-md bg-primary text-white font-medium text-sm transition-all mb-10"
            >
              Connect Database
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <div className="flex items-center gap-8 pt-6 border-t border-border w-full justify-center">
            <button
              onClick={logout}
              className="flex items-center gap-2 text-subtle hover:text-err transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-[11px] font-medium">Logout</span>
            </button>
          </div>
        </div>

        <ConnectionDialog
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
        />
        <ConnectionDialog
          key={editingCluster?.id}
          isOpen={!!editingCluster}
          onClose={() => setEditingCluster(null)}
          editCluster={editingCluster ?? undefined}
        />
      </div>
    );
  }

  return <>{children}</>;
}
