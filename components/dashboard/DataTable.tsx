"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Table, Database } from "lucide-react";

import { useClusterStore } from "@/store/useClusterStore";
import { applyFilters, cloneTableRow, deleteTableRow } from "@/lib/tableUtils";
import { calculateContextMenuPosition, copyToClipboard } from "@/lib/uiUtils";
import { downloadFile, formatData } from '@/lib/exportUtils';

// Sub-components
import DataTableHeader from "./DataTable/DataTableHeader";
import DataTableBody from "./DataTable/DataTableBody";
import DataTableFooter from "./DataTable/DataTableFooter";
import DataRowModal from "./DataTable/DataRowModal";
import DataContextMenu from "./DataTable/DataContextMenu";
import ExportModal from "./DataTable/ExportModal";

interface DataTableProps {
    data?: any[];
    selectedTable?: string;
}

const DataTable = ({ data, selectedTable }: DataTableProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { 
        selectedCluster, 
        fetchTableData, 
        updateRow, 
        tableData, 
        totalRows,
        currentPage,
        rowsPerPage,
        isDataLoading: isLoading,
        fetchTableColumns,
        insertRow,
        deleteRows,
        deleteRowsBulk,
        dropTable
    } = useClusterStore();

    // Core Data State
    const [rows, setRows] = useState<any[]>(tableData);
    const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
    const [activeCell, setActiveCell] = useState<{ rowId: number, colName: string } | null>(null);
    const [editingCell, setEditingCell] = useState<{ rowId: any, colName: string, value: string } | null>(null);

    // UI State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, rowId: number, colName: string, type: 'cell' | 'row' } | null>(null);
    const [showCopyDropdown, setShowCopyDropdown] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showGlobalExportDropdown, setShowGlobalExportDropdown] = useState(false);
    const [lastCopiedFormat, setLastCopiedFormat] = useState<string | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);

    // Row Insertion/Update State
    const [showRowModal, setShowRowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingRow, setEditingRow] = useState<any>(null);
    const [tableColumns, setTableColumns] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [nullFields, setNullFields] = useState<Set<string>>(new Set());

    // Filtering State
    const [activeFilters, setActiveFilters] = useState<{ column: string, operator: string, value: string }[]>([]);
    const [stagedFilters, setStagedFilters] = useState<{ column: string, operator: string, value: string }[]>([]);
    const [showFilterPopover, setShowFilterPopover] = useState(false);

    // -------------------------------------------------------------------------
    // Effects
    // -------------------------------------------------------------------------

    // Sync filters from URL
    useEffect(() => {
        const urlFilters = searchParams.get("f");
        if (urlFilters) {
            try {
                const parsed = JSON.parse(urlFilters);
                if (Array.isArray(parsed)) {
                    setActiveFilters(parsed);
                    setStagedFilters(parsed);
                }
            } catch (e) {
                console.error("Failed to parse filters from URL");
            }
        }
    }, [selectedTable, searchParams]);

    // Handle columns fetch
    useEffect(() => {
        if (!selectedTable || !selectedCluster) return;
        fetchTableColumns(selectedCluster.id, selectedTable).then(cols => {
            setTableColumns(cols);
        });
    }, [selectedTable, selectedCluster, fetchTableColumns]);

    // Sync filters to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const currentF = params.get("f");
        const nextF = activeFilters.length > 0 ? JSON.stringify(activeFilters) : null;
        
        if (currentF === nextF) return;

        if (nextF) params.set("f", nextF);
        else params.delete("f");
        
        const queryString = params.toString();
        const url = queryString ? `${pathname}?${queryString}` : pathname;
        window.history.replaceState(null, '', url);
    }, [activeFilters, pathname, searchParams]);

    // Data Fetching
    useEffect(() => {
        if (!selectedTable || !selectedCluster) return;
        fetchTableData(selectedCluster.id, selectedTable, 1, rowsPerPage, activeFilters);
    }, [selectedTable, selectedCluster, fetchTableData, activeFilters, rowsPerPage]);

    useEffect(() => {
        setRows(tableData);
        setSelectedRows(new Set());
    }, [tableData]);

    const closeMenu = useCallback(() => {
        setContextMenu(null);
        setActiveCell(null);
    }, []);

    useEffect(() => {
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [closeMenu]);

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------

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

    const toggleRow = (id: any) => {
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
        try {
            await deleteRows(selectedCluster.id, selectedTable, { id: id });
            setRows(prev => deleteTableRow(prev, id));
            const next = new Set(selectedRows);
            next.delete(id);
            setSelectedRows(next);
            toast.success("Row deleted successfully");
        } catch (error) {
            console.error('Failed to delete row:', error);
        }
    };

    const handleDeleteSelected = async () => {
        if (!selectedCluster || !selectedTable || selectedRows.size === 0) return;
        
        const count = selectedRows.size;
        const rowsToDelete = rows.filter(r => selectedRows.has(r.id));
        
        try {
            await deleteRowsBulk(selectedCluster.id, selectedTable, rowsToDelete);
            setRows(prev => prev.filter(r => !selectedRows.has(r.id)));
            setSelectedRows(new Set());
            toast.success(`${count} row${count > 1 ? 's' : ''} deleted successfully`);
        } catch (error) {
            console.error('Failed to delete rows:', error);
            toast.error("Failed to delete selected rows");
        }
    };

    const cloneRow = (rowId: number) => {
        setRows(cloneTableRow(rows, rowId));
    };

    const handleCopy = (format: string, dataToProcess: any[] = rows.filter(r => selectedRows.has(r.id))) => {
        const content = formatData(format, dataToProcess, selectedTable || 'table');
        copyToClipboard(content);
        setLastCopiedFormat(format.toUpperCase());
        setTimeout(() => setLastCopiedFormat(null), 2000);
        setShowCopyDropdown(false);
    };

    const handleExport = (format: string, dataToProcess: any[] = applyFilters(rows, [], showSelectedOnly, selectedRows)) => {
        const content = formatData(format, dataToProcess, selectedTable || 'table');
        const subName = selectedRows.size > 0 ? 'selection' : 'filtered';
        downloadFile(content, `${selectedTable || 'export'}_${subName}.${format.toLowerCase()}`);
        setExportSuccess(format);
        setTimeout(() => setExportSuccess(null), 2000);
        setShowExportDropdown(false);
        setShowGlobalExportDropdown(false);
        setShowExportModal(false);
    };

    const handleInputChange = (colName: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [colName]: value }));
        if (nullFields.has(colName)) {
            const nextNulls = new Set(nullFields);
            nextNulls.delete(colName);
            setNullFields(nextNulls);
        }
    };

    const toggleNullField = (colName: string) => {
        const nextNulls = new Set(nullFields);
        if (nextNulls.has(colName)) nextNulls.delete(colName);
        else {
            nextNulls.add(colName);
            const nextData = { ...formData };
            delete nextData[colName];
            setFormData(nextData);
        }
        setNullFields(nextNulls);
    };

    const handleSaveCell = async () => {
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

    const handleDropTable = async () => {
        if (!selectedCluster || !selectedTable) return;
        try {
            await dropTable(selectedCluster.id, selectedTable);
            toast.success("Table dropped successfully");
        } catch (error) {
            toast.error("Failed to drop table");
        }
    };

    const handleOpenInsertModal = () => {
        if (!selectedCluster || !selectedTable) return;
        setIsEditMode(false);
        setEditingRow(null);
        setFormData({});
        setNullFields(new Set());
        setShowRowModal(true);
    };

    const handleOpenUpdateModal = (row: any) => {
        setIsEditMode(true);
        setEditingRow(row);
        setFormData({ ...row });
        const nextNulls = new Set<string>();
        Object.keys(row).forEach(key => {
            if (row[key] === null || row[key] === "NULL") nextNulls.add(key);
        });
        setNullFields(nextNulls);
        setShowRowModal(true);
    };

    const handleSubmitRow = async () => {
        if (!selectedCluster || !selectedTable) return;
        setIsSaving(true);
        const finalData: any = { ...formData };
        nullFields.forEach(col => { finalData[col] = null; });

        try {
            if (isEditMode && editingRow) {
                const where = editingRow.id ? { id: editingRow.id } : { ...editingRow };
                await updateRow(selectedCluster.id, selectedTable, finalData, where);
                toast.success("Row updated");
            } else {
                await insertRow(selectedCluster.id, selectedTable, finalData);
                toast.success("Row inserted");
            }
            setShowRowModal(false);
        } catch (error) {
            console.error('Row submission failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // -------------------------------------------------------------------------
    // Render States
    // -------------------------------------------------------------------------

    if (!selectedTable) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-zinc-600 gap-4 animate-in fade-in duration-1000">
                <div className="p-8 rounded-full bg-white/[0.01] border border-white/5 relative group">
                    <Table className="h-16 w-16 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Explorer Node Ready</p>
                    <p className="text-[11px] font-medium text-zinc-400 max-w-[200px] leading-relaxed mx-auto">Select a system entry to begin orchestration.</p>
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
            
            <DataContextMenu 
                contextMenu={contextMenu}
                onClose={closeMenu}
                onSetNull={setAsNull}
                onCopyValue={(rid, col) => copyToClipboard(rows.find(r => r.id === rid)?.[col]?.toString() || "")}
                onFilterByValue={(rid, col) => {
                    const val = rows.find(r => r.id === rid)?.[col]?.toString() || "";
                    setActiveFilters([...activeFilters, { column: col, operator: 'is', value: val }]);
                    setShowFilterPopover(true);
                }}
                onCopyColumn={copyToClipboard}
                onCopyRow={(format, rid) => handleCopy(format, rid === -1 ? rows.filter(r => selectedRows.has(r.id)) : [rows.find(r => r.id === rid)])}
                onCloneRow={cloneRow}
                onDeleteRow={deleteRow}
                onDeleteSelected={handleDeleteSelected}
                onFilterSelected={() => setShowSelectedOnly(true)}
                selectedRowsCount={selectedRows.size}
            />

            <ExportModal 
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExport}
                selectedRowsCount={selectedRows.size}
                showSelectedOnly={showSelectedOnly}
                onToggleSelectedOnly={setShowSelectedOnly}
                exportSuccess={exportSuccess}
            />

            <DataTableHeader 
                selectedTable={selectedTable}
                totalRows={totalRows}
                rowsCount={rows.length}
                selectedRowsCount={selectedRows.size}
                onDeleteSelected={handleDeleteSelected}
                showCopyDropdown={showCopyDropdown}
                setShowCopyDropdown={setShowCopyDropdown}
                lastCopiedFormat={lastCopiedFormat}
                onCopy={handleCopy}
                showExportDropdown={showExportDropdown}
                setShowExportDropdown={setShowExportDropdown}
                onExport={(fmt) => handleExport(fmt, rows.filter(r => selectedRows.has(r.id)))}
                showFilterPopover={showFilterPopover}
                setShowFilterPopover={setShowFilterPopover}
                activeFiltersCount={activeFilters.length}
                stagedFilters={stagedFilters}
                onClearAllFilters={() => setActiveFilters([])}
                onAddFilter={() => {
                    const columns = tableColumns.map(c => c.name);
                    if (columns.length > 0) setStagedFilters([...stagedFilters, { column: columns[0], operator: 'is', value: '' }]);
                }}
                onRemoveFilter={(idx) => setStagedFilters(stagedFilters.filter((_, i) => i !== idx))}
                onUpdateFilter={(idx, up) => setStagedFilters(stagedFilters.map((f, i) => i === idx ? { ...f, ...up } : f))}
                onApplyFilters={() => { setActiveFilters(stagedFilters); setShowFilterPopover(false); }}
                tableColumns={tableColumns}
                rows={rows}
                showGlobalExportDropdown={showGlobalExportDropdown}
                setShowGlobalExportDropdown={setShowGlobalExportDropdown}
                onOpenInsertModal={handleOpenInsertModal}
                onDropTable={handleDropTable}
            />

            <DataTableBody 
                rows={rows}
                filteredRows={applyFilters(rows, [], showSelectedOnly, selectedRows)}
                selectedRows={selectedRows}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                onOpenUpdateModal={handleOpenUpdateModal}
                onContextMenu={handleContextMenu}
                editingCell={editingCell}
                onStartEdit={(rid, col, val) => setEditingCell({ rowId: rid, colName: col, value: val })}
                onEditValueChange={(val) => setEditingCell(prev => prev ? { ...prev, value: val } : null)}
                onSaveEdit={handleSaveCell}
                onCancelEdit={() => setEditingCell(null)}
                activeCell={activeCell}
            />

            <DataRowModal 
                isOpen={showRowModal}
                isEditMode={isEditMode}
                onClose={() => setShowRowModal(false)}
                onSubmit={handleSubmitRow}
                isSaving={isSaving}
                selectedTable={selectedTable || ""}
                tableColumns={tableColumns}
                formData={formData}
                nullFields={nullFields}
                onInputChange={handleInputChange}
                onToggleNull={toggleNullField}
                selectedClusterId={selectedCluster?.id}
            />

            <DataTableFooter 
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRows={totalRows}
                isLoading={isLoading}
                onPrevPage={() => currentPage > 1 && fetchTableData(selectedCluster?.id || "", selectedTable, currentPage - 1, rowsPerPage, activeFilters)}
                onNextPage={() => currentPage * rowsPerPage < totalRows && fetchTableData(selectedCluster?.id || "", selectedTable, currentPage + 1, rowsPerPage, activeFilters)}
            />

        </div>
    );
};

export default DataTable;
