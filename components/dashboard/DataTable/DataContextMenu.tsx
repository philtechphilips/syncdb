import React from "react";
import {
  FileMinus,
  Copy,
  Filter,
  FileType,
  FileJson,
  Database,
  Plus,
  Trash2,
} from "lucide-react";

interface DataContextMenuProps {
  contextMenu: {
    x: number;
    y: number;
    rowId: string | number;
    colName: string;
    type: "cell" | "row";
  } | null;
  onClose: () => void;
  onSetNull: (rowId: string | number, colName: string) => void;
  onCopyValue: (rowId: string | number, colName: string) => void;
  onFilterByValue: (rowId: string | number, colName: string) => void;
  onCopyColumn: (colName: string) => void;
  onCopyRow: (format: string, rowId: string | number) => void;
  onCloneRow: (rowId: string | number) => void;
  onDeleteRow: (rowId: string | number) => void;
  onDeleteSelected: () => void;
  onFilterSelected: () => void;
  selectedRowsCount: number;
}

const DataContextMenu = ({
  contextMenu,
  onClose,
  onSetNull,
  onCopyValue,
  onFilterByValue,
  onCopyColumn,
  onCopyRow,
  onCloneRow,
  onDeleteRow,
  onDeleteSelected,
  onFilterSelected,
  selectedRowsCount,
}: DataContextMenuProps) => {
  if (!contextMenu) return null;

  return (
    <div
      className="fixed z-[100] w-64 bg-card border border-border rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in duration-100"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border/50 mb-1.5 flex justify-between items-center">
        <span>
          {contextMenu.type === "cell" ? "Targeted Node" : "Batch Actions"}
        </span>
        {contextMenu.type === "row" && (
          <span className="text-primary/50 text-[8px] font-black uppercase tracking-widest">
            {selectedRowsCount} Selected
          </span>
        )}
      </div>

      {contextMenu.type === "cell" ? (
        <>
          {/* Cell Specific */}
          <button
            disabled={contextMenu.colName === "id"}
            onClick={() => {
              onSetNull(contextMenu.rowId, contextMenu.colName);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent text-left"
          >
            <FileMinus className="h-4 w-4 text-muted-foreground" />
            Set cell as Null
          </button>
          <button
            onClick={() => {
              onCopyValue(contextMenu.rowId, contextMenu.colName);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
            Copy Cell Value
          </button>
          <button
            onClick={() => {
              onFilterByValue(contextMenu.rowId, contextMenu.colName);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filter by this value
          </button>
          <button
            onClick={() => {
              onCopyColumn(contextMenu.colName);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <FileType className="h-4 w-4 text-muted-foreground" />
            Copy Column Name
          </button>

          <div className="h-px bg-white/5 my-1.5"></div>
          <div className="px-3 py-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest text-left">
            Row Options
          </div>

          <button
            onClick={() => {
              onCopyRow("JSON", contextMenu.rowId);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <FileJson className="h-4 w-4 text-muted-foreground" />
            Copy Row as JSON
          </button>
          <button
            onClick={() => {
              onCopyRow("CSV", contextMenu.rowId);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <FileType className="h-4 w-4 text-muted-foreground" />
            Copy Row as CSV
          </button>
          <button
            onClick={() => {
              onCopyRow("SQL", contextMenu.rowId);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <Database className="h-4 w-4 text-muted-foreground" />
            Copy Row as SQL
          </button>

          <div className="h-px bg-white/5 my-1.5"></div>

          <button
            onClick={() => {
              onCloneRow(contextMenu.rowId);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            Clone Row
          </button>
          <button
            onClick={() => {
              onDeleteRow(contextMenu.rowId);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-all text-left"
          >
            <Trash2 className="h-4 w-4" />
            Delete Row
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              onCopyRow("JSON", -1);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <FileJson className="h-4 w-4 text-muted-foreground" />
            Copy Selection as JSON
          </button>
          <button
            onClick={() => {
              onCopyRow("CSV", -1);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <FileType className="h-4 w-4 text-muted-foreground" />
            Copy Selection as CSV
          </button>
          <button
            onClick={() => {
              onCopyRow("SQL", -1);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <Database className="h-4 w-4 text-muted-foreground" />
            Copy Selection as SQL
          </button>

          <div className="h-px bg-white/5 my-1.5"></div>

          <button
            onClick={() => {
              onDeleteSelected();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-all text-left"
          >
            <Trash2 className="h-4 w-4" />
            Delete {selectedRowsCount} Selected Rows
          </button>

          <div className="h-px bg-white/5 my-1.5"></div>

          <button
            onClick={() => {
              onFilterSelected();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all text-left"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filter for Selected Rows
          </button>
        </>
      )}
    </div>
  );
};

export default DataContextMenu;
