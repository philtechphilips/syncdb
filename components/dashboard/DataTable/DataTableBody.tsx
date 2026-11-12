import React from "react";
import { Maximize2, MoreHorizontal } from "lucide-react";
import { displayValue } from "@/lib/cellValue";

interface DataTableBodyProps {
  rows: Record<string, unknown>[];
  filteredRows: Record<string, unknown>[];
  /** Key of each row (primary key, or position for key-less tables). */
  getRowKey: (row: Record<string, unknown>) => string;
  selectedRows: Set<string>;
  onToggleRow: (key: string) => void;
  onToggleAll: () => void;
  onOpenUpdateModal: (row: Record<string, unknown>) => void;
  onContextMenu: (e: React.MouseEvent, rowKey: string, colName: string) => void;
  editingCell: {
    rowKey: string;
    colName: string;
    value: string;
  } | null;
  onStartEdit: (rowKey: string, colName: string) => void;
  onEditValueChange: (val: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  activeCell: { rowKey: string; colName: string } | null;
}

const DataTableBody = ({
  rows,
  filteredRows,
  getRowKey,
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
    <div className="flex-1 overflow-auto thin-scrollbar">
      <table className="w-full text-left border-collapse min-w-max table-fixed">
        <thead className="sticky top-0 bg-bg-200 z-10 border-b border-border">
          <tr>
            <th className="h-9 w-10 text-center border-r border-border">
              <input
                type="checkbox"
                checked={selectedRows.size === rows.length && rows.length > 0}
                onChange={onToggleAll}
                className="accent-primary w-3.5 h-3.5 rounded border-line-strong bg-ink/5"
              />
            </th>
            <th className="h-9 w-9 border-r border-border"></th>
            {rows.length > 0 &&
              Object.keys(rows[0]).map((col) => (
                <th
                  key={col}
                  style={{ width: columnWidths[col] || 150 }}
                  className="h-9 px-3 text-xs font-medium text-muted-foreground border-r border-border last:border-0 relative group/header font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{col}</span>
                    <div
                      onMouseDown={(e) => startResize(e, col)}
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20 active:bg-primary"
                    />
                  </div>
                </th>
              ))}
            <th className="h-9 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filteredRows.map((row) => {
            const rowId = getRowKey(row);
            return (
              <tr
                key={rowId}
                className={`group transition-colors ${selectedRows.has(rowId) ? "bg-primary/[0.06]" : "hover:bg-ink/[0.02]"}`}
              >
                <td className="h-9 w-10 text-center border-r border-border">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowId)}
                    onChange={() => onToggleRow(rowId)}
                    className="accent-primary w-3.5 h-3.5 rounded border-line-strong bg-ink/10"
                  />
                </td>
                <td className="h-9 w-9 text-center border-r border-border">
                  <button
                    onClick={() => onOpenUpdateModal(row)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 text-subtle hover:text-accent-fg hover:bg-primary/10 transition-colors"
                    title="Update Row"
                  >
                    <Maximize2 className="h-2.5 w-2.5" />
                  </button>
                </td>
                {Object.keys(row).map((col) => {
                  const isEditing =
                    editingCell?.rowKey === rowId &&
                    editingCell?.colName === col;
                  const isNull = row[col] === null || row[col] === undefined;
                  return (
                    <td
                      key={col}
                      onContextMenu={(e) => onContextMenu(e, rowId, col)}
                      onDoubleClick={() => onStartEdit(rowId, col)}
                      style={{ width: columnWidths[col] || 150 }}
                      className={`h-9 max-w-0 px-3 font-mono text-xs border-r border-border last:border-0 relative cursor-pointer select-none text-foreground/80 ${isNull ? "italic text-subtle" : ""} ${
                        activeCell?.rowKey === rowId &&
                        activeCell?.colName === col
                          ? "outline outline-1 outline-primary/30 bg-primary/5 z-10"
                          : ""
                      }`}
                    >
                      {isEditing ? (
                        <div className="absolute inset-0 z-50 bg-card border border-primary shadow-xl rounded flex items-center p-0.5 animate-in zoom-in-95 duration-150">
                          <textarea
                            autoFocus
                            className="w-full h-full bg-transparent border-none outline-none text-xs text-foreground px-2 py-1 resize-none font-mono cursor-text"
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
                            className={`h-1.5 w-1.5 rounded-full ${row[col] === "Active" ? "bg-primary" : "bg-ink/20"}`}
                          ></div>
                          <span
                            className={`${row[col] === "Active" ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {displayValue(row[col])}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="truncate"
                          title={displayValue(row[col])}
                        >
                          {displayValue(row[col])}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="h-9 pr-2 text-right">
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-ink/5 transition-all outline-none">
                    <MoreHorizontal className="h-4 w-4 text-subtle hover:text-foreground" />
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
