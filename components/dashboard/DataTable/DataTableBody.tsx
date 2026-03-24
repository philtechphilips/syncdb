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
  return (
    <div className="flex-1 overflow-auto scrollbar-hide">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-[#021016]/80 border-b border-border sticky top-0 z-10 backdrop-blur-md">
            <th className="px-6 py-4 w-12 text-center">
              <input
                type="checkbox"
                checked={selectedRows.size === rows.length && rows.length > 0}
                onChange={onToggleAll}
                className="accent-primary w-3.5 h-3.5 rounded border-white/20 bg-white/5"
              />
            </th>
            {rows.length > 0 &&
              Object.keys(rows[0]).map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-[10px] font-black text-zinc-300 tracking-widest border-r border-border last:border-0 cursor-default hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {col}
                    <ArrowUpDown className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
              ))}
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {filteredRows.map((row) => {
            const rowId = row.id as string | number;
            return (
              <tr
                key={rowId}
                className={`group bg-white/[0.04] hover:bg-white/[0.08] border-l-2 border-transparent hover:border-l-primary/60 transition-all ${selectedRows.has(rowId) ? "bg-primary/20 border-l-primary" : ""}`}
              >
                <td className="px-6 py-4 w-12 text-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowId)}
                      onChange={() => onToggleRow(rowId)}
                      className="accent-primary w-3.5 h-3.5 rounded border-white/20 bg-white/10"
                    />
                    <button
                      onClick={() => onOpenUpdateModal(row)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 bg-white/10 text-zinc-400 hover:text-white hover:bg-primary/30 transition-all border border-transparent hover:border-primary/30"
                      title="Update Row"
                    >
                      <Maximize2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </td>
                {Object.keys(row).map((col) => {
                  const isEditing =
                    editingCell?.rowId === rowId &&
                    editingCell?.colName === col;
                  return (
                    <td
                      key={col}
                      onContextMenu={(e) => onContextMenu(e, rowId, col)}
                      onDoubleClick={() =>
                        col !== "id" &&
                        onStartEdit(rowId, col, String(row[col]))
                      }
                      className={`px-6 py-4 text-xs font-semibold border-r border-border/50 last:border-0 relative transition-all ${
                        col === "id"
                          ? "font-mono text-muted-foreground"
                          : "text-zinc-200"
                      } ${row[col] === "NULL" ? "italic text-zinc-600" : ""} ${
                        activeCell?.rowId === rowId &&
                        activeCell?.colName === col
                          ? "outline outline-1 outline-primary/60 bg-primary/10 z-20 shadow-[0_0_15px_rgba(0,237,100,0.15)]"
                          : ""
                      }`}
                    >
                      {isEditing ? (
                        <div className="absolute inset-0 z-50 bg-card border-2 border-primary shadow-2xl rounded-md flex items-center p-1 animate-in zoom-in-95 duration-150">
                          <textarea
                            autoFocus
                            className="w-full h-full bg-transparent border-none outline-none text-[11px] font-medium text-white resize-none scrollbar-hide py-1.5 px-3 leading-relaxed"
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
                        <span className="line-clamp-2">
                          {typeof row[col] === "object"
                            ? JSON.stringify(row[col])
                            : String(row[col]).length > 70
                              ? `${String(row[col]).substring(0, 70)}...`
                              : (row[col] as React.ReactNode)}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-4 text-right">
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
