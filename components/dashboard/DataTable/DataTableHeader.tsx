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
  onExportSelection: (format: string) => void;
  onExportAll: (format: string) => void;
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
  onExportSelection,
  onExportAll,
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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 lg:px-6 py-2 border-b border-border bg-muted/20 gap-4 shrink-0">
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-foreground">
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
              className="ml-2 p-1 rounded hover:bg-err/10 text-subtle hover:text-err transition-colors group relative"
              title="Drop Table"
            >
              <Trash2 className="h-3 w-3" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-card border border-border rounded text-[11px] font-medium text-err opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Danger Zone: Drop Table
              </div>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] text-foreground/80 font-medium whitespace-nowrap">
            {totalRows > 0
              ? `${totalRows.toLocaleString()} total rows`
              : `${rowsCount} rows returned`}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {selectedRowsCount > 0 && (
          <div className="flex items-center gap-2 pr-3 border-r border-border mr-1 animate-in slide-in-from-left-4 duration-200">
            <span className="text-[11px] font-medium text-accent-fg mr-2">
              {selectedRowsCount} selected
            </span>

            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-err/10 text-foreground hover:bg-err/20 text-[11px] font-medium transition-all"
            >
              <Trash2 className="h-3 w-3 text-foreground" />
              Delete
            </button>

            {/* Copy Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCopyDropdown(!showCopyDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${lastCopiedFormat ? "bg-primary/20 text-foreground font-semibold" : "bg-ink/[0.03] text-foreground hover:bg-ink/[0.08]"}`}
              >
                <Copy className="h-3 w-3 text-foreground" />
                {lastCopiedFormat ? `Copied ${lastCopiedFormat}` : "Copy"}
              </button>
              {showCopyDropdown && (
                <div className="absolute top-full mt-2 left-0 z-[100] w-28 bg-card border border-border rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
                  {["CSV", "JSON", "SQL", "PDF", "Markdown"].map((format) => (
                    <button
                      key={format}
                      onClick={() => onCopy(format)}
                      className="flex w-full items-center px-4 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-ink/5 transition-colors"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink/[0.03] text-foreground hover:bg-ink/[0.08] text-[11px] font-medium transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
              {showExportDropdown && (
                <div className="absolute top-full mt-2 left-0 z-[100] w-28 bg-card border border-border rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
                  {["CSV", "JSON", "SQL", "PDF", "Markdown"].map((format) => (
                    <button
                      key={format}
                      onClick={() => onExportSelection(format)}
                      className="flex w-full items-center px-4 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-ink/5 transition-colors"
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
            className={`flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors ${
              activeFiltersCount > 0
                ? "bg-primary/10 border-primary text-foreground"
                : "bg-background border-line-strong text-foreground hover:bg-bg-300"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-primary text-white h-3.5 w-3.5 flex items-center justify-center rounded-full text-[11px] font-medium">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Advanced Filter Popover */}
          {showFilterPopover && (
            <div className="absolute top-full mt-2 right-0 z-[100] w-[450px] bg-card border border-border rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 px-1 text-left">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-foreground">
                    Active Filters
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium tracking-tight">
                    Displaying rows where:
                  </span>
                </div>
                <button
                  onClick={onClearAllFilters}
                  className="text-[11px] font-medium text-muted-foreground hover:text-err transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto thin-scrollbar mb-4">
                {stagedFilters.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-border rounded-xl">
                    <p className="text-[11px] text-subtle">
                      No filters applied
                    </p>
                  </div>
                ) : (
                  stagedFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-ink/[0.02] p-2 rounded-lg group"
                    >
                      <select
                        value={filter.column}
                        onChange={(e) =>
                          onUpdateFilter(index, { column: e.target.value })
                        }
                        className="bg-background border border-line-strong rounded px-2 py-1.5 text-[11px] text-foreground outline-none w-32 focus:border-primary/60"
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
                        className="bg-background border border-line-strong rounded px-2 py-1.5 text-[11px] text-accent-fg outline-none w-28 focus:border-primary/60"
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
                        className="flex-1 bg-background border border-line-strong rounded px-3 py-1.5 text-[11px] text-foreground/80 outline-none disabled:opacity-20 focus:border-primary/60"
                      />

                      <button
                        onClick={() => onRemoveFilter(index)}
                        className="p-1.5 rounded bg-ink/5 text-muted-foreground hover:text-err hover:bg-ink/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  onClick={onAddFilter}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-foreground hover:bg-primary/20 text-[11px] font-medium transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Condition
                </button>
                <button
                  onClick={onApplyFilters}
                  className="px-4 py-1.5 rounded-lg bg-muted text-foreground text-[11px] font-medium hover:bg-ink/10 transition-all"
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
            className="flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-background px-3 text-[13px] font-medium text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:bg-bg-300 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          {showGlobalExportDropdown && (
            <div className="absolute top-full mt-2 right-0 z-[100] w-32 bg-card border border-border rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-1.5 text-[11px] font-medium text-subtle border-b border-border mb-1">
                Table View ({rowsCount})
              </div>
              {["CSV", "JSON", "SQL", "PDF", "Markdown"].map((format) => (
                <button
                  key={format}
                  onClick={() => onExportAll(format)}
                  className="flex w-full items-center px-4 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-ink/5 transition-colors text-left"
                >
                  {format} File
                </button>
              ))}
              <div className="h-px bg-border my-1"></div>
              <button
                onClick={() => onExportAll("modal")}
                className="flex w-full items-center px-4 py-2 text-[11px] font-medium text-accent-fg hover:bg-primary/10 transition-colors text-left"
              >
                Advanced Export...
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onOpenInsertModal}
          className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-white shadow-[0_1px_2px_rgb(67_56_202/0.25)] hover:bg-primary-hover transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Insert Row
        </button>
      </div>
    </div>
  );
};

export default DataTableHeader;
