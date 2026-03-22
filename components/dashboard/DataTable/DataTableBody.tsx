import React from "react";
import { ArrowUpDown, Maximize2, MoreHorizontal } from "lucide-react";

interface DataTableBodyProps {
    rows: any[];
    filteredRows: any[];
    selectedRows: Set<any>;
    onToggleRow: (id: any) => void;
    onToggleAll: () => void;
    onOpenUpdateModal: (row: any) => void;
    onContextMenu: (e: React.MouseEvent, rowId: number, colName: string) => void;
    editingCell: { rowId: any, colName: string, value: string } | null;
    onStartEdit: (rowId: any, colName: string, value: string) => void;
    onEditValueChange: (val: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    activeCell: { rowId: number, colName: string } | null;
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
    activeCell
}: DataTableBodyProps) => {
    return (
        <div className="flex-1 overflow-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-[#021016]/80 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                        <th className="px-6 py-4 w-12 text-center">
                            <input
                                type="checkbox"
                                checked={selectedRows.size === rows.length && rows.length > 0}
                                onChange={onToggleAll}
                                className="accent-primary w-3.5 h-3.5 rounded border-white/20 bg-white/5"
                            />
                        </th>
                        {rows.length > 0 && Object.keys(rows[0]).map((col) => (
                            <th key={col} className="px-6 py-4 text-[10px] font-black text-zinc-300 tracking-widest border-r border-white/10 last:border-0 cursor-default hover:text-white transition-colors">
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
                    {filteredRows.map((row) => (
                        <tr
                            key={row.id}
                            className={`group bg-white/[0.02] hover:bg-white/[0.05] border-l-2 border-transparent hover:border-l-primary/40 transition-all ${selectedRows.has(row.id) ? 'bg-primary/[0.04] border-l-primary' : ''}`}
                        >
                            <td className="px-6 py-4 w-12 text-center">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(row.id)}
                                        onChange={() => onToggleRow(row.id)}
                                        className="accent-primary w-3.5 h-3.5 rounded border-white/10 bg-white/5"
                                    />
                                    <button
                                        onClick={() => onOpenUpdateModal(row)}
                                        className="p-1 rounded opacity-0 group-hover:opacity-100 bg-white/5 text-zinc-500 hover:text-white hover:bg-primary/20 transition-all border border-transparent hover:border-primary/20"
                                        title="Update Row"
                                    >
                                        <Maximize2 className="h-2.5 w-2.5" />
                                    </button>
                                </div>
                            </td>
                            {Object.keys(row).map((col) => {
                                const isEditing = editingCell?.rowId === row.id && editingCell?.colName === col;
                                return (
                                    <td
                                        key={col}
                                        onContextMenu={(e) => onContextMenu(e, row.id, col)}
                                        onDoubleClick={() => col !== "id" && onStartEdit(row.id, col, String(row[col]))}
                                        className={`px-6 py-4 text-xs font-medium border-r border-white/[0.02] last:border-0 relative transition-all ${col === "id" ? 'font-mono text-zinc-500' : 'text-zinc-300'
                                            } ${row[col] === "NULL" ? 'italic text-zinc-600' : ''} ${activeCell?.rowId === row.id && activeCell?.colName === col
                                                ? 'outline outline-1 outline-primary/50 bg-primary/[0.02] z-20 shadow-[0_0_15px_rgba(0,237,100,0.1)]'
                                                : ''
                                            }`}
                                    >
                                        {isEditing ? (
                                            <div className="absolute inset-0 z-50 bg-zinc-900 border-2 border-primary shadow-2xl rounded-md flex items-center p-1 animate-in zoom-in-95 duration-150">
                                                <textarea
                                                    autoFocus
                                                    className="w-full h-full bg-transparent border-none outline-none text-[11px] font-medium text-white resize-none scrollbar-hide py-1.5 px-3 leading-relaxed"
                                                    value={editingCell?.value}
                                                    onChange={(e) => onEditValueChange(e.target.value)}
                                                    onBlur={onSaveEdit}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            onSaveEdit();
                                                        }
                                                        if (e.key === 'Escape') {
                                                            onCancelEdit();
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : col === "status" ? (
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${row[col] === 'Active' ? 'bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]' : 'bg-zinc-700'}`}></div>
                                                <span className={`${row[col] === 'Active' ? 'text-zinc-200' : 'text-zinc-500'}`}>{row[col]}</span>
                                            </div>
                                        ) : (
                                            <span className="line-clamp-2">
                                                {typeof row[col] === 'object' ? JSON.stringify(row[col]) : (
                                                    String(row[col]).length > 70 ? `${String(row[col]).substring(0, 70)}...` : row[col]
                                                )}
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTableBody;
