"use client";

import React from "react";
import { Search, Bell, ChevronRight, Play, Database, Menu } from "lucide-react";

import { useClusterStore } from "@/store/useClusterStore";
import { useQueryStore } from "@/store/useQueryStore";

interface NavbarProps {
  onOpenConnect: () => void;
  onOpenSidebar: () => void;
}

const Navbar = ({ onOpenConnect, onOpenSidebar }: NavbarProps) => {
  const { selectedCluster, activeTab } = useClusterStore();
  const { requestRun } = useQueryStore();

  return (
    <nav className="fixed right-0 top-0 z-30 flex h-14 w-full lg:w-[calc(100%-16rem)] items-center justify-between border-b border-white/10 bg-background px-4 lg:px-6 font-sans overflow-hidden">
      {/* Breadcrumbs & Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 lg:hidden hover:bg-white/5 rounded-lg transition-colors text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 max-w-[150px] lg:max-w-none">
          <span className="hover:text-white cursor-pointer transition-colors hidden sm:inline">
            Clusters
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600 hidden sm:inline" />
          <span className="text-white font-bold truncate max-w-[100px] lg:max-w-none">
            {selectedCluster?.name || "No Connection"}
          </span>
        </div>
        {selectedCluster && (
          <>
            <div className="h-4 w-px bg-border mx-1 lg:mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-black text-primary border border-primary/20 whitespace-nowrap">
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse"></div>
              {selectedCluster.type.toUpperCase()}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2 border-r border-border pr-2 lg:pr-4 mr-1 lg:mr-2">
          {activeTab === "query" && (
            <button
              onClick={requestRun}
              className="flex items-center gap-2 rounded-md bg-primary px-3 lg:px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-primary/90 active:scale-95 whitespace-nowrap"
            >
              <Play className="h-3 w-3 fill-white" />
              <span className="hidden sm:inline">Run Query</span>
            </button>
          )}
          <button
            className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 lg:px-4 py-1.5 text-xs font-bold text-white hover:bg-muted transition-all whitespace-nowrap"
            onClick={onOpenConnect}
          >
            <Database className="h-3 w-3 text-white" />
            <span className="hidden sm:inline">Connect</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 lg:gap-3">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="h-8 w-32 lg:w-48 rounded-md border border-border bg-muted/20 pl-9 pr-3 text-[11px] font-medium text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
            />
          </div>
          <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-white hover:text-white hover:bg-muted transition-all">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
