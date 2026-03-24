import React from "react";
import {
  MousePointer2,
  Grid3X3,
  Eye,
  Search,
  ZoomOut,
  ZoomIn,
  RefreshCcw,
  Minimize2,
  Maximize2,
  Download,
  FileText,
} from "lucide-react";

interface DiagramToolbarProps {
  isFullscreen: boolean;
  nodesCount: number;
  visibleNodesCount: number;
  isFiltering: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
  onToggleAll: (expanded: boolean) => void;
  onExport: (format: "png" | "jpeg" | "pdf") => void;
  isExporting: boolean;
}

const DiagramToolbar = ({
  isFullscreen,
  nodesCount,
  visibleNodesCount,
  isFiltering,
  search,
  onSearchChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleFullscreen,
  onToggleAll,
  onExport,
  isExporting,
}: DiagramToolbarProps) => {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between border-b border-border bg-[#021016] px-2 lg:px-4 py-2 gap-3 min-h-[3.5rem] lg:min-h-0 ${isFullscreen ? "lg:h-14 lg:px-8" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-[11px] font-bold text-zinc-400">
        <div className="flex items-center gap-2 text-primary">
          <MousePointer2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">INTERACTIVE CANVAS</span>
        </div>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Grid3X3 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {visibleNodesCount} visible of {nodesCount}
          </span>
          <span className="sm:hidden">
            {visibleNodesCount}/{nodesCount}
          </span>
        </span>
        <div className="h-4 w-px bg-white/10 hidden lg:block"></div>
        {isFiltering && (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5 animate-pulse">
            <Eye className="h-2.5 w-2.5" />
            <span className="hidden sm:inline">Filtering Active</span>
          </span>
        )}
        <div className="h-4 w-px bg-white/10 hidden lg:block"></div>
        <div className="relative flex-1 lg:flex-none">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Find..."
            className="bg-white/10 border border-white/15 rounded-md pl-8 pr-3 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/40 w-full lg:w-40 transition-all font-medium text-zinc-200"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center bg-white/10 rounded-lg border border-white/15 p-0.5">
          <button
            onClick={onZoomOut}
            className="rounded p-1 hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] font-mono w-10 text-center text-zinc-100">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="rounded p-1 hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={onResetView}
          className="rounded-lg border border-white/15 bg-white/10 p-1.5 shadow-sm hover:bg-white/20 transition-colors text-zinc-200 hover:text-white"
          title="Reset View"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="rounded-lg border border-white/15 bg-white/10 p-1.5 shadow-sm hover:bg-white/20 transition-colors text-zinc-200 hover:text-white"
        >
          {isFullscreen ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>
        <div className="h-4 w-px bg-white/10 mx-1"></div>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-border p-0.5">
          <button
            onClick={() => onToggleAll(true)}
            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-white/10 rounded transition-all text-zinc-400 hover:text-white"
          >
            Expand All
          </button>
          <button
            onClick={() => onToggleAll(false)}
            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-white/10 rounded transition-all text-zinc-400 hover:text-white"
          >
            Collapse All
          </button>
        </div>
        <div className="h-4 w-px bg-white/10 mx-1"></div>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-border p-0.5">
          <button
            disabled={isExporting}
            onClick={() => onExport("png")}
            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-white/10 rounded transition-all flex items-center gap-1.5 text-muted-foreground hover:text-primary disabled:opacity-50"
          >
            <Download className="h-2.5 w-2.5" />
            PNG
          </button>
          <button
            disabled={isExporting}
            onClick={() => onExport("jpeg")}
            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-white/10 rounded transition-all flex items-center gap-1.5 text-muted-foreground hover:text-primary disabled:opacity-50"
          >
            <Download className="h-2.5 w-2.5" />
            JPEG
          </button>
          <button
            disabled={isExporting}
            onClick={() => onExport("pdf")}
            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-white/10 rounded transition-all flex items-center gap-1.5 text-muted-foreground hover:text-primary disabled:opacity-50"
          >
            <FileText className="h-2.5 w-2.5" />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagramToolbar;
