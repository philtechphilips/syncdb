"use client";

import React from "react";
import { X, Table } from "lucide-react";
import DataTable from "@/components/dashboard/DataTable";
import { useClusterStore } from "@/store/useClusterStore";

export default function TablePage() {
  const { openTableTabs, activeTableTab, closeTableTab, setActiveTableTab } =
    useClusterStore();

  if (openTableTabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-zinc-600 gap-4 animate-in fade-in duration-1000">
        <div className="p-8 rounded-full bg-white/[0.01] border border-border/50 relative group">
          <Table className="h-16 w-16 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            Explorer Node Ready
          </p>
          <p className="text-[11px] font-medium text-zinc-400 max-w-[200px] leading-relaxed mx-auto">
            Select a table from the sidebar to open it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-white/5 bg-zinc-950 overflow-x-auto scrollbar-hide shrink-0">
        {openTableTabs.map((tab) => {
          const isActive = tab === activeTableTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTableTab(tab)}
              className={`group flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold border-r border-white/5 shrink-0 transition-all relative ${
                isActive
                  ? "text-white bg-background"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/3"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
              )}
              <Table
                className={`h-3 w-3 shrink-0 ${isActive ? "text-primary" : "text-zinc-600"}`}
              />
              <span className="max-w-[120px] truncate">{tab}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  closeTableTab(tab);
                }}
                className="h-4 w-4 rounded flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 ml-1 cursor-pointer"
              >
                <X className="h-2.5 w-2.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Table panels — all mounted, only active one visible */}
      <div className="flex-1 min-h-0 relative">
        {openTableTabs.map((tab) => (
          <div
            key={tab}
            className="absolute inset-0"
            style={{
              display: tab === activeTableTab ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            <DataTable selectedTable={tab} />
          </div>
        ))}
      </div>
    </div>
  );
}
