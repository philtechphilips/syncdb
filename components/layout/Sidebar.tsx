"use client";

import React from "react";
import {
  Table,
  Settings,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
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
  activeTab: "query" | "er" | "table" | "logs" | "sync" | "backup" | "settings";
  onTabChange: (tab: "query" | "er" | "logs" | "sync" | "backup") => void;
  onTableSelect: (tableName: string) => void;
  selectedTable: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useClusterStore, Cluster } from "@/store/useClusterStore";
import { useModalStore } from "@/store/useModalStore";
import { SynqLogo } from "@/components/ui/SynqLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
  const { user, logout, fetchAgentStatus } = useAuthStore();
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
  const [agentConnected, setAgentConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    const hasLocalClusters = clusters.some((c) => c.isLocal);
    if (!hasLocalClusters) return;

    const poll = async () => {
      try {
        const status = await fetchAgentStatus();
        setAgentConnected(status.connected);
      } catch {
        setAgentConnected(false);
      }
    };

    poll();
    const interval = setInterval(poll, 15_000);
    return () => clearInterval(interval);
  }, [clusters, fetchAgentStatus]);
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
      className={`fixed left-0 top-0 z-50 h-screen w-[220px] bg-chrome flex flex-col font-sans transition-transform duration-300 transform lg:translate-x-0 ${isMobileOpen ? "translate-x-0 border-r border-border" : "-translate-x-full"}`}
    >
      {/* Logo Area & Mobile Close */}
      <div className="flex items-center justify-between px-4 pt-5 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center overflow-hidden text-primary">
            <SynqLogo className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground tracking-tight">
              SynqDB
            </span>
            <span className="text-[11px] text-accent-fg leading-tight">
              Professional
            </span>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="lg:hidden inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/[0.06] hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Workspace Switcher */}
      <div className="px-2 pb-3 relative">
        <div
          onClick={() => setIsConnectionDropdownOpen(!isConnectionDropdownOpen)}
          className="flex items-center gap-2.5 rounded-xl border border-border bg-panel p-2 transition-colors cursor-pointer hover:border-line-strong"
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-medium text-white"
            style={{
              backgroundColor: selectedCluster?.color || "var(--color-subtle)",
            }}
          >
            {selectedCluster?.name?.[0].toUpperCase() || "C"}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] leading-tight text-foreground">
              {selectedCluster?.name || "Select cluster"}
            </span>
            <span className="truncate text-[11px] leading-tight text-subtle">
              {selectedCluster?.type || "None"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 text-subtle" />
        </div>

        {/* Connection Dropdown */}
        {isConnectionDropdownOpen && (
          <div className="absolute left-2 top-[calc(100%-8px)] z-50 w-[calc(100%-16px)] min-w-[240px] rounded-xl border border-line-strong bg-card p-1.5 shadow-[0_16px_48px_rgb(0_0_0/0.08)]">
            <div className="px-2.5 py-1.5">
              <span className="text-xs text-subtle">Switch connection</span>
            </div>
            <div className="max-h-60 overflow-y-auto thin-scrollbar">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors hover:bg-ink/[0.04]"
                >
                  <div
                    onClick={() => {
                      selectCluster(cluster);
                      setIsConnectionDropdownOpen(false);
                    }}
                    className={`flex-1 flex items-center gap-3 transition-colors cursor-pointer ${selectedCluster?.id === cluster.id ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-medium text-white"
                      style={{
                        backgroundColor: cluster.color || "var(--color-subtle)",
                      }}
                    >
                      {cluster.name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start -translate-y-px">
                      <span>{cluster.name}</span>
                      <span className="text-[11px] leading-tight text-subtle">
                        {cluster.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cluster.isLocal && (
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${agentConnected ? "bg-ok" : "bg-ink/20"}`}
                        title={
                          agentConnected ? "Agent connected" : "Agent offline"
                        }
                      />
                    )}
                    {selectedCluster?.id === cluster.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-accent-fg"></div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDisconnectCluster(e, cluster.id)}
                      className={`p-1.5 rounded-lg transition-all border ${
                        confirmDisconnect === cluster.id
                          ? "bg-err/20 text-err border-err/30"
                          : "text-subtle hover:text-err hover:bg-err/10 border-transparent"
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
            <div className="h-px bg-border my-1.5"></div>
            <button
              onClick={() => {
                onOpenConnect();
                setIsConnectionDropdownOpen(false);
              }}
              className="flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] text-accent-fg hover:bg-primary/[0.06] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add connection</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pt-1 pb-4 thin-scrollbar space-y-5">
        {/* Main Navigation */}
        <div>
          <nav className="flex flex-col gap-0.5">
            <button
              onClick={() => onTabChange("query")}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] transition-colors ${activeTab === "query" ? "bg-primary/10 text-accent-fg font-medium" : "text-muted-foreground hover:bg-ink/[0.04] hover:text-foreground"}`}
            >
              <Terminal className="h-4 w-4" />
              SQL Editor
            </button>
            <button
              onClick={() => onTabChange("er")}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] transition-colors ${activeTab === "er" ? "bg-primary/10 text-accent-fg font-medium" : "text-muted-foreground hover:bg-ink/[0.04] hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
              ER Diagrams
            </button>
            <button
              onClick={() => onTabChange("sync")}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] transition-colors ${activeTab === "sync" ? "bg-primary/10 text-accent-fg font-medium" : "text-muted-foreground hover:bg-ink/[0.04] hover:text-foreground"}`}
            >
              <Zap className="h-4 w-4" />
              Database Sync
            </button>
            <button
              onClick={() => onTabChange("backup")}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] transition-colors ${activeTab === "backup" ? "bg-primary/10 text-accent-fg font-medium" : "text-muted-foreground hover:bg-ink/[0.04] hover:text-foreground"}`}
            >
              <HardDrive className="h-4 w-4" />
              Backup & Restore
            </button>
          </nav>
        </div>

        {/* Database Explorer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-subtle">Database</span>
            <button
              onClick={onOpenConnect}
              aria-label="Add connection"
              className="text-accent-fg hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            <div
              onClick={() => setIsTablesExpanded(!isTablesExpanded)}
              className="flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] text-foreground hover:bg-ink/[0.04] cursor-pointer transition-colors"
            >
              {isTablesExpanded ? (
                <ChevronDown className="h-3 w-3 text-subtle group-hover:text-accent-fg" />
              ) : (
                <ChevronRight className="h-3 w-3 text-subtle group-hover:text-accent-fg" />
              )}
              <Table className="h-4 w-4 text-accent-fg/80" />
              <span>Tables</span>
              <span className="ml-auto font-mono text-[11px] text-subtle">
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
                        className="flex items-center gap-3 ml-4 px-3 py-2"
                      >
                        <Skeleton className="h-1 w-1 rounded-full shrink-0" />
                        <Skeleton
                          className="h-2 rounded-sm"
                          style={{
                            width: `${40 + ((i * 37) % 31)}%`,
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
                          onContextMenu={(e) =>
                            handleContextMenu(e, table.name)
                          }
                          className={`flex h-7 items-center gap-2 ml-4 pl-3 pr-1 rounded-md font-mono text-xs transition-colors cursor-pointer group/item ${selectedTable === table.name ? "text-accent-fg bg-primary/10" : "text-muted-foreground hover:bg-ink/[0.04] hover:text-foreground"}`}
                        >
                          <span className="truncate flex-1">{table.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDropTable(table.name);
                            }}
                            className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-err/10 hover:text-err rounded transition-all"
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
            <span className="text-xs text-subtle">Management</span>
          </div>
          <nav className="flex flex-col gap-0.5">
            <button
              onClick={() => router.push("/dashboard/settings/project")}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] transition-colors ${pathname === "/dashboard/settings/project" ? "bg-primary/10 text-accent-fg font-medium" : "text-muted-foreground hover:bg-ink/[0.04] hover:text-foreground"}`}
            >
              <Settings className="h-4 w-4" />
              Project Settings
            </button>
            <button
              onClick={() => onTabChange("logs")}
              className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] transition-colors ${activeTab === "logs" ? "bg-primary/10 text-accent-fg font-medium" : "text-muted-foreground hover:bg-ink/[0.04] hover:text-foreground"}`}
            >
              <History className="h-4 w-4" />
              Query Logs
            </button>
          </nav>
        </div>
      </div>

      {/* User Footer with Logout */}
      <div className="mt-auto px-2 pb-3 pt-2 relative">
        <div
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-ink/[0.04] transition-colors cursor-pointer"
        >
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {user?.profile_picture &&
            (user.profile_picture.startsWith("http") ||
              user.profile_picture.startsWith("/")) ? (
              <img
                src={user.profile_picture}
                alt={user.full_name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-primary/10 text-accent-fg flex items-center justify-center text-[11px] font-medium">
                {user?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "??"}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-foreground truncate">
              {user?.full_name || "Anonymous User"}
            </span>
            <span className="text-[11px] text-muted-foreground/80 font-medium truncate">
              {user?.role || "User"}
            </span>
          </div>
        </div>

        {isUserMenuOpen && (
          <div className="absolute bottom-[calc(100%-4px)] left-2 right-2 z-50 rounded-xl border border-line-strong bg-card p-1.5 shadow-[0_16px_48px_rgb(0_0_0/0.08)]">
            <div className="flex items-center justify-between px-2.5 py-1.5">
              <span className="text-xs text-subtle">Theme</span>
              <ThemeToggle />
            </div>
            <div className="h-px bg-border my-1.5"></div>
            <button
              onClick={() => {
                router.push("/dashboard/settings");
                setIsUserMenuOpen(false);
              }}
              className="flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-ink/[0.04] transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Profile
            </button>
            <div className="h-px bg-border my-1.5"></div>
            <button
              onClick={() => logout()}
              className="flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] text-err hover:bg-err/[0.06] transition-colors"
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
          className="fixed z-100 w-48 overflow-hidden rounded-xl border border-line-strong bg-card p-1.5 shadow-[0_16px_48px_rgb(0_0_0/0.08)]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="px-2.5 py-1.5">
            <span className="truncate font-mono text-xs text-subtle">
              {contextMenu.table}
            </span>
          </div>

          {[
            {
              label: "View Data",
              color: "text-accent-fg",
              onClick: () => onTableSelect(contextMenu.table!),
            },
            {
              label: "View Structure",
              color: "text-muted-foreground",
              onClick: () => {
                onTableSelect(contextMenu.table!);
                onTabChange("query");
              },
            },
            { label: "Export Schema", color: "text-muted-foreground" },
            { separator: true },
            { label: "Truncate Table", color: "text-warn" },
            {
              label: "Drop Table",
              color: "text-err",
              onClick: () => handleDropTable(contextMenu.table!),
            },
          ].map((item, i) =>
            item.separator ? (
              <div key={i} className="h-px bg-border my-1.5"></div>
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setContextMenu(null);
                }}
                className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors ${item.color || "text-muted-foreground"} hover:bg-ink/[0.04]`}
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
