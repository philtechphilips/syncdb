import React from "react";
import { History, Trash2, Copy, Download, Filter, Plus } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";

interface DataTableHeaderProps {
  selectedTable?: string;
  totalRows: number;
  rowsCount: number;
  selectedRowsCount: number;
  onDeleteSelected: () => void;
  showCopyDropdown: boolean;
  setShowCopyDropdown: (val: boolean) => void;
  lastCopiedFormat: string | null;
  onCopy: (format: string) => void;
  showExportDropdown: boolean;
  setShowExportDropdown: (val: boolean) => void;
  onExport: (format: string) => void;
  showFilterPopover: boolean;
  setShowFilterPopover: (val: boolean) => void;
  activeFiltersCount: number;
  stagedFilters: {
    column: string;
    operator: string;
    value: string;
  }[];
  onClearAllFilters: () => void;
  onAddFilter: () => void;
  onRemoveFilter: (idx: number) => void;
  onUpdateFilter: (
    idx: number,
    updates: Partial<{ column: string; operator: string; value: string }>,
  ) => void;
  onApplyFilters: () => void;
  tableColumns: { name: string; type: string }[];
  rows: Record<string, unknown>[];
  showGlobalExportDropdown: boolean;
  setShowGlobalExportDropdown: (val: boolean) => void;
  onOpenInsertModal: () => void;
  onDropTable?: () => void;
}

