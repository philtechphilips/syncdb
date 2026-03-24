import React from "react";
import { Table as TableIcon, ChevronDown, ChevronRight } from "lucide-react";

interface TableNodeProps {
  node: {
    id: string;
    name: string;
    x: number;
    y: number;
    isExpanded: boolean;
    columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[];
  };
  onMouseDown: (e: React.MouseEvent) => void;
  isActive: boolean;
  onToggleExpand: () => void;
  isDragging: boolean;
}

const TableNode = ({
  node,
  onMouseDown,
  isActive,
  onToggleExpand,
  isDragging,
}: TableNodeProps) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`absolute w-52 rounded-xl border bg-background shadow-lg transition-all duration-300 ${isDragging ? "shadow-2xl ring-2 ring-primary/30 z-50 cursor-grabbing" : "cursor-grab hover:shadow-xl"} ${isActive ? "ring-2 ring-primary z-50 shadow-2xl scale-105" : "border-white/15"}`}
      style={{ left: node.x, top: node.y }}
    >
      <div
        className={`flex items-center justify-between rounded-t-xl px-3 py-2 border-b border-border ${node.isExpanded ? "bg-white/[0.05]" : "bg-background hover:bg-white/[0.08]"} ${isActive ? "bg-primary/20" : ""}`}
      >
        <div className="flex items-center gap-2">
          <TableIcon
            className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-primary/80"}`}
          />
          <span
            className={`text-[11px] font-bold ${isActive ? "text-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]" : "text-zinc-100"}`}
          >
            {node.name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="p-1 rounded hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
        >
          {node.isExpanded ? (
            <ChevronDown className="h-3 w-3.5" />
          ) : (
            <ChevronRight className="h-3 w-3.5" />
          )}
        </button>
      </div>

      {node.isExpanded && (
        <div className="p-2 space-y-0.5 max-h-60 overflow-y-auto scrollbar-hide">
          {node.columns.map((col, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-1 w-1 rounded-full ${col.isPk ? "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" : col.isFk ? "bg-primary" : "bg-zinc-700"}`}
                ></div>
                <span
                  className={`text-[10px] font-medium ${col.isPk ? "text-amber-500" : "text-zinc-300"}`}
                >
                  {col.name}
                </span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                {col.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableNode;
