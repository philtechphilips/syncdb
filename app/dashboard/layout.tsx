"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import StatusBar from "@/components/layout/StatusBar";
import ConnectionDialog from "@/components/dashboard/ConnectionDialog";
import ClusterGate from "@/components/dashboard/ClusterGate";
import { useClusterStore } from "@/store/useClusterStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    checkAuth,
  } = useAuthStore();
  const { clusters, selectedCluster, fetchClusters, selectCluster } =
    useClusterStore();
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Master Handshake
  React.useEffect(() => {
    const handshake = async () => {
      if (!isAuthenticated) await checkAuth();
      if (clusters.length === 0) await fetchClusters();
      setIsInitialized(true);
    };
    handshake();
  }, [isAuthenticated, checkAuth, clusters.length, fetchClusters]);

  // Session Restoration (Cluster from URL)
  React.useEffect(() => {
    if (isInitialized && clusters.length > 0) {
      const clusterId = searchParams.get("cluster");
      if (clusterId && (!selectedCluster || selectedCluster.id !== clusterId)) {
        const cluster = clusters.find((c) => c.id === clusterId);
        if (cluster) selectCluster(cluster);
      }
    }
  }, [isInitialized, clusters, searchParams, selectedCluster, selectCluster]);

  // Protection logic
  React.useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  // Sync cluster back to URL if changed via UI
  React.useEffect(() => {
    if (selectedCluster?.id) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("cluster") !== selectedCluster.id) {
        params.set("cluster", selectedCluster.id);
        const url = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        window.history.replaceState(null, "", url);
      }
    }
  }, [selectedCluster?.id, pathname]);

  const { activeTab, setActiveTab, selectedTable, setSelectedTable } =
    useClusterStore();

  if (!isInitialized || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse">
          Initializing Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Mapping pathname to tab state for sidebar highlighting
  const getActiveTab = () => {
    if (pathname.includes("/dashboard/query")) return "query";
    if (pathname.includes("/dashboard/er")) return "er";
    if (pathname.includes("/dashboard/table")) return "table";
    if (pathname.includes("/dashboard/logs")) return "logs";
    if (pathname.includes("/dashboard/sync")) return "sync";
    if (pathname.includes("/dashboard/backup")) return "backup";
    return activeTab;
  };

  return (
    <ClusterGate>
      <div className="flex min-h-screen max-w-full bg-background text-foreground animate-in fade-in duration-700 font-sans overflow-x-hidden">
        {/* Sidebar navigation */}
        <Sidebar
          onOpenConnect={() => setIsConnectOpen(true)}
          activeTab={
            getActiveTab() as
              | "query"
              | "er"
              | "table"
              | "logs"
              | "sync"
              | "backup"
          }
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsSidebarMobileOpen(false);
            router.push(`/dashboard/${tab}`);
          }}
          onTableSelect={(name) => {
            setSelectedTable(name);
            //    setActiveTab("table");
            setIsSidebarMobileOpen(false);
            router.push(`/dashboard/table/${name}`);
          }}
          selectedTable={selectedTable}
          isMobileOpen={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
        />

        {isSidebarMobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden h-full w-full"
            onClick={() => setIsSidebarMobileOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex h-screen flex-1 flex-col lg:pl-64 min-w-0 max-w-full relative overflow-hidden">
          {/* Top Navbar */}
          <Navbar
            onOpenConnect={() => setIsConnectOpen(true)}
            onOpenSidebar={() => setIsSidebarMobileOpen(true)}
          />

          {/* Workspace */}
          <main className="flex flex-1 flex-col pt-14 pb-0 bg-background transition-all overflow-hidden">
            {children}
          </main>

          {/* Bottom Status Bar */}
          <StatusBar />
        </div>

        {/* Connection Dialog Modal */}
        <ConnectionDialog
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
        />
      </div>
    </ClusterGate>
  );
}
