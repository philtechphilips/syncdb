"use client";

import React from "react";
import {
  Table,
  Settings,
  Plus,
  ChevronRight,
  ChevronDown,
  Terminal,
  History,
  LayoutGrid,
  PowerOff,
  X,
  Zap,
  Trash2,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";

interface SidebarProps {
  onOpenConnect: () => void;
  activeTab: "query" | "er" | "table" | "logs" | "sync" | "backup";
  onTabChange: (tab: "query" | "er" | "logs" | "sync" | "backup") => void;
  onTableSelect: (tableName: string) => void;
  selectedTable: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useClusterStore } from "@/store/useClusterStore";
import { useModalStore } from "@/store/useModalStore";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { Skeleton } from "@/components/ui/Skeleton";

const Sidebar = ({
  onOpenConnect,
  activeTab,
  onTabChange,
  onTableSelect,
  selectedTable,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const {
    clusters,
    selectedCluster,
    selectCluster,
    tables,
    fetchTables,
    dropTable,
    deleteCluster,
    isTablesLoading,
    searchQuery,
  } = useClusterStore();
  const { open: openModal } = useModalStore();
  const [isTablesExpanded, setIsTablesExpanded] = React.useState(true);
  const [isConnectionDropdownOpen, setIsConnectionDropdownOpen] =
    React.useState(false);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    table: string | null;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = React.useState<
    string | null
  >(null);

  const handleDisconnectCluster = async (
    e: React.MouseEvent,
    clusterId: string,
  ) => {
    e.stopPropagation();
    if (confirmDisconnect === clusterId) {
      try {
        await deleteCluster(clusterId);
        setConfirmDisconnect(null);
      } catch (error) {
        console.error("Failed to disconnect cluster:", error);
      }
    } else {
      setConfirmDisconnect(clusterId);
      // Auto reset after 3 seconds
      setTimeout(() => setConfirmDisconnect(null), 3000);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, tableName: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, table: tableName });
  };

  const handleDropTable = async (tableName: string) => {
    if (!selectedCluster) return;

    openModal({
      title: "Drop Table",
      message: `Are you sure you want to PERMANENTLY delete table "${tableName}"? This action cannot be undone and all data will be lost.`,
      type: "danger",
      confirmLabel: "Drop Table",
      confirmValue: tableName,
      onConfirm: async () => {
        try {
          await dropTable(selectedCluster.id, tableName);
          toast.success("Table Dropped", {
            description: `${tableName} was successfully deleted.`,
          });
        } catch {
          toast.error("Failed to delete table");
        }
      },
    });
  };

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Clusters are now managed by the DashboardLayout master handshake

  React.useEffect(() => {
    if (selectedCluster) {
      fetchTables(selectedCluster.id);
    }
  }, [selectedCluster, fetchTables]);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-background flex flex-col font-sans transition-transform duration-300 transform lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo Area & Mobile Close */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center overflow-hidden text-primary">
            <SynqLogo className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-foreground tracking-tight">
              SynqDB
            </span>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80 leading-tight">
              Professional
            </span>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Workspace Switcher */}
      <div className="p-4 pt-0 border-b border-border relative">
        <div
          onClick={() => setIsConnectionDropdownOpen(!isConnectionDropdownOpen)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
        >
          <div
            className="h-8 w-8 rounded bg-muted border border-border flex items-center justify-center text-white font-black text-xs transition-transform group-hover:scale-105"
            style={{
              borderLeft: `3px solid ${selectedCluster?.color || "#0dd"}`,
            }}
          >
            {selectedCluster?.name?.[0].toUpperCase() || "C"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground truncate w-24">
              {selectedCluster?.name || "Select Cluster"}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter truncate w-24">
              {selectedCluster?.type || "None"}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 ml-auto text-muted-foreground transition-transform duration-200 ${isConnectionDropdownOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Connection Dropdown */}
        {isConnectionDropdownOpen && (
          <div className="absolute left-4 top-[calc(100%-8px)] z-50 w-[calc(100%-32px)] bg-card border border-border rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 mb-1.5 border-b border-border">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Switch Connection
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto scrollbar-hide">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="flex w-full items-center gap-3 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5"
                >
                  <div
                    onClick={() => {
                      selectCluster(cluster);
                      setIsConnectionDropdownOpen(false);
                    }}
                    className={`flex-1 flex items-center gap-3 transition-colors cursor-pointer ${selectedCluster?.id === cluster.id ? "text-white" : "text-muted-foreground/80"}`}
                  >
                    <div
                      className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-black ${selectedCluster?.id === cluster.id ? "bg-white/10 text-white" : "bg-zinc-800 text-muted-foreground"}`}
                      style={{
                        borderLeft: `2px solid ${cluster.color || "#444"}`,
                      }}
                    >
                      {cluster.name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start translate-y-[-1px]">
                      <span>{cluster.name}</span>
                      <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">
                        {cluster.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCluster?.id === cluster.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDisconnectCluster(e, cluster.id)}
                      className={`p-1.5 rounded-lg transition-all border ${
                        confirmDisconnect === cluster.id
                          ? "bg-red-500/20 text-red-500 border-red-500/30"
                          : "bg-white/5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 border-transparent"
                      }`}
                      title={
                        confirmDisconnect === cluster.id
                          ? "Click again to confirm"
                          : "Disconnect Cluster"
                      }
                    >
                      {confirmDisconnect === cluster.id ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <PowerOff className="h-2.5 w-2.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10 my-2"></div>
            <button
              onClick={() => {
                onOpenConnect();
                setIsConnectionDropdownOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-[11px] font-black text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Connection</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide space-y-8">
        {/* Main Navigation */}
        <div>
          <nav className="space-y-1">
            <button
              onClick={() => onTabChange("query")}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "query" ? "bg-primary/10 text-white" : "text-muted-foreground hover:bg-muted/50 hover:text-white"}`}
            >
              <Terminal className="h-4 w-4" />
              SQL Editor
            </button>
            <button
              onClick={() => onTabChange("er")}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "er" ? "bg-primary/10 text-white" : "text-muted-foreground hover:bg-muted/50 hover:text-white"}`}
            >
              <LayoutGrid className="h-4 w-4" />
              ER Diagrams
            </button>
            <button
              onClick={() => onTabChange("sync")}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "sync" ? "bg-primary/10 text-white" : "text-muted-foreground hover:bg-muted/50 hover:text-white"}`}
            >
              <Zap className="h-4 w-4" />
              Database Sync
            </button>
            <button
              onClick={() => onTabChange("backup")}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "backup" ? "bg-primary/10 text-white" : "text-muted-foreground hover:bg-muted/50 hover:text-white"}`}
            >
              <HardDrive className="h-4 w-4" />
              Backup & Restore
            </button>
          </nav>
        </div>

        {/* Database Explorer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Database
            </span>
            <button
              onClick={onOpenConnect}
              className="text-primary hover:text-primary/110 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            <div
              onClick={() => setIsTablesExpanded(!isTablesExpanded)}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors group"
            >
              {isTablesExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
              )}
              <Table className="h-4 w-4 text-primary/80" />
              <span>Tables</span>
              <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                {
                  tables.filter((t) =>
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()),
                  ).length
                }
              </span>
            </div>

            {/* Expanded Tables List */}
            {isTablesExpanded && (
              <div className="mt-1 flex flex-col animate-in fade-in slide-in-from-top-1 duration-200">
                {isTablesLoading && tables.length === 0
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 ml-6 mr-1 px-3 py-2"
                      >
                        <Skeleton className="h-1 w-1 rounded-full shrink-0" />
                        <Skeleton
                          className="h-2 rounded-sm"
                          style={{
                            width: `${Math.floor(Math.random() * (70 - 40 + 1) + 40)}%`,
                          }}
                        />
                      </div>
                    ))
                  : tables
                      .filter((t) =>
                        t.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .map((table: { name: string }) => (
                      <div
                        key={table.name}
                        onClick={() => onTableSelect(table.name)}
                        onContextMenu={(e) => handleContextMenu(e, table.name)}
                        className={`flex items-center gap-3 ml-6 mr-1 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer group/item hover:bg-white/[0.05] ${selectedTable === table.name ? "text-white bg-primary/10" : "text-muted-foreground/80 hover:text-white"}`}
                      >
                        <div
                          className={`h-1 w-1 rounded-full ${selectedTable === table.name ? "bg-primary" : "bg-zinc-700"}`}
                        ></div>
                        <span className="truncate flex-1">{table.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropTable(table.name);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-500 rounded transition-all"
                          title="Drop Table"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
              </div>
            )}
          </div>
        </div>

        {/* Management */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Management
            </span>
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => router.push("/dashboard/settings/project")}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${pathname === "/dashboard/settings/project" ? "bg-primary/10 text-white" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
            >
              <Settings className="h-4 w-4" />
              Project Settings
            </button>
            <button
              onClick={() => onTabChange("logs")}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "logs" ? "bg-primary/10 text-white" : "text-muted-foreground hover:bg-muted/50 hover:text-white"}`}
            >
              <History className="h-4 w-4" />
              Query Logs
            </button>
          </nav>
        </div>
      </div>

      {/* User Footer with Logout */}
      <div className="p-4 border-t border-border mt-auto bg-muted/20 relative">
        <div
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-full bg-zinc-800 border border-border flex items-center justify-center overflow-hidden shrink-0">
            {user?.profile_picture &&
            (user.profile_picture.startsWith("http") ||
              user.profile_picture.startsWith("/")) ? (
              <img
                src={user.profile_picture}
                alt={user.full_name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-primary/40 to-secondary/40 flex items-center justify-center text-[10px] font-black">
                {user?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "??"}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-foreground truncate">
              {user?.full_name || "Anonymous User"}
            </span>
            <span className="text-[9px] text-muted-foreground/80 font-black uppercase tracking-tighter truncate">
              {user?.role || "User"}
            </span>
          </div>
        </div>

        {isUserMenuOpen && (
          <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 z-50 bg-card border border-border rounded-xl shadow-2xl py-2 animate-in slide-in-from-bottom-2 duration-200">
            <div className="px-3 py-1.5 border-b border-border mb-2">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Account Settings
              </span>
            </div>
            <button
              onClick={() => {
                router.push("/dashboard/settings");
                setIsUserMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-xs font-bold text-muted-foreground/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Profile
            </button>
            <div className="h-px bg-white/5 my-2"></div>
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <History className="h-3.5 w-3.5 rotate-180" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-[100] w-48 bg-card border border-border rounded-xl shadow-2xl py-1.5 shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="px-3 py-1.5 border-b border-border mb-1.5">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
              {contextMenu.table}
            </span>
          </div>

          {[
            {
              label: "View Data",
              color: "text-primary",
              onClick: () => onTableSelect(contextMenu.table!),
            },
            {
              label: "View Structure",
              color: "text-muted-foreground/80",
              onClick: () => {
                onTableSelect(contextMenu.table!);
                onTabChange("query");
              },
            },
            { label: "Export Schema", color: "text-muted-foreground/80" },
            { separator: true },
            { label: "Truncate Table", color: "text-amber-500" },
            {
              label: "Drop Table",
              color: "text-red-500",
              onClick: () => handleDropTable(contextMenu.table!),
            },
          ].map((item, i) =>
            item.separator ? (
              <div key={i} className="h-px bg-white/5 my-1.5"></div>
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setContextMenu(null);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-[11px] font-bold transition-colors group ${item.color || "text-muted-foreground/80"} hover:text-white hover:bg-white/5`}
              >
                <span>{item.label}</span>
              </button>
            ),
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
