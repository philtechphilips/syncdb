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
    onNextPage
}: DataTableFooterProps) => {
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
    const startRange = Math.min(((currentPage - 1) * rowsPerPage) + 1, totalRows);
    const endRange = Math.min(currentPage * rowsPerPage, totalRows);

    return (
        <div className="px-6 py-3 border-t border-white/5 bg-[#021016]/30 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onPrevPage}
                        disabled={currentPage <= 1 || isLoading}
                        className="p-1.5 rounded-md border border-white/5 bg-zinc-900/50 text-zinc-500 hover:text-white hover:border-white/20 disabled:opacity-20 translate-y-[-1px] transition-all"
                    >
                        <ArrowUpDown className="h-3 w-3 rotate-90" />
                    </button>
                    <span className="min-w-[100px] text-center">
                        Page <span className="text-white font-black">{currentPage}</span> of <span className="text-zinc-300">{totalPages}</span>
                    </span>
                    <button 
                        onClick={onNextPage}
                        disabled={currentPage >= totalPages || isLoading}
                        className="p-1.5 rounded-md border border-white/5 bg-zinc-900/50 text-zinc-500 hover:text-white hover:border-white/20 disabled:opacity-20 translate-y-[-1px] transition-all"
                    >
                        <ArrowUpDown className="h-3 w-3 -rotate-90" />
                    </button>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">
                <span>
                    Showing <span className="text-zinc-300 font-bold">{startRange.toLocaleString()}-{endRange.toLocaleString()}</span> of <span className="text-white font-black">{totalRows.toLocaleString()}</span>
                </span>
            </div>
        </div>
    );
};

export default DataTableFooter;
