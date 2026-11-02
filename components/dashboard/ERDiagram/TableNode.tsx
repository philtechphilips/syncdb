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
      className={`absolute w-52 rounded-xl border bg-background shadow-lg transition-all duration-300 ${isDragging ? "shadow-2xl ring-2 ring-primary/30 z-50 cursor-grabbing" : "cursor-grab hover:shadow-xl"} ${isActive ? "ring-2 ring-primary z-50 shadow-2xl scale-105" : "border-line-strong"}`}
      style={{ left: node.x, top: node.y }}
    >
      <div
        className={`flex items-center justify-between rounded-t-xl px-3 py-2 border-b border-border ${node.isExpanded ? "bg-ink/[0.05]" : "bg-background hover:bg-ink/[0.08]"} ${isActive ? "bg-primary/20" : ""}`}
      >
        <div className="flex items-center gap-2">
          <TableIcon
            className={`h-3.5 w-3.5 ${isActive ? "text-accent-fg" : "text-accent-fg/80"}`}
          />
          <span
            className={`text-[11px] font-medium ${isActive ? "text-accent-fg" : "text-foreground"}`}
          >
            {node.name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="p-1 rounded hover:bg-ink/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          {node.isExpanded ? (
            <ChevronDown className="h-3 w-3.5" />
          ) : (
            <ChevronRight className="h-3 w-3.5" />
          )}
        </button>
      </div>

      {node.isExpanded && (
        <div className="p-2 space-y-0.5 max-h-60 overflow-y-auto thin-scrollbar">
          {node.columns.map((col, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-ink/[0.03] transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-1 w-1 rounded-full ${col.isPk ? "bg-warn" : col.isFk ? "bg-primary" : "bg-ink/20"}`}
                ></div>
                <span
                  className={`text-[11px] font-medium ${col.isPk ? "text-warn" : "text-foreground/80"}`}
                >
                  {col.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
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
