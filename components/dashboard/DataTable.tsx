import React, { useState, useEffect, useCallback } from "react";
import {
    Filter,
    ArrowUpDown,
    Download,
    MoreHorizontal,
    Plus,
    Copy,
    Trash2,
    FileJson,
    FileType,
    Database,
    CopyCheck,
    History,
    FileMinus,
    Search,
    X,
    FileSpreadsheet,
    FileText,
    CheckCircle2,
    Table
} from "lucide-react";

interface DataTableProps {
    data?: any[];
    selectedTable?: string;
}

const DataTable = ({ data, selectedTable }: DataTableProps) => {
    const defaultData = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", created: "2024-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active", created: "2024-01-16" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "Inactive", created: "2024-01-17" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "Active", created: "2024-01-18" },
        { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Viewer", status: "Active", created: "2024-01-19" },
    ];
    const [rows, setRows] = useState(data || defaultData);

    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, rowId: number, colName: string, type: 'cell' | 'row' } | null>(null);
    const [activeCell, setActiveCell] = useState<{ rowId: number, colName: string } | null>(null);
    const [filterText, setFilterText] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedTable) return;

        let newData = [];
        switch (selectedTable) {
            case "users":
                newData = defaultData;
                break;
            case "orders":
                newData = [
                    { id: 101, customer: "Company A", total: "$1,200", status: "Paid", date: "2024-02-01" },
                    { id: 102, customer: "Individual B", total: "$450", status: "Pending", date: "2024-02-02" },
                    { id: 103, customer: "Enterprise C", total: "$15,000", status: "Shipped", date: "2024-02-03" },
                ];
                break;
            case "products":
                newData = [
                    { id: 1, sku: "NH-001", name: "Premium Widget", price: "$99.99", stock: 42 },
                    { id: 2, sku: "NH-002", name: "Deluxe Gadget", price: "$149.50", stock: 12 },
                    { id: 3, sku: "NH-003", name: "Standard Tool", price: "$29.00", stock: 156 },
                ];
                break;
            case "analytics":
                newData = [
                    { id: 1, event: "page_view", path: "/home", duration: "1.2s", user_id: "u_94" },
                    { id: 2, event: "click", component: "cta_main", label: "Buy Now", user_id: "u_12" },
                ];
                break;
            case "logs":
                newData = [
                    { id: 1, level: "INFO", message: "System initialized", timestamp: "12:00:01" },
                    { id: 2, level: "WARN", message: "Memory pressure high", timestamp: "12:05:22" },
                    { id: 3, level: "ERROR", message: "Database timeout", timestamp: "12:10:45" },
                ];
                break;
            default:
                newData = defaultData;
        }
        setRows(newData);
        setSelectedRows(new Set());
        setFilterText("");
    }, [selectedTable]);

    const handleContextMenu = (e: React.MouseEvent, rowId: number, colName: string) => {
        e.preventDefault();
        const isRowSelected = selectedRows.has(rowId);

        // Estimate dimensions for smart positioning
        const menuWidth = 256; // w-64
        const menuHeight = isRowSelected ? 220 : 420; // safe estimates for row/cell menus

        let x = e.clientX;
        let y = e.clientY;

        // Flip horizontal if overflow
        if (x + menuWidth > window.innerWidth) {
            x = x - menuWidth;
        }

        // Flip vertical if overflow
        if (y + menuHeight > window.innerHeight) {
            y = y - menuHeight;
        }

        if (isRowSelected) {
            setContextMenu({ x, y, rowId, colName, type: 'row' });
            setActiveCell(null);
        } else {
            setContextMenu({ x, y, rowId, colName, type: 'cell' });
            setActiveCell({ rowId, colName });
        }
    };

    const closeMenu = useCallback(() => {
        setContextMenu(null);
        setActiveCell(null);
    }, []);

    useEffect(() => {
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [closeMenu]);

    const toggleRow = (id: number) => {
        const next = new Set(selectedRows);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedRows(next);
    };

    const toggleAll = () => {
        if (selectedRows.size === rows.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(rows.map(r => r.id)));
        }
    };

    const setAsNull = (rowId: number, colName: string) => {
        if (colName === "id") return;
        setRows(rows.map(r => r.id === rowId ? { ...r, [colName]: "NULL" } : r));
    };

    const deleteRow = (id: number) => {
        setRows(rows.filter(r => r.id !== id));
        const next = new Set(selectedRows);
        next.delete(id);
        setSelectedRows(next);
    };

    const cloneRow = (rowId: number) => {
        const rowToClone = rows.find(r => r.id === rowId);
        if (rowToClone) {
            const newId = Math.max(...rows.map(r => r.id)) + 1;
            const newRow = { ...rowToClone, id: newId };
            const index = rows.findIndex(r => r.id === rowId);
            const nextRows = [...rows];
            nextRows.splice(index + 1, 0, newRow);
            setRows(nextRows);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const filteredRows = rows.filter(row => {
        if (showSelectedOnly && !selectedRows.has(row.id)) return false;
        if (!filterText) return true;
        return Object.values(row).some(val =>
            String(val).toLowerCase().includes(filterText.toLowerCase())
        );
    });

    const copySelectionAsMarkdown = (ids: Set<number>) => {
        const targetRows = rows.filter(r => ids.has(r.id));
        if (targetRows.length === 0) return "";
        const cols = Object.keys(targetRows[0]);
        const header = `| ${cols.join(" | ")} |`;
        const divider = `| ${cols.map(() => "---").join(" | ")} |`;
        const body = targetRows.map(r => `| ${cols.map(c => r[c]).join(" | ")} |`).join("\n");
        return `${header}\n${divider}\n${body}`;
    };

    const copyRowAsMarkdown = (row: any) => {
        const cols = Object.keys(row);
        const header = `| ${cols.join(" | ")} |`;
        const divider = `| ${cols.map(() => "---").join(" | ")} |`;
        const body = `| ${cols.map(c => row[c]).join(" | ")} |`;
        return `${header}\n${divider}\n${body}`;
    };

    const convertToCSV = (data: any[]) => {
        if (data.length === 0) return "";
        const cols = Object.keys(data[0]);
        const header = cols.join(",");
        const body = data.map(r => cols.map(c => `"${r[c]}"`).join(",")).join("\n");
        return `${header}\n${body}`;
    };

    const handleExport = (format: 'json' | 'markdown' | 'csv' | 'sql', onlySelected: boolean) => {
        const dataToExport = onlySelected ? rows.filter(r => selectedRows.has(r.id)) : rows;
        let content = "";

        switch (format) {
            case 'json':
                content = JSON.stringify(dataToExport, null, 2);
                break;
            case 'markdown':
                content = copySelectionAsMarkdown(new Set(dataToExport.map(r => r.id)));
                break;
            case 'csv':
                content = convertToCSV(dataToExport);
                break;
            case 'sql':
                // Simple insert statement generator
                const tableName = "exported_data";
                const cols = Object.keys(dataToExport[0]).join(", ");
                content = dataToExport.map(r => {
                    const vals = Object.values(r).map(v => typeof v === 'string' ? `'${v}'` : v).join(", ");
                    return `INSERT INTO ${tableName} (${cols}) VALUES (${vals});`;
                }).join("\n");
                break;
        }

        copyToClipboard(content);
        setExportSuccess(format);
        setTimeout(() => {
            setExportSuccess(null);
            setShowExportModal(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-background font-sans min-w-0 overflow-hidden relative">
            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-[100] w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in duration-100"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5 mb-1.5 flex justify-between items-center">
                        <span>{contextMenu.type === 'cell' ? 'Targeted Node' : 'Batch Actions'}</span>
                        {contextMenu.type === 'row' && (
                            <span className="text-primary/50 text-[8px] font-black uppercase tracking-widest">{selectedRows.size} Selected</span>
                        )}
                    </div>

                    {contextMenu.type === 'cell' ? (
                        <>
                            {/* Cell Specific */}
                            <button
                                disabled={contextMenu.colName === "id"}
                                onClick={() => { setAsNull(contextMenu.rowId, contextMenu.colName); closeMenu(); }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <FileMinus className="h-4 w-4 text-zinc-500" />
                                Set cell as Null
                            </button>
                            <button onClick={() => { copyToClipboard(rows.find(r => r.id === contextMenu.rowId)?.[contextMenu.colName]?.toString() || ""); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <Copy className="h-4 w-4 text-zinc-500" />
                                Copy Cell Value
                            </button>
                            <button onClick={() => { setFilterText(rows.find(r => r.id === contextMenu.rowId)?.[contextMenu.colName]?.toString() || ""); setIsFilterVisible(true); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <Filter className="h-4 w-4 text-zinc-500" />
                                Filter by this value
                            </button>
                            <button onClick={() => { copyToClipboard(contextMenu.colName); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileType className="h-4 w-4 text-zinc-500" />
                                Copy Column Name
                            </button>

                            <div className="h-px bg-white/5 my-1.5"></div>
                            <div className="px-3 py-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">Row Options</div>

                            <button onClick={() => { copyToClipboard(JSON.stringify(rows.find(r => r.id === contextMenu.rowId))); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileJson className="h-4 w-4 text-zinc-500" />
                                Copy Row as JSON
                            </button>
                            <button onClick={() => { copyToClipboard(copyRowAsMarkdown(rows.find(r => r.id === contextMenu.rowId))); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileType className="h-4 w-4 text-zinc-500" />
                                Copy Row as Markdown
                            </button>
                            <button onClick={() => { closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <Database className="h-4 w-4 text-zinc-500" />
                                Copy Row as SQL
                            </button>

                            <div className="h-px bg-white/5 my-1.5"></div>

                            <button onClick={() => { cloneRow(contextMenu.rowId); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <Plus className="h-4 w-4 text-zinc-500" />
                                Clone Row
                            </button>
                            <button onClick={() => { deleteRow(contextMenu.rowId); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-all">
                                <Trash2 className="h-4 w-4" />
                                Delete Row
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { copyToClipboard(JSON.stringify(rows.filter(r => selectedRows.has(r.id)))); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileJson className="h-4 w-4 text-zinc-500" />
                                Copy Selection as JSON
                            </button>
                            <button onClick={() => { copyToClipboard(copySelectionAsMarkdown(selectedRows)); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileType className="h-4 w-4 text-zinc-500" />
                                Copy Selection as Markdown
                            </button>
                            <button onClick={() => { closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <Database className="h-4 w-4 text-zinc-500" />
                                Copy Selection as SQL
                            </button>

                            <div className="h-px bg-white/5 my-1.5"></div>

                            <button
                                onClick={() => {
                                    selectedRows.forEach(id => deleteRow(id));
                                    closeMenu();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete {selectedRows.size} Selected Rows
                            </button>

                            <div className="h-px bg-white/5 my-1.5"></div>

                            <button
                                onClick={() => { setShowSelectedOnly(true); closeMenu(); }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all"
                            >
                                <Filter className="h-4 w-4 text-zinc-500" />
                                Filter for Selected Rows
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Export Data</h3>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Select your preferred format</p>
                            </div>
                            <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-2 gap-3">
                            {[
                                { id: 'json', label: 'JSON', icon: FileJson, desc: 'JavaScript Object Notation' },
                                { id: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Comma Separated Values' },
                                { id: 'markdown', label: 'Markdown', icon: FileText, desc: 'GitHub Flavored Table' },
                                { id: 'sql', label: 'SQL', icon: Database, desc: 'SQL Insert Statements' },
                            ].map((format) => (
                                <button
                                    key={format.id}
                                    onClick={() => handleExport(format.id as any, selectedRows.size > 0 && showSelectedOnly)}
                                    className="flex flex-col items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 transition-all text-left group"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                        <format.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{format.label}</span>
                                            {exportSuccess === format.id && (
                                                <CheckCircle2 className="h-3.5 w-3.5 text-primary animate-in zoom-in" />
                                            )}
                                        </div>
                                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight mt-0.5">{format.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${selectedRows.size > 0 ? 'bg-primary' : 'bg-zinc-700'}`}></div>
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    {selectedRows.size > 0 ? `${selectedRows.size} Rows Selected` : 'Full Dataset'}
                                </span>
                            </div>
                            {selectedRows.size > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase">Export Selection Only</span>
                                    <input
                                        type="checkbox"
                                        checked={showSelectedOnly}
                                        onChange={(e) => setShowSelectedOnly(e.target.checked)}
                                        className="accent-primary w-3.5 h-3.5"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Table Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#021016]/30">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Table className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {selectedTable || "Query Results"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <History className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{rows.length} rows returned</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {selectedRows.size > 0 && (
                        <div className="flex items-center gap-3 pr-3 border-r border-white/5 mr-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedRows.size} selected</span>
                            <button onClick={() => deleteRow(Array.from(selectedRows)[0])} className="p-1 text-zinc-500 hover:text-red-400">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                    {isFilterVisible ? (
                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 animate-in slide-in-from-right-4 duration-200">
                            <Search className="h-3.5 w-3.5 text-zinc-500" />
                            <input
                                type="text"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                placeholder="Filter results..."
                                className="bg-transparent border-none outline-none text-[11px] font-bold text-white placeholder:text-zinc-600 w-32"
                                autoFocus
                            />
                            {(filterText || showSelectedOnly) && (
                                <button
                                    onClick={() => { setFilterText(""); setShowSelectedOnly(false); }}
                                    className="p-1 hover:bg-white/10 rounded text-primary"
                                    title="Clear all filters"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                            <button onClick={() => { setFilterText(""); setIsFilterVisible(false); }} className="hover:text-white text-zinc-600 transition-colors pl-1 border-l border-white/5">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsFilterVisible(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-black text-zinc-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest"
                        >
                            <Filter className="h-3 w-3" />
                            Filter
                        </button>
                    )}
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-black text-zinc-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest"
                    >
                        <Download className="h-3 w-3" />
                        Export
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto scrollbar-hide">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-[#021016]/50 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                            <th className="px-6 py-4 w-12 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.size === rows.length && rows.length > 0}
                                    onChange={toggleAll}
                                    className="accent-primary w-3.5 h-3.5 rounded border-white/10 bg-white/5"
                                />
                            </th>
                            {rows.length > 0 && Object.keys(rows[0]).map((col) => (
                                <th key={col} className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-white/5 last:border-0 cursor-default hover:text-zinc-300 transition-colors">
                                    <div className="flex items-center gap-2">
                                        {col}
                                        <ArrowUpDown className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {filteredRows.map((row) => (
                            <tr
                                key={row.id}
                                className={`group hover:bg-white/[0.015] transition-colors ${selectedRows.has(row.id) ? 'bg-primary/5' : ''}`}
                            >
                                <td className="px-6 py-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(row.id)}
                                        onChange={() => toggleRow(row.id)}
                                        className="accent-primary w-3.5 h-3.5 rounded border-white/10 bg-white/5"
                                    />
                                </td>
                                {Object.keys(row).map((col) => (
                                    <td
                                        key={col}
                                        onContextMenu={(e) => handleContextMenu(e, row.id, col)}
                                        className={`px-6 py-4 text-xs font-medium border-r border-white/[0.02] last:border-0 relative transition-all ${col === "id" ? 'font-mono text-zinc-600' : 'text-zinc-400'
                                            } ${row[col] === "NULL" ? 'italic text-zinc-700' : ''} ${activeCell?.rowId === row.id && activeCell?.colName === col
                                                ? 'outline outline-1 outline-primary/50 bg-primary/[0.02] z-20 shadow-[0_0_15px_rgba(0,237,100,0.1)]'
                                                : ''
                                            }`}
                                    >
                                        {col === "status" ? (
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${row[col] === 'Active' ? 'bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]' : 'bg-zinc-800'}`}></div>
                                                <span className={`${row[col] === 'Active' ? 'text-zinc-300' : 'text-zinc-600'}`}>{row[col]}</span>
                                            </div>
                                        ) : row[col]}
                                    </td>
                                ))}
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

            {/* Pagination Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-[#021016]/30 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-md border border-white/5 bg-white/[0.02] text-zinc-700 disabled:opacity-20 translate-y-[-1px]" disabled>
                            <ArrowUpDown className="h-3 w-3 rotate-90" />
                        </button>
                        <span>Page 1 of 1</span>
                        <button className="p-1.5 rounded-md border border-white/5 bg-white/[0.02] text-zinc-700 disabled:opacity-20 translate-y-[-1px]" disabled>
                            <ArrowUpDown className="h-3 w-3 -rotate-90" />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => {
                        const newId = Math.max(...rows.map(r => r.id)) + 1;
                        setRows([...rows, { id: newId, name: "New User", email: "user@example.com", role: "Contributor", status: "Inactive", created: new Date().toISOString().split('T')[0] }]);
                    }}
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,237,100,0.1)] transition-all uppercase tracking-widest"
                >
                    <Plus className="h-3 w-3" />
                    New Row
                </button>
            </div>
        </div>
    );
};

export default DataTable;
