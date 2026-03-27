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

interface QueryResultsAreaProps {
  queryResults: any[] | null;
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
}: any) => {
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
      <div className="overflow-x-auto w-full scrollbar-hide border-b border-white/5 pb-2">
        <table className="w-full text-left border-collapse text-[11px] min-w-max table-fixed">
          <thead className="sticky top-0 bg-[#021016]/80 backdrop-blur-md z-10 shadow-sm border-b border-border/50">
            <tr>
              {Object.keys(rows[0] || {}).map((key) => (
                <th
                  key={key}
                  style={{ width: columnWidths[key] || 150 }}
                  className="px-6 py-3 font-bold text-zinc-400 tracking-wider border-r border-border/30 last:border-0 relative group/header font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{key}</span>
                    <div
                      onMouseDown={(e) => startResize(e, key)}
                      className="absolute top-0 right-0 w-[3px] h-full cursor-col-resize bg-white/[0.08] hover:bg-primary/50 transition-colors z-20 border-r border-white/[0.1] active:bg-primary"
                    />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {paginatedRows.map((row: any, i: number) => {
              const globalIdx = (localPage - 1) * rowsPerPage + i;
              const rowId = row.id || globalIdx;
              return (
                <tr
                  key={globalIdx}
                  className="group bg-white/[0.01] hover:bg-white/[0.04] transition-all border-l-2 border-transparent hover:border-l-primary/40"
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
                        className={`px-6 py-3 font-mono text-zinc-300 border-r border-border/10 last:border-0 relative break-words whitespace-pre-wrap ${
                          isActive
                            ? "bg-primary/5 outline outline-1 outline-primary/30 z-10"
                            : ""
                        }`}
                      >
                        {isEditing ? (
                          <div className="absolute inset-0 z-50 bg-card border border-primary shadow-xl rounded flex items-center p-0.5">
                            <textarea
                              autoFocus
                              className="w-full h-full bg-transparent border-none outline-none text-[11px] text-white px-2 py-1 resize-none"
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
                          <span className="italic text-zinc-600">NULL</span>
                        ) : (
                          <div className="max-h-[100px] overflow-y-auto scrollbar-hide font-mono">
                            {typeof val === "object"
                              ? JSON.stringify(val)
                              : String(val)}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/5 transition-all text-zinc-600 hover:text-white">
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
        <div className="flex items-center justify-between px-6 py-3 bg-black/20 border-t border-white/5">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Showing {(localPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(localPage * rowsPerPage, displayTotal)} of {displayTotal}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={localPage === 1}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-black text-primary">
              {localPage} / {totalPages}
            </div>
            <button
              onClick={handleNext}
              disabled={localPage === totalPages}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-4 w-4 text-white" />
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
    <div className="flex-1 flex flex-col bg-[#021016]/50 overflow-hidden border-t border-border/50 min-h-0 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between px-4 lg:px-6 py-2 border-b border-border/50 bg-muted/20 shrink-0">
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => onSetTab("results")}
            className={`flex items-center gap-2 lg:gap-3 py-1 transition-all relative ${bottomTab === "results" ? "text-white" : "text-muted-foreground hover:text-zinc-300"}`}
          >
            <Terminal className="h-3.5 w-3.5 text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              Query Output
            </span>
            {bottomTab === "results" && (
              <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => onSetTab("history")}
            className={`flex items-center gap-2 lg:gap-3 py-1 transition-all relative ${bottomTab === "history" ? "text-white" : "text-muted-foreground hover:text-zinc-300"}`}
          >
            <HistoryIcon className="h-3.5 w-3.5 text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              History
            </span>
            {bottomTab === "history" && (
              <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:text-white text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-black/5 min-h-0 relative">
        {isRunning && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin opacity-50" />
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
            const val = (
              queryResults?.[contextMenu!.resultSetIdx] as any[]
            ).find((r, idx) => (r.id || idx) === rid)?.[col];
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
                  <HelpCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-zinc-200 font-bold text-xs uppercase tracking-widest">
                  {aiMode === "explain"
                    ? "Query Intelligence Report"
                    : "Optimization Suggestions"}
                </h3>
              </div>
              <button
                onClick={onCloseAiOutput}
                className="ml-auto text-[10px] font-black text-muted-foreground hover:text-white uppercase tracking-widest flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap">
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
                const rows = isSelect ? (resultSet as any[]) : [];
                const affectedRows = !isSelect
                  ? ((resultSet as any)?.affectedRows ??
                    (resultSet as any)?.rowCount ??
                    null)
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
                        <div className="p-8 text-zinc-500 text-[10px] font-bold uppercase tracking-widest bg-white/[0.01]">
                          Empty result set (0 rows)
                        </div>
                      )
                    ) : (
                      <div className="p-8 flex items-center gap-4 bg-primary/5 rounded-lg border border-primary/10 mx-4 mt-4">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
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
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 p-12 text-center opacity-40">
              <Terminal className="h-10 w-10 mb-4 opacity-20" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">
                No results to display
              </h4>
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
              <div className="overflow-x-auto w-full scrollbar-hide">
                <table className="w-full text-left border-collapse text-[11px] min-w-[700px]">
                  <thead className="sticky top-0 bg-card z-10 shadow-sm border-b border-border/50">
                    <tr>
                      <th className="px-6 py-3 font-bold text-zinc-400 uppercase text-[9px]">
                        Status
                      </th>
                      <th className="px-6 py-3 font-bold text-zinc-400 uppercase text-[9px]">
                        SQL Query
                      </th>
                      <th className="px-6 py-3 font-bold text-zinc-400 uppercase text-[9px]">
                        Duration
                      </th>
                      <th className="px-6 py-3 font-bold text-zinc-400 uppercase text-[9px]">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryHistory.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                        onClick={() => onRestoreQuery(log.query)}
                      >
                        <td className="px-6 py-3 text-center">
                          {log.success ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-3 font-mono text-zinc-300">
                          <div className="line-clamp-1 max-w-md">
                            {log.query}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-mono text-zinc-500">
                          {log.executionTimeMs}ms
                        </td>
                        <td className="px-6 py-3 text-zinc-600">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 p-10 text-center gap-4">
                <HistoryIcon className="h-10 w-10 opacity-20" />
                <h3 className="text-zinc-400 font-bold text-[11px] uppercase tracking-widest">
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
