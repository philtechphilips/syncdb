import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Terminal,
  History as HistoryIcon,
  X,
  HelpCircle,
  Lightbulb,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TableSkeleton } from "../DataTable/TableSkeleton";
import DataContextMenu from "../DataTable/DataContextMenu";
import { calculateContextMenuPosition, copyToClipboard } from "@/lib/uiUtils";
import { formatData } from "@/lib/exportUtils";
import { toast } from "sonner";
import type { QueryResultSet } from "@/store/useClusterStore";

type Cell = { resultSetIdx: number; rowId: string | number; colName: string };

interface ResultTableProps {
  rows: Record<string, unknown>[];
  resultSetIdx: number;
  onContextMenu: (
    e: React.MouseEvent,
    resultSetIdx: number,
    rowId: string | number,
    colName: string,
  ) => void;
  activeCell: Cell | null;
  editingCell: (Cell & { value: string }) | null;
  setEditingCell: (cell: (Cell & { value: string }) | null) => void;
  totalRows: number;
  onPageChange?: (page: number) => void;
  isPagingEnabled?: boolean;
}

interface QueryResultsAreaProps {
  queryResults: QueryResultSet[] | null;
  queryTotals: number[];
  bottomTab: "results" | "history";
  onSetTab: (tab: "results" | "history") => void;
  onClose: () => void;
  aiOutput: string | null;
  onCloseAiOutput: () => void;
  aiMode: string;
  isLoadingHistory: boolean;
  queryHistory: {
    id: string;
    query: string;
    success: boolean;
    executionTimeMs: number;
    createdAt: string;
  }[];
  isRunning?: boolean;
  onRestoreQuery: (query: string) => void;
  onPageChange?: (page: number) => void;
  isPagingEnabled?: boolean;
}

