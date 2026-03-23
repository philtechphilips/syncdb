import React, { useState, useEffect } from "react";
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

interface FKTablePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: any) => void;
  referencedTable: string;
  referencedColumn: string;
  clusterId: string;
  selectedValue: any;
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
  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const limit = 100;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch columns first if not loaded
      if (columns.length === 0) {
        const colRes = await api.get(
          `/v1/clusters/${clusterId}/tables/${referencedTable}/columns`,
        );
        setColumns(colRes.data || []);
      }

      // Fetch table data
      const dataRes = await api.get(
        `/v1/clusters/${clusterId}/tables/${referencedTable}`,
        {
          params: { page, limit },
        },
      );

      // Handle paginated response format { data, total, page, limit }
      const records = dataRes.data?.data || dataRes.data || [];
      const total = dataRes.data?.total || records.length || 0;

      setData(records);
      setTotalRows(total);
    } catch (error) {
      console.error("Failed to fetch FK table data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, page, referencedTable]);

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
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-[85vh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                Select from {referencedTable}
              </h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                Target Column: {referencedColumn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${referencedTable}...`}
                className="w-64 bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-900/50 backdrop-blur-sm z-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                Loading Records...
              </span>
            </div>
          ) : null}

          <div className="flex-1 overflow-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">
                    Selection
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.name}
                      className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5"
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredData.map((row, i) => {
                  const isSelected = row[referencedColumn] === selectedValue;
                  return (
                    <tr
                      key={i}
                      onClick={() => onSelect(row[referencedColumn])}
                      className={`group cursor-pointer transition-colors ${isSelected ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-white/[0.03]"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-primary border-primary" : "border-white/10 group-hover:border-white/30"}`}
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
                            className={`text-sm font-medium ${isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}
                          >
                            {row[col.name] === null ? (
                              <span className="text-[10px] font-black text-zinc-700 uppercase italic">
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
                <Search className="h-12 w-12 text-zinc-800" />
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-400">
                    No records found matching your search
                  </p>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
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
                setPage(page - 1);
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all font-black"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 min-w-[40px] text-center">
              <span className="text-xs font-bold text-white">{page}</span>
            </div>
            <button
              type="button"
              disabled={page * limit >= totalRows}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPage(page + 1);
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
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
