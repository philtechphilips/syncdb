"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import StatusBar from "@/components/layout/StatusBar";
import ConnectionDialog from "@/components/dashboard/ConnectionDialog";
import ClusterGate from "@/components/dashboard/ClusterGate";
import {
  OnboardingWizard,
  shouldShowOnboarding,
} from "@/components/dashboard/OnboardingWizard";
import { useClusterStore } from "@/store/useClusterStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    checkAuth,
  } = useAuthStore();
  const { selectedCluster, fetchClusters } = useClusterStore();
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const handshakeRan = React.useRef(false);

  // Master Handshake — runs once on mount only.
  // checkAuth silently refreshes the access token from the localStorage refresh
  // token, so this works correctly on page reload and in new tabs.
  React.useEffect(() => {
    if (handshakeRan.current) return;
    handshakeRan.current = true;

    const handshake = async () => {
      const authed = await checkAuth();
      if (!authed) {
        setIsInitialized(true);
        return;
      }
      const fetched = await fetchClusters();
      // fetchClusters re-validates the persisted selectedCluster — if it was
      // deleted it comes back null and ClusterGate will show the picker.
      if (fetched.length === 0 && shouldShowOnboarding()) {
        setShowOnboarding(true);
      }
      setIsInitialized(true);
    };
    handshake();
  }, []);

  // Protection logic
  React.useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  const prevClusterIdRef = React.useRef<string | undefined>(undefined);
  // Redirect to query when the user actively switches to a different cluster
  // while on a table-specific route so the stale table path doesn't 404.
  React.useEffect(() => {
    if (!isInitialized || !selectedCluster?.id) return;
    const prev = prevClusterIdRef.current;
    prevClusterIdRef.current = selectedCluster.id;
    if (
      prev &&
      prev !== selectedCluster.id &&
      pathname.startsWith("/dashboard/table")
    ) {
      router.push("/dashboard/query");
    }
  }, [selectedCluster?.id, isInitialized, pathname, router]);

  const {
    activeTab,
    setActiveTab,
    selectedTable,
    setSelectedTable,
    openTableTab,
  } = useClusterStore();

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
            openTableTab(name);
            setActiveTab("table");
            setIsSidebarMobileOpen(false);
            router.push("/dashboard/table");
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

        {/* First-run Onboarding Wizard */}
        {showOnboarding && (
          <OnboardingWizard onDismiss={() => setShowOnboarding(false)} />
        )}
      </div>
    </ClusterGate>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse">
            Initializing Session...
          </p>
        </div>
      }
    >
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}