const DataTableHeader = ({
  selectedTable,
  totalRows,
  rowsCount,
  selectedRowsCount,
  onDeleteSelected,
  showCopyDropdown,
  setShowCopyDropdown,
  lastCopiedFormat,
  onCopy,
  showExportDropdown,
  setShowExportDropdown,
  onExport,
  showFilterPopover,
  setShowFilterPopover,
  activeFiltersCount,
  stagedFilters,
  onClearAllFilters,
  onAddFilter,
  onRemoveFilter,
  onUpdateFilter,
  onApplyFilters,
  tableColumns,
  rows,
  showGlobalExportDropdown,
  setShowGlobalExportDropdown,
  onOpenInsertModal,
  onDropTable,
}: DataTableHeaderProps) => {
  const { open: openModal } = useModalStore();
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-6 py-4 border-b border-border bg-[#021016]/50 gap-4">
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-white tracking-widest uppercase">
            {selectedTable || "Query Results"}
          </span>
          {onDropTable && selectedTable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal({
                  title: "Drop Table",
                  message: `Are you sure you want to PERMANENTLY delete table "${selectedTable}"? This action cannot be undone and all data will be lost.`,
                  type: "danger",
                  confirmLabel: "Drop Table",
                  confirmValue: selectedTable,
                  onConfirm: () => onDropTable!(),
                });
              }}
              className="ml-2 p-1 rounded hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-colors group relative"
              title="Drop Table"
            >
              <Trash2 className="h-3 w-3" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-card border border-border rounded text-[8px] font-black uppercase text-red-500 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Danger Zone: Drop Table
              </div>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest whitespace-nowrap">
            {totalRows > 0
              ? `${totalRows.toLocaleString()} total rows`
              : `${rowsCount} rows returned`}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {selectedRowsCount > 0 && (
          <div className="flex items-center gap-2 pr-3 border-r border-border mr-1 animate-in slide-in-from-left-4 duration-200">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest mr-2">
              {selectedRowsCount} selected
            </span>

            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 text-white hover:bg-red-500/20 text-[9px] font-black uppercase tracking-widest transition-all"
            >
              <Trash2 className="h-3 w-3 text-white" />
              Delete
            </button>

            {/* Copy Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCopyDropdown(!showCopyDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${lastCopiedFormat ? "bg-primary/20 text-white font-black" : "bg-white/[0.03] text-white hover:bg-white/[0.08]"}`}
              >
                <Copy className="h-3 w-3 text-white" />
                {lastCopiedFormat ? `Copied ${lastCopiedFormat}` : "Copy"}
              </button>
              {showCopyDropdown && (
                <div className="absolute top-full mt-2 left-0 z-[100] w-28 bg-card border border-border rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
                  {["CSV", "JSON", "SQL"].map((format) => (
                    <button
                      key={format}
                      onClick={() => onCopy(format)}
                      className="flex w-full items-center px-4 py-2 text-[9px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] text-white hover:bg-white/[0.08] text-[9px] font-black uppercase tracking-widest transition-all"
              >
                <Download className="h-3 w-3 text-white" />
                Export
              </button>
              {showExportDropdown && (
                <div className="absolute top-full mt-2 left-0 z-[100] w-28 bg-card border border-border rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
                  {["CSV", "JSON", "SQL"].map((format) => (
                    <button
                      key={format}
                      onClick={() => onExport(format)}
                      className="flex w-full items-center px-4 py-2 text-[9px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="relative">
          <button
            onClick={() => setShowFilterPopover(!showFilterPopover)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all uppercase tracking-widest text-[10px] font-black ${
              activeFiltersCount > 0
                ? "bg-primary/10 border-primary text-white"
                : "bg-white/[0.02] border-border/50 text-white hover:border-white/20"
            }`}
          >
            <Filter className="h-3 w-3 text-white" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-primary text-white h-3.5 w-3.5 flex items-center justify-center rounded-full text-[8px] font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Advanced Filter Popover */}
          {showFilterPopover && (
            <div className="absolute top-full mt-2 right-0 z-[100] w-[450px] bg-card border border-border rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 px-1 text-left">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    Active Filters
                  </span>
                  <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tight">
                    Displaying rows where:
                  </span>
                </div>
                <button
                  onClick={onClearAllFilters}
                  className="text-[9px] font-black text-muted-foreground hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide mb-4">
                {stagedFilters.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-border/50 rounded-xl">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      No filters applied
                    </p>
                  </div>
                ) : (
                  stagedFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-lg group"
                    >
                      <select
                        value={filter.column}
                        onChange={(e) =>
                          onUpdateFilter(index, { column: e.target.value })
                        }
                        className="bg-zinc-800 border-none rounded px-2 py-1.5 text-[11px] font-bold text-zinc-200 focus:ring-1 focus:ring-primary outline-none w-32"
                      >
                        {(tableColumns.length > 0
                          ? tableColumns.map((c) => c.name)
                          : rows.length > 0
                            ? Object.keys(rows[0])
                            : []
                        ).map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>

                      <select
                        value={filter.operator}
                        onChange={(e) =>
                          onUpdateFilter(index, { operator: e.target.value })
                        }
                        className="bg-zinc-800 border-none rounded px-2 py-1.5 text-[11px] font-bold text-primary focus:ring-1 focus:ring-primary outline-none w-28 uppercase"
                      >
                        <option value="is">Is</option>
                        <option value="is_not">Is Not</option>
                        <option value="contains">Contains</option>
                        <option value="not_contains">Does not contain</option>
                        <option value="starts_with">Starts with</option>
                        <option value="ends_with">Ends with</option>
                        <option value="gt">&gt; Greater than</option>
                        <option value="lt">&lt; Less than</option>
                        <option value="is_null">Is Null</option>
                        <option value="is_not_null">Is Not Null</option>
                      </select>

                      <input
                        disabled={filter.operator.includes("null")}
                        value={filter.value}
                        onChange={(e) =>
                          onUpdateFilter(index, { value: e.target.value })
                        }
                        placeholder="Value..."
                        className="flex-1 bg-zinc-800 border-none rounded px-3 py-1.5 text-[11px] font-bold text-zinc-300 focus:ring-1 focus:ring-primary outline-none disabled:opacity-20"
                      />

                      <button
                        onClick={() => onRemoveFilter(index)}
                        className="p-1.5 rounded bg-white/5 text-muted-foreground hover:text-red-400 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <button
                  onClick={onAddFilter}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-white hover:bg-primary/20 text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Plus className="h-3 w-3 text-white" />
                  Add Condition
                </button>
                <button
                  onClick={onApplyFilters}
                  className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setShowGlobalExportDropdown(!showGlobalExportDropdown)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-white/[0.02] text-[10px] font-black text-white hover:border-white/20 transition-all uppercase tracking-widest"
          >
            <Download className="h-3 w-3 text-white" />
            Export
          </button>
          {showGlobalExportDropdown && (
            <div className="absolute top-full mt-2 right-0 z-[100] w-32 bg-card border border-border rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-1.5 text-[8px] font-black text-zinc-600 uppercase tracking-tighter border-b border-border/50 mb-1">
                Table View ({rowsCount})
              </div>
              {["CSV", "JSON", "SQL"].map((format) => (
                <button
                  key={format}
                  onClick={() => onExport(format)}
                  className="flex w-full items-center px-4 py-2 text-[9px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase text-left"
                >
                  {format} File
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onOpenInsertModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-white hover:bg-primary/20 transition-all uppercase tracking-widest"
        >
          <Plus className="h-3 w-3 text-white" />
          Insert Row
        </button>
      </div>
    </div>
  );
};

export default DataTableHeader;
