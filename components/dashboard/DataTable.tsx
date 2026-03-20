import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
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
import { downloadFile, formatData } from '@/lib/exportUtils';
import { useClusterStore } from "@/store/useClusterStore";
import { applyFilters, cloneTableRow, deleteTableRow } from "@/lib/tableUtils";
import { calculateContextMenuPosition, copyToClipboard } from "@/lib/uiUtils";

interface DataTableProps {
    data?: any[];
    selectedTable?: string;
}

const DataTable = ({ data, selectedTable }: DataTableProps) => {
    const { 
        selectedCluster, 
        fetchTableData, 
        updateRow, 
        tableData, 
        isDataLoading: isLoading,
        fetchTableColumns,
        insertRow,
        deleteRows
    } = useClusterStore();
    const [rows, setRows] = useState(tableData);
    const [editingCell, setEditingCell] = useState<{ rowId: any, colName: string, value: string } | null>(null);

    const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, rowId: number, colName: string, type: 'cell' | 'row' } | null>(null);
    const [activeCell, setActiveCell] = useState<{ rowId: number, colName: string } | null>(null);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    const [showCopyDropdown, setShowCopyDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showGlobalExportDropdown, setShowGlobalExportDropdown] = useState(false);
    const [lastCopiedFormat, setLastCopiedFormat] = useState<string | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);

    // Insert Row State
    const [showInsertModal, setShowInsertModal] = useState(false);
    const [tableColumns, setTableColumns] = useState<any[]>([]);
    const [isInserting, setIsInserting] = useState(false);

    // Advanced Filtering
    const [activeFilters, setActiveFilters] = useState<{ column: string, operator: string, value: string }[]>([]);
    const [showFilterPopover, setShowFilterPopover] = useState(false);

    useEffect(() => {
        if (!selectedTable || !selectedCluster) return;
        fetchTableData(selectedCluster.id, selectedTable);
    }, [selectedTable, selectedCluster, fetchTableData]);

    useEffect(() => {
        setRows(tableData);
        setSelectedRows(new Set());
        setActiveFilters([]);
    }, [tableData]);

    const handleContextMenu = (e: React.MouseEvent, rowId: number, colName: string) => {
        e.preventDefault();
        const isRowSelected = selectedRows.has(rowId);
        const { x, y } = calculateContextMenuPosition(e.clientX, e.clientY, isRowSelected);

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

    const deleteRow = async (id: any) => {
        if (!selectedCluster || !selectedTable) return;
        
        // Find row to get identifying keys (currently assuming 'id')
        const rowToDelete = rows.find(r => r.id === id);
        if (!rowToDelete) return;

        try {
            await deleteRows(selectedCluster.id, selectedTable, { id: id });
            setRows(deleteTableRow(rows, id));
            const next = new Set(selectedRows);
            next.delete(id);
            setSelectedRows(next);
            toast.success("Row deleted successfully");
        } catch (error) {
            console.error('Failed to delete row:', error);
        }
    };

    const cloneRow = (rowId: number) => {
        setRows(cloneTableRow(rows, rowId));
    };

    const copyToClipboardAction = (text: string) => {
        copyToClipboard(text);
    };

    const filteredRows = applyFilters(rows, activeFilters, showSelectedOnly, selectedRows);

    const addFilter = () => {
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        if (columns.length === 0) return;
        setActiveFilters([...activeFilters, { column: columns[0], operator: 'contains', value: '' }]);
    };

    const removeFilter = (index: number) => {
        setActiveFilters(activeFilters.filter((_, i) => i !== index));
    };

    const updateFilterRule = (index: number, updates: Partial<{ column: string, operator: string, value: string }>) => {
        setActiveFilters(activeFilters.map((f, i) => i === index ? { ...f, ...updates } : f));
    };


    const handleCopy = (format: string, dataToProcess: any[] = rows.filter(r => selectedRows.has(r.id))) => {
        const content = formatData(format, dataToProcess, selectedTable || 'table');
        
        copyToClipboard(content);
        setLastCopiedFormat(format.toUpperCase());
        setTimeout(() => setLastCopiedFormat(null), 2000);
        setShowCopyDropdown(false);
    };

    const handleExport = (format: string, dataToProcess: any[] = filteredRows) => {
        const content = formatData(format, dataToProcess, selectedTable || 'table');
        const subName = selectedRows.size > 0 ? 'selection' : 'filtered';
        downloadFile(content, `${selectedTable || 'export'}_${subName}.${format.toLowerCase()}`);
        
        setShowExportDropdown(false);
        setShowGlobalExportDropdown(false);
        setShowExportModal(false);
    };

    const handleSave = async () => {
        if (!editingCell || !selectedCluster || !selectedTable) return;

        const { rowId, colName, value } = editingCell;
        
        try {
            await updateRow(selectedCluster.id, selectedTable, { [colName]: value }, { id: rowId });
            setEditingCell(null);
            toast.success("Cell updated");
        } catch (error) {
            console.error('Failed to update cell:', error);
        }
    };

    const handleOpenInsertModal = async () => {
        if (!selectedCluster || !selectedTable) return;
        setShowInsertModal(true);
        try {
            const columns = await fetchTableColumns(selectedCluster.id, selectedTable);
            setTableColumns(columns);
        } catch (error) {
            console.error('Failed to fetch columns:', error);
        }
    };

    const handleInsert = async (formData: any) => {
        if (!selectedCluster || !selectedTable) return;
        setIsInserting(true);
        try {
            await insertRow(selectedCluster.id, selectedTable, formData);
            setShowInsertModal(false);
            toast.success("New row inserted successfully");
        } catch (error) {
            console.error('Insert failed:', error);
        } finally {
            setIsInserting(false);
        }
    };

    if (!selectedTable) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-zinc-600 gap-4 animate-in fade-in duration-1000">
                <div className="p-8 rounded-full bg-white/[0.01] border border-white/5 relative group">
                    <Table className="h-16 w-16 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Database Explorer Ready</p>
                    <p className="text-[11px] font-medium text-zinc-400 max-w-[200px] leading-relaxed mx-auto">Select a table from the sidebar to begin exploring your data.</p>
                </div>
            </div>
        );
    }

    if (isLoading && tableData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-zinc-600 gap-6">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-t-2 border-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Database className="h-4 w-4 text-primary opacity-50" />
                    </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 animate-pulse">Syncing Connection...</p>
            </div>
        );
    }

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
                            <button onClick={() => { 
                                const val = rows.find(r => r.id === contextMenu.rowId)?.[contextMenu.colName]?.toString() || "";
                                setActiveFilters([...activeFilters, { column: contextMenu.colName, operator: 'is', value: val }]);
                                setShowFilterPopover(true);
                                closeMenu(); 
                            }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <Filter className="h-4 w-4 text-zinc-500" />
                                Filter by this value
                            </button>
                            <button onClick={() => { copyToClipboard(contextMenu.colName); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileType className="h-4 w-4 text-zinc-500" />
                                Copy Column Name
                            </button>

                            <div className="h-px bg-white/5 my-1.5"></div>
                            <div className="px-3 py-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">Row Options</div>

                            <button onClick={() => { handleCopy('JSON', [rows.find(r => r.id === contextMenu.rowId)]); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileJson className="h-4 w-4 text-zinc-500" />
                                Copy Row as JSON
                            </button>
                            <button onClick={() => { handleCopy('CSV', [rows.find(r => r.id === contextMenu.rowId)]); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileType className="h-4 w-4 text-zinc-500" />
                                Copy Row as CSV
                            </button>
                            <button onClick={() => { handleCopy('SQL', [rows.find(r => r.id === contextMenu.rowId)]); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
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
                            <button onClick={() => { handleCopy('JSON'); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileJson className="h-4 w-4 text-zinc-500" />
                                Copy Selection as JSON
                            </button>
                            <button onClick={() => { handleCopy('CSV'); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
                                <FileType className="h-4 w-4 text-zinc-500" />
                                Copy Selection as CSV
                            </button>
                            <button onClick={() => { handleCopy('SQL'); closeMenu(); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white rounded-md transition-all">
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
                                    onClick={() => handleExport(
                                        format.id, 
                                        (selectedRows.size > 0 && showSelectedOnly) 
                                            ? rows.filter(r => selectedRows.has(r.id)) 
                                            : filteredRows
                                    )}
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
                        <span className="text-[10px] font-black text-white tracking-widest">
                            {selectedTable || "Query Results"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <History className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{rows.length} rows returned</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {selectedRows.size > 0 && (
                        <div className="flex items-center gap-2 pr-3 border-r border-white/5 mr-1 animate-in slide-in-from-left-4 duration-200">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest mr-2">{selectedRows.size} selected</span>
                            
                            <button 
                                onClick={() => deleteRow(Array.from(selectedRows)[0])} 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                                <Trash2 className="h-3 w-3" />
                                Delete
                            </button>

                            {/* Copy Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowCopyDropdown(!showCopyDropdown)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${lastCopiedFormat ? 'bg-primary/20 text-primary' : 'bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white'}`}
                                >
                                    <Copy className="h-3 w-3" />
                                    {lastCopiedFormat ? `Copied ${lastCopiedFormat}` : 'Copy'}
                                </button>
                                {showCopyDropdown && (
                                    <div className="absolute top-full mt-2 left-0 z-[100] w-28 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
                                        {['CSV', 'JSON', 'SQL'].map((format) => (
                                            <button
                                                key={format}
                                                onClick={() => handleCopy(format)}
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
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                                >
                                    <Download className="h-3 w-3" />
                                    Export
                                </button>
                                {showExportDropdown && (
                                    <div className="absolute top-full mt-2 left-0 z-[100] w-28 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
                                        {['CSV', 'JSON', 'SQL'].map((format) => (
                                            <button
                                                key={format}
                                                onClick={() => handleExport(format, rows.filter(r => selectedRows.has(r.id)))}
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
                                activeFilters.length > 0 
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,237,100,0.1)]' 
                                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                            }`}
                        >
                            <Filter className="h-3 w-3" />
                            Filters
                            {activeFilters.length > 0 && (
                                <span className="ml-1 bg-primary text-primary-foreground h-3.5 w-3.5 flex items-center justify-center rounded-full text-[8px] font-black">
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>

                        {/* Advanced Filter Popover */}
                        {showFilterPopover && (
                            <div className="absolute top-full mt-2 right-0 z-[100] w-[450px] bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Filters</span>
                                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight">Displaying rows where:</span>
                                    </div>
                                    <button 
                                        onClick={() => setActiveFilters([])}
                                        className="text-[9px] font-black text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide mb-4">
                                    {activeFilters.length === 0 ? (
                                        <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">No filters applied</p>
                                        </div>
                                    ) : (
                                        activeFilters.map((filter, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-white/[0.02] p-2 rounded-lg group">
                                                <select 
                                                    value={filter.column}
                                                    onChange={(e) => updateFilterRule(index, { column: e.target.value })}
                                                    className="bg-zinc-800 border-none rounded px-2 py-1.5 text-[11px] font-bold text-zinc-200 focus:ring-1 focus:ring-primary outline-none w-32"
                                                >
                                                    {Object.keys(rows[0] || {}).map(col => (
                                                        <option key={col} value={col}>{col}</option>
                                                    ))}
                                                </select>

                                                <select 
                                                    value={filter.operator}
                                                    onChange={(e) => updateFilterRule(index, { operator: e.target.value })}
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
                                                    disabled={filter.operator.includes('null')}
                                                    value={filter.value}
                                                    onChange={(e) => updateFilterRule(index, { value: e.target.value })}
                                                    placeholder="Value..."
                                                    className="flex-1 bg-zinc-800 border-none rounded px-3 py-1.5 text-[11px] font-bold text-zinc-300 focus:ring-1 focus:ring-primary outline-none disabled:opacity-20"
                                                />

                                                <button 
                                                    onClick={() => removeFilter(index)}
                                                    className="p-1.5 rounded bg-white/5 text-zinc-500 hover:text-red-400 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <button 
                                        onClick={addFilter}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add Condition
                                    </button>
                                    <button 
                                        onClick={() => setShowFilterPopover(false)}
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
                            onClick={() => setShowGlobalExportDropdown(!showGlobalExportDropdown)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] text-[10px] font-black text-zinc-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest"
                        >
                            <Download className="h-3 w-3" />
                            Export
                        </button>
                        {showGlobalExportDropdown && (
                            <div className="absolute top-full mt-2 right-0 z-[100] w-32 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-4 py-1.5 text-[8px] font-black text-zinc-600 uppercase tracking-tighter border-b border-white/5 mb-1">
                                    Table View ({filteredRows.length})
                                </div>
                                {['CSV', 'JSON', 'SQL'].map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => handleExport(format, filteredRows)}
                                        className="flex w-full items-center px-4 py-2 text-[9px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase"
                                    >
                                        {format} File
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleOpenInsertModal}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,237,100,0.1)] transition-all uppercase tracking-widest"
                    >
                        <Plus className="h-3 w-3" />
                        Insert Row
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
                                <th key={col} className="px-6 py-4 text-[10px] font-black text-zinc-400 tracking-widest border-r border-white/5 last:border-0 cursor-default hover:text-zinc-200 transition-colors">
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
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(row.id)}
                                        onChange={() => toggleRow(row.id)}
                                        className="accent-primary w-3.5 h-3.5 rounded border-white/10 bg-white/5"
                                    />
                                </td>
                                {Object.keys(row).map((col) => {
                                    const isEditing = editingCell?.rowId === row.id && editingCell?.colName === col;
                                    return (
                                        <td
                                            key={col}
                                            onContextMenu={(e) => handleContextMenu(e, row.id, col)}
                                            onDoubleClick={() => col !== "id" && setEditingCell({ rowId: row.id, colName: col, value: String(row[col]) })}
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
                                                        onChange={(e) => setEditingCell({ ...editingCell!, value: e.target.value })}
                                                        onBlur={handleSave}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSave();
                                                            }
                                                            if (e.key === 'Escape') {
                                                                setEditingCell(null);
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

            {/* Insert Row Modal */}
            {showInsertModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-xl h-full bg-[#021016] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <Plus className="h-5 w-5 text-primary" />
                                    Insert New Row
                                </h3>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Adding to <span className="text-white">{selectedTable}</span></p>
                            </div>
                            <button onClick={() => setShowInsertModal(false)} className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all group">
                                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
                            {tableColumns.length === 0 ? (
                                <div className="space-y-4">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="h-16 bg-white/[0.02] rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <form id="insert-form" className="space-y-6" onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data: any = {};
                                    tableColumns.forEach(col => {
                                        const val = formData.get(col.name);
                                        if (val !== "" && val !== null) data[col.name] = val;
                                    });
                                    handleInsert(data);
                                }}>
                                    {tableColumns.map((col) => (
                                        <div key={col.name} className="space-y-2 group">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-primary transition-colors">
                                                    {col.name}
                                                    {col.nullable === 'NO' && col.columnKey !== 'PRI' && <span className="text-red-500">*</span>}
                                                </label>
                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter bg-white/5 px-1.5 py-0.5 rounded">
                                                    {col.type}
                                                </span>
                                            </div>
                                            <input
                                                name={col.name}
                                                type={col.type.includes('int') ? 'number' : 'text'}
                                                placeholder={col.defaultValue || (col.nullable === 'YES' ? 'NULL' : `Enter ${col.name}...`)}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                                disabled={col.columnKey === 'PRI' && col.defaultValue?.includes('nextval') || col.name === 'id'}
                                            />
                                            {col.columnKey === 'PRI' && (
                                                <p className="text-[8px] text-primary/50 font-black uppercase tracking-widest pt-1">Primary Key (Auto-generated)</p>
                                            )}
                                        </div>
                                    ))}
                                </form>
                            )}
                        </div>

                        <div className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-end gap-4">
                            <button 
                                onClick={() => setShowInsertModal(false)}
                                className="px-6 py-2.5 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                form="insert-form"
                                type="submit"
                                disabled={isInserting}
                                className="flex items-center gap-3 px-8 py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isInserting ? (
                                    <>
                                        <div className="h-3 w-3 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin rounded-full"></div>
                                        Inserting...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Insert Row
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-[#021016]/30 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-md border border-white/5 bg-white/[0.02] text-zinc-500 disabled:opacity-20 translate-y-[-1px]" disabled>
                            <ArrowUpDown className="h-3 w-3 rotate-90" />
                        </button>
                        <span>Page 1 of 1</span>
                        <button className="p-1.5 rounded-md border border-white/5 bg-white/[0.02] text-zinc-500 disabled:opacity-20 translate-y-[-1px]" disabled>
                            <ArrowUpDown className="h-3 w-3 -rotate-90" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
