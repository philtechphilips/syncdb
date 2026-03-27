"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Table, Database } from "lucide-react";

import { useClusterStore } from "@/store/useClusterStore";
import api from "@/lib/api";
import { applyFilters, cloneTableRow, deleteTableRow } from "@/lib/tableUtils";
import { calculateContextMenuPosition, copyToClipboard } from "@/lib/uiUtils";
import { downloadFile, formatData } from "@/lib/exportUtils";

import { TableSkeleton } from "./DataTable/TableSkeleton";

// Sub-components
import DataTableHeader from "./DataTable/DataTableHeader";
import DataTableBody from "./DataTable/DataTableBody";
import DataTableFooter from "./DataTable/DataTableFooter";
import DataRowModal, { TableColumn } from "./DataTable/DataRowModal";
import DataContextMenu from "./DataTable/DataContextMenu";
import ExportModal from "./DataTable/ExportModal";

interface DataTableProps {
  data?: Record<string, unknown>[];
  selectedTable?: string;
}

const DataTable = ({ selectedTable }: DataTableProps) => {
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
    dropTable,
  } = useClusterStore();

  // Core Data State
  const [rows, setRows] = useState<Record<string, unknown>[]>(tableData);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );

  const [activeCell, setActiveCell] = useState<{
    rowId: string | number;
    colName: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    rowId: string | number;
    colName: string;
    value: string;
  } | null>(null);

  // UI State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    rowId: string | number;
    colName: string;
    type: "cell" | "row";
  } | null>(null);

  const [showCopyDropdown, setShowCopyDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showGlobalExportDropdown, setShowGlobalExportDropdown] =
    useState(false);
  const [lastCopiedFormat, setLastCopiedFormat] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Row Insertion/Update State
  const [showRowModal, setShowRowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(
    null,
  );
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [nullFields, setNullFields] = useState<Set<string>>(new Set());

  // Filtering State
  const [activeFilters, setActiveFilters] = useState<
    { column: string; operator: string; value: string }[]
  >([]);
  const [stagedFilters, setStagedFilters] = useState<
    { column: string; operator: string; value: string }[]
  >([]);
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
      } catch {
        console.error("Failed to parse filters from URL");
      }
    }
  }, [selectedTable, searchParams]);

  // Handle columns fetch
  useEffect(() => {
    if (!selectedTable || !selectedCluster) return;
    fetchTableColumns(selectedCluster.id, selectedTable).then((cols) => {
      setTableColumns(cols as TableColumn[]);
    });
  }, [selectedTable, selectedCluster, fetchTableColumns]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentF = params.get("f");
    const nextF =
      activeFilters.length > 0 ? JSON.stringify(activeFilters) : null;

    if (currentF === nextF) return;

    if (nextF) params.set("f", nextF);
    else params.delete("f");

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, "", url);
  }, [activeFilters, pathname, searchParams]);

  // Data Fetching
  useEffect(() => {
    if (!selectedTable || !selectedCluster) return;
    fetchTableData(
      selectedCluster.id,
      selectedTable,
      1,
      rowsPerPage,
      activeFilters,
    );
  }, [
    selectedTable,
    selectedCluster,
    fetchTableData,
    activeFilters,
    rowsPerPage,
  ]);

  useEffect(() => {
    setRows(tableData);
    setSelectedRows(new Set());
  }, [tableData]);

  const closeMenu = useCallback(() => {
    setContextMenu(null);
    setActiveCell(null);
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [closeMenu]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleContextMenu = (
    e: React.MouseEvent,
    rowId: string | number,
    colName: string,
  ) => {
    e.preventDefault();
    const isRowSelected = selectedRows.has(rowId);
    const { x, y } = calculateContextMenuPosition(
      e.clientX,
      e.clientY,
      isRowSelected,
    );

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
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map((r) => r.id as string | number)));
    }
  };

  const setAsNull = (rowId: string | number, colName: string) => {
    if (colName === "id") return;
    setRows(
      rows.map((r) =>
        (r.id as string | number) === rowId ? { ...r, [colName]: "NULL" } : r,
      ),
    );
  };

  const deleteRow = async (id: string | number) => {
    if (!selectedCluster || !selectedTable) return;
    try {
      await deleteRows(selectedCluster.id, selectedTable, { id: id });
      setRows((prev) => deleteTableRow(prev, id));
      const next = new Set(selectedRows);
      next.delete(id);
      setSelectedRows(next);
      toast.success("Row deleted successfully");
    } catch (error) {
      console.error("Failed to delete row:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedCluster || !selectedTable || selectedRows.size === 0) return;

    const count = selectedRows.size;
    const rowsToDelete = rows.filter((r) =>
      selectedRows.has(r.id as string | number),
    ) as Record<string, unknown>[];

    try {
      await deleteRowsBulk(
        selectedCluster.id,
        selectedTable,
        rowsToDelete as Record<string, unknown>[],
      );
      setRows((prev) =>
        prev.filter((r) => !selectedRows.has(r.id as string | number)),
      );
      setSelectedRows(new Set());

      toast.success(`${count} row${count > 1 ? "s" : ""} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete rows:", error);
      toast.error("Failed to delete selected rows");
    }
  };

  const cloneRow = (rowId: string | number) => {
    setRows(cloneTableRow(rows, rowId) as Record<string, unknown>[]);
  };

  const handleCopy = (
    format: string,
    dataToProcess: Record<string, unknown>[] = rows.filter((r) =>
      selectedRows.has(r.id as string | number),
    ),
  ) => {
    const content = formatData(format, dataToProcess, selectedTable || "table");
    if (typeof content === "string") {
      copyToClipboard(content);
      setLastCopiedFormat(format.toUpperCase());
      setTimeout(() => setLastCopiedFormat(null), 2000);
    } else {
      toast.error("Format not supported for clipboard");
    }
    setShowCopyDropdown(false);
  };

  const handleExport = async (
    format: string,
    dataToProcess?: Record<string, unknown>[],
  ) => {
    if (format === "modal") {
      setShowExportModal(true);
      return;
    }

    let data = dataToProcess;

    if (!data) {
      // If we're coming from ExportModal or Global Header
      if (showSelectedOnly && selectedRows.size > 0) {
        data = rows.filter((r) => selectedRows.has(r.id as string | number));
      } else {
        // FETCH ALL DATA for the table (honoring active filters)
        const toastId = toast.loading(
          `Preparing ${totalRows.toLocaleString()} rows for export...`,
        );
        try {
          const filterParam =
            activeFilters.length > 0
              ? `&filters=${encodeURIComponent(JSON.stringify(activeFilters))}`
              : "";

          const response = await api.get(
            `/v1/clusters/${selectedCluster!.id}/tables/${selectedTable}?page=1&limit=${totalRows}${filterParam}`,
          );
          data = response.data.data;
          toast.dismiss(toastId);
        } catch (error) {
          toast.error("Failed to fetch full dataset for export", {
            id: toastId,
          });
          return;
        }
      }
    }

    if (!data || data.length === 0) {
      return toast.error("No data available to export");
    }

    const content = formatData(format, data, selectedTable || "table");
    if (!content || (typeof content === "string" && content === "")) {
      return toast.error("Failed to format data for export");
    }

    const subName =
      selectedRows.size > 0 && showSelectedOnly ? "selection" : "full";
    downloadFile(
      content,
      `${selectedTable || "export"}_${subName}.${format.toLowerCase()}`,
    );
    setExportSuccess(format);
    setTimeout(() => setExportSuccess(null), 2000);
    setShowExportDropdown(false);
    setShowGlobalExportDropdown(false);
    setShowExportModal(false);
  };

  const handleInputChange = (colName: string, value: unknown) => {
    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      [colName]: value,
    }));
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
      await updateRow(
        selectedCluster.id,
        selectedTable,
        { [colName]: value },
        { id: rowId },
      );
      setEditingCell(null);
      toast.success("Cell updated");
    } catch (error) {
      console.error("Failed to update cell:", error);
    }
  };

  const handleDropTable = async () => {
    if (!selectedCluster || !selectedTable) return;
    try {
      await dropTable(selectedCluster.id, selectedTable);
      toast.success("Table dropped successfully");
    } catch {
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

  const handleOpenUpdateModal = (row: Record<string, unknown>) => {
    setIsEditMode(true);
    setEditingRow(row);
    setFormData({ ...row });
    const nextNulls = new Set<string>();
    Object.keys(row).forEach((key) => {
      if (row[key] === null || row[key] === "NULL") nextNulls.add(key);
    });
    setNullFields(nextNulls);
    setShowRowModal(true);
  };

  const handleSubmitRow = async () => {
    if (!selectedCluster || !selectedTable) return;
    setIsSaving(true);
    const finalData: Record<string, unknown> = { ...formData };
    nullFields.forEach((col) => {
      finalData[col] = null;
    });

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
      console.error("Row submission failed:", error);
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
        <div className="p-8 rounded-full bg-white/[0.01] border border-border/50 relative group">
          <Table className="h-16 w-16 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            Explorer Node Ready
          </p>
          <p className="text-[11px] font-medium text-zinc-400 max-w-[200px] leading-relaxed mx-auto">
            Select a system entry to begin orchestration.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && tableData.length === 0) {
    return (
      <TableSkeleton
        columnCount={tableColumns.length > 0 ? tableColumns.length : 6}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background font-sans min-w-0 overflow-hidden relative">
      <DataContextMenu
        contextMenu={contextMenu}
        onClose={closeMenu}
        onSetNull={setAsNull}
        onCopyValue={(rid, col) =>
          copyToClipboard(
            rows
              .find((r) => (r.id as string | number) === rid)
              ?.[col]?.toString() || "",
          )
        }
        onFilterByValue={(rid, col) => {
          const val =
            rows
              .find((r) => (r.id as string | number) === rid)
              ?.[col]?.toString() || "";
          setActiveFilters([
            ...activeFilters,
            { column: col, operator: "is", value: val },
          ]);
          setShowFilterPopover(true);
        }}
        onCopyColumn={copyToClipboard}
        onCopyRow={(format, rid) =>
          handleCopy(
            format,
            rid === -1
              ? rows.filter((r) => selectedRows.has(r.id as string | number))
              : (rows.filter(
                  (r) => (r.id as string | number) === rid,
                ) as Record<string, unknown>[]),
          )
        }
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
        onExportSelection={(fmt) =>
          handleExport(
            fmt,
            rows.filter((r) => selectedRows.has(r.id as string | number)),
          )
        }
        onExportAll={(fmt) => handleExport(fmt, rows)}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        activeFiltersCount={activeFilters.length}
        stagedFilters={stagedFilters}
        onClearAllFilters={() => setActiveFilters([])}
        onAddFilter={() => {
          const columns = tableColumns.map((c) => c.name);
          if (columns.length > 0)
            setStagedFilters([
              ...stagedFilters,
              { column: columns[0], operator: "is", value: "" },
            ]);
        }}
        onRemoveFilter={(idx) =>
          setStagedFilters(stagedFilters.filter((_, i) => i !== idx))
        }
        onUpdateFilter={(idx, up) =>
          setStagedFilters(
            stagedFilters.map((f, i) => (i === idx ? { ...f, ...up } : f)),
          )
        }
        onApplyFilters={() => {
          setActiveFilters(stagedFilters);
          setShowFilterPopover(false);
        }}
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
        onStartEdit={(rid, col, val) =>
          setEditingCell({ rowId: rid, colName: col, value: val })
        }
        onEditValueChange={(val) =>
          setEditingCell((prev) => (prev ? { ...prev, value: val } : null))
        }
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
        onPrevPage={() =>
          currentPage > 1 &&
          fetchTableData(
            selectedCluster?.id || "",
            selectedTable,
            currentPage - 1,
            rowsPerPage,
            activeFilters,
          )
        }
        onNextPage={() =>
          currentPage * rowsPerPage < totalRows &&
          fetchTableData(
            selectedCluster?.id || "",
            selectedTable,
            currentPage + 1,
            rowsPerPage,
            activeFilters,
          )
        }
      />
    </div>
  );
};

export default DataTable;
