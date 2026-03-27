"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { applyFilters, deleteTableRow } from "@/lib/tableUtils";
import { calculateContextMenuPosition, copyToClipboard } from "@/lib/uiUtils";
import { formatData, downloadFile } from "@/lib/exportUtils";

import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";
import DataTableFooter from "./DataTableFooter";
import DataRowModal, { TableColumn } from "./DataRowModal";
import DataContextMenu from "./DataContextMenu";
import ExportModal from "./ExportModal";
import { useModalStore } from "@/store/useModalStore";

interface GenericDataTableProps {
  data: Record<string, unknown>[];
  tableName?: string;
  clusterId?: string;
  onUpdateRow?: (updates: any, where: any) => Promise<void>;
  onDeleteRows?: (where: any) => Promise<void>;
  onInsertRow?: (data: any) => Promise<void>;
  onDropTable?: () => Promise<void>;
  hidePagination?: boolean;
  isReadOnly?: boolean;
}

const GenericDataTable = ({
  data,
  tableName,
  clusterId,
  onUpdateRow,
  onDeleteRows,
  onInsertRow,
  onDropTable,
  hidePagination = false,
  isReadOnly = false,
}: GenericDataTableProps) => {
  const { open: openModal } = useModalStore();
  const [rows, setRows] = useState<Record<string, unknown>[]>(data || []);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [activeCell, setActiveCell] = useState<{ rowId: string | number; colName: string } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string | number; colName: string; value: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; rowId: string | number; colName: string; type: "cell" | "row" } | null>(null);

  const [showCopyDropdown, setShowCopyDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showGlobalExportDropdown, setShowGlobalExportDropdown] = useState(false);
  const [lastCopiedFormat, setLastCopiedFormat] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const [showRowModal, setShowRowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [nullFields, setNullFields] = useState<Set<string>>(new Set());

  const [activeFilters, setActiveFilters] = useState<{ column: string; operator: string; value: string }[]>([]);
  const [stagedFilters, setStagedFilters] = useState<{ column: string; operator: string; value: string }[]>([]);
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  useEffect(() => {
    setRows(data);
    setSelectedRows(new Set());
  }, [data]);

  const closeMenu = useCallback(() => {
    setContextMenu(null);
    setActiveCell(null);
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [closeMenu]);

  const handleContextMenu = (e: React.MouseEvent, rowId: string | number, colName: string) => {
    e.preventDefault();
    const isRowSelected = selectedRows.has(rowId);
    const { x, y } = calculateContextMenuPosition(e.clientX, e.clientY, isRowSelected);
    if (isRowSelected) {
      setContextMenu({ x, y, rowId, colName, type: "row" });
      setActiveCell(null);
    } else {
      setContextMenu({ x, y, rowId, colName, type: "cell" });
      setActiveCell({ rowId, colName });
    }
  };

  const toggleRow = (id: string | number) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === rows.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(rows.map((r) => r.id as string | number || r._id as string | number)));
  };

  const setAsNull = (rowId: string | number, colName: string) => {
    if (isReadOnly) return;
    setRows(rows.map((r) => (r.id === rowId ? { ...r, [colName]: "NULL" } : r)));
  };

  const deleteRow = async (id: string | number) => {
    if (isReadOnly || !onDeleteRows) return;
    try {
      await onDeleteRows({ id });
      setRows((prev) => prev.filter(r => (r.id || r._id) !== id));
      toast.success("Row deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteSelected = async () => {
    if (isReadOnly || !onDeleteRows || selectedRows.size === 0) return;
    try {
      // Bulk delete simulation/call
      for (const id of Array.from(selectedRows)) {
         await onDeleteRows({ id });
      }
      setRows((prev) => prev.filter((r) => !selectedRows.has(r.id as any || r._id as any)));
      setSelectedRows(new Set());
      toast.success(`${selectedRows.size} rows deleted`);
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  const handleCopy = (format: string, dataToProcess: Record<string, unknown>[] = rows.filter((r) => selectedRows.has(r.id as any || r._id as any))) => {
    const content = formatData(format, dataToProcess, tableName || "results");
    if (typeof content === "string") {
      copyToClipboard(content);
      setLastCopiedFormat(format.toUpperCase());
      setTimeout(() => setLastCopiedFormat(null), 2000);
    }
    setShowCopyDropdown(false);
  };

  const handleExport = async (format: string, dataToProcess?: Record<string, unknown>[]) => {
    if (format === "modal") {
      setShowExportModal(true);
      return;
    }
    let exportData = dataToProcess || (showSelectedOnly ? rows.filter(r => selectedRows.has(r.id as any || r._id as any)) : rows);
    const content = formatData(format, exportData, tableName || "results");
    if (content) {
      downloadFile(content, `${tableName || "export"}.${format.toLowerCase()}`);
      setExportSuccess(format);
      setTimeout(() => setExportSuccess(null), 2000);
    }
    setShowExportModal(false);
  };

  const handleSaveCell = async () => {
    if (isReadOnly || !editingCell || !onUpdateRow) return;
    try {
      await onUpdateRow({ [editingCell.colName]: editingCell.value }, { id: editingCell.rowId });
      setEditingCell(null);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleSubmitRow = async () => {
    if (isReadOnly || !onInsertRow) return;
    setIsSaving(true);
    try {
      if (isEditMode && editingRow) {
        if (onUpdateRow) await onUpdateRow(formData, { id: editingRow.id });
      } else {
        await onInsertRow(formData);
      }
      setShowRowModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRows = applyFilters(rows, activeFilters, showSelectedOnly, selectedRows);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      <DataContextMenu
        contextMenu={contextMenu}
        onClose={closeMenu}
        onSetNull={setAsNull}
        onCopyValue={(rid, col) => copyToClipboard(rows.find(r => (r.id || r._id) === rid)?.[col]?.toString() || "")}
        onFilterByValue={(rid, col) => {
          const val = rows.find(r => (r.id || r._id) === rid)?.[col]?.toString() || "";
          setActiveFilters([...activeFilters, { column: col, operator: "is", value: val }]);
        }}
        onCopyColumn={copyToClipboard}
        onCopyRow={(format, rid) => {
          const rowToCopy = rid === -1 ? rows.filter(r => selectedRows.has(r.id as any || r._id as any)) : [rows.find(r => (r.id || r._id) === rid)].filter(Boolean) as Record<string, unknown>[];
          handleCopy(format, rowToCopy);
        }}
        onCloneRow={(rid) => {}}
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
        selectedTable={tableName}
        totalRows={0}
        rowsCount={rows.length}
        selectedRowsCount={selectedRows.size}
        onDeleteSelected={handleDeleteSelected}
        showCopyDropdown={showCopyDropdown}
        setShowCopyDropdown={setShowCopyDropdown}
        lastCopiedFormat={lastCopiedFormat}
        onCopy={handleCopy}
        showExportDropdown={showExportDropdown}
        setShowExportDropdown={setShowExportDropdown}
        onExportSelection={(fmt) => handleExport(fmt, rows.filter(r => selectedRows.has(r.id as any)))}
        onExportAll={handleExport}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        activeFiltersCount={activeFilters.length}
        stagedFilters={stagedFilters}
        onClearAllFilters={() => setActiveFilters([])}
        onAddFilter={() => setStagedFilters([...stagedFilters, { column: Object.keys(rows[0] || {})[0], operator: "is", value: "" }])}
        onRemoveFilter={(idx) => setStagedFilters(stagedFilters.filter((_, i) => i !== idx))}
        onUpdateFilter={(idx, up) => setStagedFilters(stagedFilters.map((f, i) => i === idx ? { ...f, ...up } : f))}
        onApplyFilters={() => { setActiveFilters(stagedFilters); setShowFilterPopover(false); }}
        tableColumns={Object.keys(rows[0] || {}).map(k => ({ name: k, type: "varchar", nullable: "YES", columnKey: "", defaultValue: null })) as any}
        rows={rows}
        showGlobalExportDropdown={showGlobalExportDropdown}
        setShowGlobalExportDropdown={setShowGlobalExportDropdown}
        onOpenInsertModal={() => { setIsEditMode(false); setShowRowModal(true); }}
        onDropTable={onDropTable}
      />

      <DataTableBody
        rows={rows}
        filteredRows={filteredRows}
        selectedRows={selectedRows}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onOpenUpdateModal={(row) => { setIsEditMode(true); setEditingRow(row); setFormData(row); setShowRowModal(true); }}
        onContextMenu={handleContextMenu}
        editingCell={editingCell}
        onStartEdit={(rid, col, val) => setEditingCell({ rowId: rid, colName: col, value: val })}
        onEditValueChange={(val) => setEditingCell(prev => prev ? { ...prev, value: val } : null)}
        onSaveEdit={handleSaveCell}
        onCancelEdit={() => setEditingCell(null)}
        activeCell={activeCell}
      />

      {!hidePagination && (
        <DataTableFooter
          currentPage={1}
          rowsPerPage={rows.length}
          totalRows={rows.length}
          isLoading={false}
          onPrevPage={() => {}}
          onNextPage={() => {}}
        />
      )}

      {showRowModal && !isReadOnly && (
        <DataRowModal
          isOpen={showRowModal}
          isEditMode={isEditMode}
          onClose={() => setShowRowModal(false)}
          onSubmit={handleSubmitRow}
          isSaving={isSaving}
          selectedTable={tableName || "results"}
          tableColumns={Object.keys(rows[0] || {}).map(k => ({ name: k, type: "varchar", nullable: "YES", columnKey: "", defaultValue: null })) as any}
          formData={formData}
          nullFields={nullFields}
          onInputChange={(k, v) => setFormData(prev => ({ ...prev, [k]: v }))}
          onToggleNull={(k) => {}}
          selectedClusterId={clusterId}
        />
      )}
    </div>
  );
};

export default GenericDataTable;
