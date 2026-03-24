"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useClusterStore } from "@/store/useClusterStore";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { activeTab, selectedTable } = useClusterStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to the appropriate subroute
      const tabFromUrl = searchParams.get("tab") || activeTab || "query";
      const tableFromUrl = searchParams.get("table") || selectedTable;

      if (tabFromUrl === "table" && tableFromUrl) {
        router.replace(`/dashboard/table/${tableFromUrl}`);
      } else {
        router.replace(`/dashboard/${tabFromUrl}`);
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    searchParams,
    activeTab,
    selectedTable,
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 animate-pulse">
        Redirecting to workspace...
      </p>
    </div>
  );
}
