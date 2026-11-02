import React from "react";
import { ArrowUpDown } from "lucide-react";

interface DataTableFooterProps {
  currentPage: number;
  rowsPerPage: number;
  totalRows: number;
  isLoading: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const DataTableFooter = ({
  currentPage,
  rowsPerPage,
  totalRows,
  isLoading,
  onPrevPage,
  onNextPage,
}: DataTableFooterProps) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startRange = Math.min((currentPage - 1) * rowsPerPage + 1, totalRows);
  const endRange = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <div className="px-6 py-3 border-t border-border bg-bg-200 flex items-center justify-between">
      <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 rounded-md border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-line-strong disabled:opacity-20 translate-y-[-1px] transition-all"
          >
            <ArrowUpDown className="h-3 w-3 rotate-90" />
          </button>
          <span className="min-w-[100px] text-center">
            Page{" "}
            <span className="text-foreground font-semibold">{currentPage}</span>{" "}
            of <span className="text-foreground/80">{totalPages}</span>
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="p-1.5 rounded-md border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-line-strong disabled:opacity-20 translate-y-[-1px] transition-all"
          >
            <ArrowUpDown className="h-3 w-3 -rotate-90" />
          </button>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-muted-foreground">
        <span>
          Showing{" "}
          <span className="text-foreground/80 font-semibold">
            {startRange.toLocaleString()}-{endRange.toLocaleString()}
          </span>{" "}
          of{" "}
          <span className="text-foreground font-semibold">
            {totalRows.toLocaleString()}
          </span>
        </span>
      </div>
    </div>
  );
};

export default DataTableFooter;
