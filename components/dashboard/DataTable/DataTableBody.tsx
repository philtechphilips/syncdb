import React from "react";
import { ArrowUpDown, Maximize2, MoreHorizontal } from "lucide-react";

interface DataTableBodyProps {
  rows: Record<string, unknown>[];
  filteredRows: Record<string, unknown>[];
  selectedRows: Set<string | number>;
  onToggleRow: (id: string | number) => void;
  onToggleAll: () => void;
  onOpenUpdateModal: (row: Record<string, unknown>) => void;
  onContextMenu: (
    e: React.MouseEvent,
    rowId: string | number,
    colName: string,
    value: any,
  ) => void;
  editingCell: {
    rowId: string | number;
    colName: string;
    value: string;
  } | null;
  onStartEdit: (rowId: string | number, colName: string, value: string) => void;
  onEditValueChange: (val: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  activeCell: { rowId: string | number; colName: string } | null;
}

const DataTableBody = ({
  rows,
  filteredRows,
  selectedRows,
  onToggleRow,
  onToggleAll,
  onOpenUpdateModal,
  onContextMenu,
  editingCell,
  onStartEdit,
  onEditValueChange,
  onSaveEdit,
  onCancelEdit,
  activeCell,
}: DataTableBodyProps) => {
  const [columnWidths, setColumnWidths] = React.useState<
    Record<string, number>
  >({});

  const startResize = React.useCallback(
    (e: React.MouseEvent, key: string) => {
      e.preventDefault();
      const startX = e.pageX;
      const startWidth = columnWidths[key] || 150;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(80, startWidth + (moveEvent.pageX - startX));
        setColumnWidths((prev) => ({ ...prev, [key]: newWidth }));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [columnWidths],
  );
  return (
    <div className="flex-1 overflow-auto scrollbar-hide bg-black/5">
      <table className="w-full text-left border-collapse min-w-max table-fixed">
        <thead className="sticky top-0 bg-[#021016]/80 backdrop-blur-md z-10 shadow-sm border-b border-border/50">
          <tr>
            <th className="px-6 py-3 w-12 text-center border-r border-border/30">
              <input
                type="checkbox"
                checked={selectedRows.size === rows.length && rows.length > 0}
                onChange={onToggleAll}
                className="accent-primary w-3.5 h-3.5 rounded border-white/20 bg-white/5"
              />
            </th>
            <th className="px-4 py-3 w-10 text-center border-r border-border/30"></th>
            {rows.length > 0 &&
              Object.keys(rows[0]).map((col) => (
                <th
                  key={col}
                  style={{ width: columnWidths[col] || 150 }}
                  className="px-6 py-3 text-[11px] font-bold text-zinc-400 tracking-widest border-r border-border/30 last:border-0 relative group/header font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{col}</span>
                    <div
                      onMouseDown={(e) => startResize(e, col)}
                      className="absolute top-0 right-0 w-[3px] h-full cursor-col-resize bg-white/[0.08] hover:bg-primary/50 transition-colors z-20 border-r border-white/[0.1] active:bg-primary"
                    />
                  </div>
                </th>
              ))}
            <th className="px-6 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {filteredRows.map((row) => {
            const rowId = row.id as string | number;
            return (
              <tr
                key={rowId}
                className={`group bg-white/[0.01] hover:bg-white/[0.04] transition-all border-l-2 border-transparent hover:border-l-primary/40 ${selectedRows.has(rowId) ? "bg-primary/5 border-l-primary/60" : ""}`}
              >
                <td className="px-6 py-3 w-12 text-center border-r border-border/10">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowId)}
                    onChange={() => onToggleRow(rowId)}
                    className="accent-primary w-3.5 h-3.5 rounded border-white/20 bg-white/10"
                  />
                </td>
                <td className="px-4 py-3 w-10 text-center border-r border-border/10">
                  <button
                    onClick={() => onOpenUpdateModal(row)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 bg-white/10 text-zinc-400 hover:text-white hover:bg-primary/30 transition-all border border-transparent hover:border-primary/30"
                    title="Update Row"
                  >
                    <Maximize2 className="h-2.5 w-2.5" />
                  </button>
                </td>
                {Object.keys(row).map((col) => {
                  const isEditing =
                    editingCell?.rowId === rowId &&
                    editingCell?.colName === col;
                  return (
                    <td
                      key={col}
                      onContextMenu={(e) =>
                        onContextMenu(e, rowId, col, row[col])
                      }
                      onDoubleClick={() =>
                        col !== "id" &&
                        onStartEdit(rowId, col, String(row[col]))
                      }
                      style={{ width: columnWidths[col] || 150 }}
                      className={`px-6 py-3 font-mono text-[11px] border-r border-border/10 last:border-0 relative transition-all break-words whitespace-pre-wrap ${
                        col === "id" ? "text-muted-foreground" : "text-zinc-300"
                      } ${row[col] === "NULL" ? "italic text-zinc-600" : ""} ${
                        activeCell?.rowId === rowId &&
                        activeCell?.colName === col
                          ? "outline outline-1 outline-primary/30 bg-primary/5 z-10 shadow-[0_0_15px_rgba(0,237,100,0.05)]"
                          : ""
                      }`}
                    >
                      {isEditing ? (
                        <div className="absolute inset-0 z-50 bg-card border border-primary shadow-xl rounded flex items-center p-0.5 animate-in zoom-in-95 duration-150">
                          <textarea
                            autoFocus
                            className="w-full h-full bg-transparent border-none outline-none text-[11px] text-white px-2 py-1 resize-none font-mono"
                            value={editingCell?.value}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            onBlur={onSaveEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                onSaveEdit();
                              }
                              if (e.key === "Escape") {
                                onCancelEdit();
                              }
                            }}
                          />
                        </div>
                      ) : col === "status" ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${row[col] === "Active" ? "bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]" : "bg-zinc-700"}`}
                          ></div>
                          <span
                            className={`${row[col] === "Active" ? "text-zinc-200" : "text-muted-foreground"}`}
                          >
                            {row[col] as React.ReactNode}
                          </span>
                        </div>
                      ) : (
                        <div className="max-h-[100px] overflow-y-auto scrollbar-hide font-mono">
                          {typeof row[col] === "object"
                            ? JSON.stringify(row[col])
                            : String(row[col])}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-3 text-right">
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/5 transition-all outline-none">
                    <MoreHorizontal className="h-4 w-4 text-zinc-600 hover:text-white" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableBody;
