import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  Loader2,
  Database,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import api from "@/lib/api";

interface Column {
  name: string;
  type: string;
}

interface FKTablePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string | number | boolean | null) => void;
  referencedTable: string;
  referencedColumn: string;
  clusterId: string;
  selectedValue: string | number | boolean | null;
}

const FKTablePickerModal = ({
  isOpen,
  onClose,
  onSelect,
  referencedTable,
  referencedColumn,
  clusterId,
  selectedValue,
}: FKTablePickerModalProps) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const limit = 100;

  // Loading starts true and is set again by the page buttons, so the
  // effect below only does async work.
  const fetchData = useCallback(() => {
    // Fetch columns first if not loaded, then the page of rows.
    const columnsRequest =
      columns.length === 0
        ? api
            .get(`/v1/clusters/${clusterId}/tables/${referencedTable}/columns`)
            .then((colRes) => setColumns(colRes.data || []))
        : Promise.resolve();
    return columnsRequest
      .then(() =>
        api.get(`/v1/clusters/${clusterId}/tables/${referencedTable}`, {
          params: { page, limit },
        }),
      )
      .then((dataRes) => {
        // Paginated response format { data, total, page, limit }
        const records = dataRes.data?.data || dataRes.data || [];
        setData(records);
        setTotalRows(dataRes.data?.total || records.length || 0);
      })
      .catch((error) => console.error("Failed to fetch FK table data:", error))
      .finally(() => setIsLoading(false));
  }, [clusterId, columns.length, page, referencedTable]);

  useEffect(() => {
    if (isOpen) void fetchData();
  }, [isOpen, fetchData]);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-[85vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-ink/[0.02]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Database className="h-5 w-5 text-accent-fg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                Select from {referencedTable}
              </h3>
              <p className="text-[11px] text-subtle">
                Target Column: {referencedColumn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${referencedTable}...`}
                className="w-64 bg-background border border-line-strong rounded-md pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-subtle outline-none focus:border-primary/60 transition-all"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-ink/5 text-subtle hover:text-foreground transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-[2px] z-10">
              <Loader2 className="h-8 w-8 text-accent-fg animate-spin" />
              <span className="text-xs font-medium text-subtle">
                Loading Records...
              </span>
            </div>
          ) : null}

          <div className="flex-1 overflow-auto thin-scrollbar">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 z-20 bg-card/95 backdrop-blur-md shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-medium text-subtle border-b border-border">
                    Selection
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.name}
                      className="px-6 py-4 text-[11px] font-medium text-subtle border-b border-border"
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((row, i) => {
                  const isSelected =
                    row[referencedColumn] === (selectedValue as unknown);
                  return (
                    <tr
                      key={i}
                      onClick={() =>
                        onSelect(
                          row[referencedColumn] as
                            | string
                            | number
                            | boolean
                            | null,
                        )
                      }
                      className={`group cursor-pointer transition-colors ${isSelected ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-ink/[0.03]"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-primary border-primary" : "border-border group-hover:border-line-strong"}`}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-primary-foreground stroke-[4]" />
                          )}
                        </div>
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.name}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          <span
                            className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                          >
                            {row[col.name] === null ? (
                              <span className="text-[11px] font-medium text-subtle/70 italic">
                                NULL
                              </span>
                            ) : (
                              String(row[col.name])
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredData.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Search className="h-12 w-12 text-subtle/50" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No records found matching your search
                  </p>
                  <p className="text-[11px] text-subtle mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-border bg-ink/[0.01] flex items-center justify-between">
          <p className="text-[11px] text-subtle">
            Showing page {page} of {Math.ceil(totalRows / limit) || 1} (
            {totalRows} records)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLoading(true);
                setPage(page - 1);
              }}
              className="p-2 rounded-lg bg-ink/5 border border-border text-muted-foreground hover:text-foreground hover:bg-ink/10 disabled:opacity-20 transition-all font-semibold"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 bg-ink/5 rounded-lg border border-border min-w-[40px] text-center">
              <span className="text-xs font-medium text-foreground">
                {page}
              </span>
            </div>
            <button
              type="button"
              disabled={page * limit >= totalRows}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLoading(true);
                setPage(page + 1);
              }}
              className="p-2 rounded-lg bg-ink/5 border border-border text-muted-foreground hover:text-foreground hover:bg-ink/10 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FKTablePickerModal;