const ResultTable = ({
  rows,
  resultSetIdx,
  onContextMenu,
  activeCell,
  editingCell,
  setEditingCell,
  totalRows,
  onPageChange,
  isPagingEnabled,
}: ResultTableProps) => {
  const [localPage, setLocalPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const rowsPerPage = 50;

  const displayTotal = isPagingEnabled ? totalRows : rows.length;
  const totalPages = Math.ceil(displayTotal / rowsPerPage);

  const paginatedRows = isPagingEnabled
    ? rows
    : rows.slice((localPage - 1) * rowsPerPage, localPage * rowsPerPage);

  const startResize = useCallback(
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

  const handleNext = () => {
    if (localPage < totalPages) {
      const next = localPage + 1;
      setLocalPage(next);
      if (isPagingEnabled && onPageChange) onPageChange(next);
    }
  };

  const handlePrev = () => {
    if (localPage > 1) {
      const prev = localPage - 1;
      setLocalPage(prev);
      if (isPagingEnabled && onPageChange) onPageChange(prev);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto w-full thin-scrollbar border-b border-border pb-2">
        <table className="w-full text-left border-collapse text-xs min-w-max table-fixed">
          <thead className="sticky top-0 bg-bg-200 z-10 border-b border-border">
            <tr>
              {Object.keys(rows[0] || {}).map((key) => (
                <th
                  key={key}
                  style={{ width: columnWidths[key] || 150 }}
                  className="h-9 px-3 text-xs font-medium text-muted-foreground border-r border-border last:border-0 relative group/header font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{key}</span>
                    <div
                      onMouseDown={(e) => startResize(e, key)}
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-20 active:bg-primary"
                    />
                  </div>
                </th>
              ))}
              <th className="h-9 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedRows.map((row, i) => {
              const globalIdx = (localPage - 1) * rowsPerPage + i;
              // Position in the result set (query rows may have no unique id).
              const rowId = globalIdx;
              return (
                <tr
                  key={globalIdx}
                  className="group hover:bg-ink/[0.02] transition-colors"
                >
                  {Object.keys(row).map((col) => {
                    const val = row[col];
                    const isEditing =
                      editingCell?.resultSetIdx === resultSetIdx &&
                      editingCell?.rowId === rowId &&
                      editingCell?.colName === col;
                    const isActive =
                      activeCell?.resultSetIdx === resultSetIdx &&
                      activeCell?.rowId === rowId &&
                      activeCell?.colName === col;

                    return (
                      <td
                        key={col}
                        onContextMenu={(e) =>
                          onContextMenu(e, resultSetIdx, rowId, col)
                        }
                        onDoubleClick={() =>
                          setEditingCell({
                            resultSetIdx,
                            rowId,
                            colName: col,
                            value: String(val ?? ""),
                          })
                        }
                        style={{ width: columnWidths[col] || 150 }}
                        className={`h-9 max-w-0 px-3 font-mono text-foreground/80 border-r border-border last:border-0 relative ${
                          isActive
                            ? "bg-primary/5 outline outline-1 outline-primary/30 z-10"
                            : ""
                        }`}
                      >
                        {isEditing ? (
                          <div className="absolute inset-0 z-50 bg-card border border-primary shadow-xl rounded flex items-center p-0.5">
                            <textarea
                              autoFocus
                              className="w-full h-full bg-transparent border-none outline-none text-[11px] text-foreground px-2 py-1 resize-none"
                              value={editingCell.value}
                              onChange={(e) =>
                                setEditingCell({
                                  ...editingCell,
                                  value: e.target.value,
                                })
                              }
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                !e.shiftKey &&
                                setEditingCell(null)
                              }
                            />
                          </div>
                        ) : val === null ? (
                          <span className="italic text-subtle">NULL</span>
                        ) : (
                          <div
                            className="truncate"
                            title={
                              typeof val === "object"
                                ? JSON.stringify(val)
                                : String(val)
                            }
                          >
                            {typeof val === "object"
                              ? JSON.stringify(val)
                              : String(val)}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="h-9 pr-2 text-right">
                    <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-ink/5 transition-all text-subtle hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-bg-200 border-t border-border">
          <div className="text-[11px] font-medium text-subtle">
            Showing {(localPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(localPage * rowsPerPage, displayTotal)} of {displayTotal}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={localPage === 1}
              className="p-1.5 rounded bg-ink/5 hover:bg-ink/10 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[11px] font-medium text-accent-fg">
              {localPage} / {totalPages}
            </div>
            <button
              onClick={handleNext}
              disabled={localPage === totalPages}
              className="p-1.5 rounded bg-ink/5 hover:bg-ink/10 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const QueryResultsArea = ({
  queryResults,
  queryTotals,
  bottomTab,
  onSetTab,
  onClose,
  aiOutput,
  onCloseAiOutput,
  aiMode,
  isLoadingHistory,
  queryHistory,
  isRunning,
  onRestoreQuery,
  onPageChange,
  isPagingEnabled,
}: QueryResultsAreaProps) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    rowId: string | number;
    colName: string;
    type: "cell" | "row";
    resultSetIdx: number;
  } | null>(null);

  const [activeCell, setActiveCell] = useState<{
    resultSetIdx: number;
    rowId: string | number;
    colName: string;
  } | null>(null);

  const [editingCell, setEditingCell] = useState<{
    resultSetIdx: number;
    rowId: string | number;
    colName: string;
    value: string;
  } | null>(null);

  const closeMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [closeMenu]);

  if (!queryResults && bottomTab !== "history" && !isRunning) return null;

  const handleContextMenu = (
    e: React.MouseEvent,
    resultSetIdx: number,
    rowId: string | number,
    colName: string,
  ) => {
    e.preventDefault();
    const { x, y } = calculateContextMenuPosition(e.clientX, e.clientY, false);
    setContextMenu({ x, y, rowId, colName, type: "cell", resultSetIdx });
    setActiveCell({ resultSetIdx, rowId, colName });
  };

  const handleCopyRow = (
    format: string,
    resultSetIdx: number,
    rowId: string | number,
  ) => {
    const resultSet = queryResults?.[resultSetIdx];
    if (!Array.isArray(resultSet)) return;

    const row = resultSet.find((r, idx) => (r.id || idx) === rowId);
    if (!row) return;

    const content = formatData(format, [row], "query_result");
    if (content) {
      copyToClipboard(
        typeof content === "string" ? content : JSON.stringify(content),
      );
      toast.success(`Copied row as ${format}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background/50 overflow-hidden border-t border-border min-h-0 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between px-4 lg:px-6 py-2 border-b border-border bg-muted/20 shrink-0">
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => onSetTab("results")}
            className={`flex items-center gap-2 lg:gap-3 py-1 transition-all relative ${bottomTab === "results" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Terminal className="h-3.5 w-3.5 text-foreground" />
            <span className="text-[11px] font-medium whitespace-nowrap">
              Query Output
            </span>
            {bottomTab === "results" && (
              <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => onSetTab("history")}
            className={`flex items-center gap-2 lg:gap-3 py-1 transition-all relative ${bottomTab === "history" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <HistoryIcon className="h-3.5 w-3.5 text-foreground" />
            <span className="text-[11px] font-medium whitespace-nowrap">
              History
            </span>
            {bottomTab === "history" && (
              <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:text-foreground text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0 relative">
        {isRunning && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-accent-fg animate-spin opacity-50" />
          </div>
        )}
        <DataContextMenu
          contextMenu={contextMenu}
          onClose={closeMenu}
          onSetNull={() =>
            toast.info(
              "Editing query results is not supported for complex queries.",
            )
          }
          onCopyValue={(rid, col) => {
            const resultSet = queryResults?.[contextMenu!.resultSetIdx];
            const val = Array.isArray(resultSet)
              ? resultSet[Number(rid)]?.[col]
              : undefined;
            copyToClipboard(String(val ?? ""));
          }}
          onFilterByValue={() =>
            toast.info("Filter by value is coming soon for results.")
          }
          onCopyColumn={(col) => copyToClipboard(col)}
          onCopyRow={(format, rid) =>
            handleCopyRow(format, contextMenu!.resultSetIdx, rid)
          }
          onCloneRow={() => {}}
          onDeleteRow={() => {}}
          onDeleteSelected={() => {}}
          onFilterSelected={() => {}}
          selectedRowsCount={0}
        />

        {aiOutput ? (
          <div className="p-8 max-w-4xl animate-in fade-in duration-500 text-left">
            {/* ... (AI Output UI) ... */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                {aiMode === "explain" ? (
                  <HelpCircle className="h-5 w-5 text-subtle" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-subtle" />
                )}
              </div>
              <div>
                <h3 className="text-foreground font-medium text-xs">
                  {aiMode === "explain"
                    ? "Query Intelligence Report"
                    : "Optimization Suggestions"}
                </h3>
              </div>
              <button
                onClick={onCloseAiOutput}
                className="ml-auto text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
            <div className="prose dark:prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed font-sans whitespace-pre-wrap">
              {aiOutput}
            </div>
          </div>
        ) : bottomTab === "results" ? (
          !queryResults && isRunning ? (
            <TableSkeleton rowCount={6} columnCount={8} showCheckbox={false} />
          ) : Array.isArray(queryResults) && queryResults.length > 0 ? (
            <div className="flex flex-col gap-8 pb-12 w-full">
              {queryResults.map((resultSet, idx) => {
                const isSelect =
                  Array.isArray(resultSet) &&
                  (resultSet.length === 0 || typeof resultSet[0] === "object");
                const rows = Array.isArray(resultSet) ? resultSet : [];
                const affectedRows =
                  !isSelect && resultSet && !Array.isArray(resultSet)
                    ? (resultSet.affectedRows ?? resultSet.rowCount ?? null)
                    : null;

                return (
                  <div key={idx} className="w-full">
                    {isSelect ? (
                      rows.length > 0 || isRunning ? (
                        <ResultTable
                          rows={rows}
                          resultSetIdx={idx}
                          onContextMenu={handleContextMenu}
                          activeCell={activeCell}
                          editingCell={editingCell}
                          setEditingCell={setEditingCell}
                          totalRows={queryTotals[idx] || rows.length}
                          onPageChange={onPageChange}
                          isPagingEnabled={isPagingEnabled}
                        />
                      ) : (
                        <div className="p-8 text-subtle text-[11px] font-medium bg-ink/[0.01]">
                          Empty result set (0 rows)
                        </div>
                      )
                    ) : (
                      <div className="p-8 flex items-center gap-4 bg-primary/5 rounded-lg border border-primary/10 mx-4 mt-4">
                        <CheckCircle2 className="h-4 w-4 text-subtle" />
                        <span className="text-[11px] font-medium text-foreground/80">
                          {affectedRows !== null
                            ? `Command executed: ${affectedRows} rows affected`
                            : "Command executed successfully"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-subtle p-12 text-center opacity-40">
              <Terminal className="h-10 w-10 mb-4 opacity-20" />
              <h4 className="text-[11px] font-medium">No results to display</h4>
            </div>
          )
        ) : (
          <div className="flex flex-col h-full">
            {isLoadingHistory ? (
              <TableSkeleton
                rowCount={8}
                columnCount={4}
                showCheckbox={false}
              />
            ) : queryHistory.length > 0 ? (
              <div className="overflow-x-auto w-full thin-scrollbar">
                <table className="w-full text-left border-collapse text-[11px] min-w-[700px]">
                  <thead className="sticky top-0 bg-bg-200 z-10 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium text-muted-foreground text-[11px]">
                        Status
                      </th>
                      <th className="px-6 py-3 font-medium text-muted-foreground text-[11px]">
                        SQL Query
                      </th>
                      <th className="px-6 py-3 font-medium text-muted-foreground text-[11px]">
                        Duration
                      </th>
                      <th className="px-6 py-3 font-medium text-muted-foreground text-[11px]">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryHistory.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-border hover:bg-ink/[0.04] transition-colors cursor-pointer text-left"
                        onClick={() => onRestoreQuery(log.query)}
                      >
                        <td className="px-6 py-3 text-center">
                          {log.success ? (
                            <CheckCircle2 className="h-4 w-4 text-subtle" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-err" />
                          )}
                        </td>
                        <td className="px-6 py-3 font-mono text-foreground/80">
                          <div className="line-clamp-1 max-w-md">
                            {log.query}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-mono text-subtle">
                          {log.executionTimeMs}ms
                        </td>
                        <td className="px-6 py-3 text-subtle">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-subtle p-10 text-center gap-4">
                <HistoryIcon className="h-10 w-10 opacity-20" />
                <h3 className="text-muted-foreground font-medium text-[11px]">
                  No History Yet
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryResultsArea;
