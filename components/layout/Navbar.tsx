"use client";

import React from "react";
import { Search, Bell, Play, Database, Menu, ShieldAlert } from "lucide-react";

import { useClusterStore } from "@/store/useClusterStore";
import { useQueryStore } from "@/store/useQueryStore";
import { useAuthStore } from "@/store/useAuthStore";

interface NavbarProps {
  onOpenConnect: () => void;
  onOpenSidebar: () => void;
}

import { Badge, getEnvColor } from "@/components/ui/Badge";

const Navbar = ({ onOpenConnect, onOpenSidebar }: NavbarProps) => {
  const { selectedCluster, activeTab, searchQuery, setSearchQuery } =
    useClusterStore();
  const { requestRun } = useQueryStore();
  const { user } = useAuthStore();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const themeColor =
    selectedCluster?.color || getEnvColor(selectedCluster?.environment);

  return (
    <nav className="flex h-14 w-full shrink-0 items-center justify-between gap-3 bg-chrome px-3 sm:px-4 font-sans overflow-hidden">
      {/* Breadcrumbs & Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 lg:hidden hover:bg-ink/5 rounded-lg transition-colors text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground max-w-[150px] lg:max-w-none">
          <span className="hidden sm:inline">Clusters</span>
          <span className="text-ink/20 select-none hidden sm:inline">/</span>
          <span className="text-foreground truncate max-w-[100px] lg:max-w-none flex items-center gap-2">
            {selectedCluster?.name || "No Connection"}
            {selectedCluster?.environment === "production" && (
              <ShieldAlert className="h-3 w-3 text-err" />
            )}
          </span>
        </div>
        {selectedCluster && (
          <>
            <div className="h-4 w-px bg-ink/10 mx-1 hidden sm:block"></div>
            <Badge color={themeColor} dot>
              {selectedCluster.environment}
            </Badge>

            <Badge>{selectedCluster.type}</Badge>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2">
          {activeTab === "query" && (
            <button
              onClick={requestRun}
              className="flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-white transition-colors bg-primary hover:bg-primary-hover whitespace-nowrap shadow-[0_1px_2px_rgb(67_56_202/0.25)]"
            >
              <Play className="h-3 w-3 fill-white" />
              <span className="hidden sm:inline">Run Query</span>
            </button>
          )}
          <button
            className="flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-background px-3 text-[13px] font-medium text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:bg-bg-300 transition-colors whitespace-nowrap"
            onClick={onOpenConnect}
          >
            <Database className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Connect</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
            <input
              type="text"
              placeholder="Search tables…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-32 lg:w-48 rounded-md border border-line-strong bg-background pl-8 pr-3 text-[13px] text-foreground placeholder:text-subtle outline-none focus:border-primary/60 transition-colors"
            />
          </div>
          <div className="h-7 w-7 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-[11px] font-medium text-accent-fg">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
