"use client";

import React from "react";
import Link from "next/link";
import {
    Database,
    Table,
    Search,
    Settings,
    Plus,
    ChevronRight,
    ChevronDown,
    Terminal,
    History,
    LayoutGrid,
    Layout
} from "lucide-react";

interface SidebarProps {
    onOpenConnect: () => void;
    activeTab: "query" | "er" | "table" | "logs";
    onTabChange: (tab: "query" | "er" | "logs") => void;
    onTableSelect: (tableName: string) => void;
    selectedTable: string;
}

import { useAuthStore } from "@/store/useAuthStore";
import { useClusterStore } from "@/store/useClusterStore";
import { SynqLogo } from "@/components/ui/SynqLogo";

const Sidebar = ({
    onOpenConnect,
    activeTab,
    onTabChange,
    onTableSelect,
    selectedTable
}: SidebarProps) => {
    const { user, logout } = useAuthStore();
    const { clusters, selectedCluster, selectCluster, fetchClusters, tables, fetchTables } = useClusterStore();
    const [isTablesExpanded, setIsTablesExpanded] = React.useState(true);
    const [isConnectionDropdownOpen, setIsConnectionDropdownOpen] = React.useState(false);
    const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number, table: string | null } | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

    const handleContextMenu = (e: React.MouseEvent, tableName: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, table: tableName });
    };

    React.useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    React.useEffect(() => {
        if (clusters.length === 0) {
            fetchClusters();
        }
    }, [clusters.length, fetchClusters]);

    React.useEffect(() => {
        if (selectedCluster) {
            fetchTables(selectedCluster.id);
        }
    }, [selectedCluster?.id, fetchTables]);

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background flex flex-col font-sans">
            {/* Logo Area */}
            <div className="px-6 py-6 flex items-center gap-3">
                <div className="h-9 w-9 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center overflow-hidden text-primary">
                    <SynqLogo className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black text-foreground tracking-tight">SynqDB</span>
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80 leading-tight">Professional</span>
                </div>
            </div>

            {/* Workspace Switcher */}
            <div className="p-4 pt-0 border-b border-border relative">
                <div
                    onClick={() => setIsConnectionDropdownOpen(!isConnectionDropdownOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                    <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-black text-xs shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        {selectedCluster?.name?.[0].toUpperCase() || "C"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground truncate w-24">{selectedCluster?.name || "Select Cluster"}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter truncate w-24">
                            {selectedCluster?.type || "None"}
                        </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 ml-auto text-muted-foreground transition-transform duration-200 ${isConnectionDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Connection Dropdown */}
                {isConnectionDropdownOpen && (
                    <div className="absolute left-4 top-[calc(100%-8px)] z-50 w-[calc(100%-32px)] bg-zinc-900 border border-white/5 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1.5 mb-1.5 border-b border-white/5">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Switch Connection</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto scrollbar-hide">
                            {clusters.map((cluster) => (
                                <button
                                    key={cluster.id}
                                    onClick={() => {
                                        selectCluster(cluster);
                                        setIsConnectionDropdownOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5 ${selectedCluster?.id === cluster.id ? 'text-primary' : 'text-zinc-400'}`}
                                >
                                    <div className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-black ${selectedCluster?.id === cluster.id ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {cluster.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-start translate-y-[-1px]">
                                        <span>{cluster.name}</span>
                                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">{cluster.type}</span>
                                    </div>
                                    {selectedCluster?.id === cluster.id && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="h-px bg-white/5 my-2"></div>
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
                            className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "query" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                        >
                            <Terminal className="h-4 w-4" />
                            SQL Editor
                        </button>
                        <button
                            onClick={() => onTabChange("er")}
                            className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "er" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                            ER Diagrams
                        </button>
                    </nav>
                </div>

                {/* Database Explorer */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-3">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Database</span>
                        <button onClick={onOpenConnect} className="text-primary hover:text-primary/110 transition-colors">
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
                            <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">{tables.length}</span>
                        </div>

                        {/* Expanded Tables List */}
                        {isTablesExpanded && (
                            <div className="mt-1 flex flex-col animate-in fade-in slide-in-from-top-1 duration-200">
                                {tables.map((table: any) => (
                                    <div
                                        key={table.name}
                                        onClick={() => onTableSelect(table.name)}
                                        onContextMenu={(e) => handleContextMenu(e, table.name)}
                                        className={`flex items-center gap-3 ml-6 mr-1 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer group/item hover:bg-white/[0.03] ${selectedTable === table.name ? 'text-primary bg-primary/5' : 'text-zinc-400 hover:text-zinc-200'}`}
                                    >
                                        <div className={`h-1 w-1 rounded-full ${selectedTable === table.name ? 'bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]' : 'bg-zinc-700'}`}></div>
                                        <span className="truncate">{table.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Management */}
                <div>
                    <div className="px-3 mb-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Management</span>
                    </div>
                    <nav className="space-y-1">
                        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                            <Settings className="h-4 w-4" />
                            Project Settings
                        </button>
                        <button
                            onClick={() => onTabChange("logs")}
                            className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === "logs" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                        >
                            <History className="h-4 w-4" />
                            Query Logs
                        </button>
                    </nav>
                </div>
            </div>

            {/* User Footer with Logout */}
            <div className="p-4 border-t border-border mt-auto bg-zinc-950/20 relative">
                <div 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {user?.profile_picture ? (
                            <img src={user.profile_picture} alt={user.full_name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-tr from-primary/40 to-secondary/40 flex items-center justify-center text-[10px] font-black">
                                {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-foreground truncate">{user?.full_name || 'Anonymous User'}</span>
                        <span className="text-[9px] text-zinc-400 font-black uppercase tracking-tighter truncate">
                            {user?.role || 'User'}
                        </span>
                    </div>
                </div>

                {isUserMenuOpen && (
                    <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 z-50 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl py-2 animate-in slide-in-from-bottom-2 duration-200">
                        <div className="px-3 py-1.5 border-b border-white/5 mb-2">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Account Settings</span>
                        </div>
                        <button className="flex w-full items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
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
                    className="fixed z-[100] w-48 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl py-1.5 shadow-black/50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <div className="px-3 py-1.5 border-b border-white/5 mb-1.5">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{contextMenu.table}</span>
                    </div>

                    {[
                        { label: "View Data", color: "text-primary" },
                        { label: "View Structure", color: "text-zinc-400" },
                        { label: "Export Schema", color: "text-zinc-400" },
                        { separator: true },
                        { label: "Truncate Table", color: "text-amber-500" },
                        { label: "Drop Table", color: "text-red-500" },
                    ].map((item, i) => (
                        item.separator ? (
                            <div key={i} className="h-px bg-white/5 my-1.5"></div>
                        ) : (
                            <button
                                key={i}
                                className="flex w-full items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group"
                            >
                                <span>{item.label}</span>
                            </button>
                        )
                    ))}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
