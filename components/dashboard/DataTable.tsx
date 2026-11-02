"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Table } from "lucide-react";

import { useClusterStore } from "@/store/useClusterStore";
import api from "@/lib/api";
import { calculateContextMenuPosition, copyToClipboard } from "@/lib/uiUtils";
import { getErrorMessage } from "@/lib/errorUtils";
import {
  changedFields,
  fromEditText,
  primaryKeyColumns,
  rowKey,
  toEditText,
  whereForRow,
} from "@/lib/cellValue";
import { downloadFile, formatData } from "@/lib/exportUtils";

import { TableSkeleton } from "./DataTable/TableSkeleton";
import DataTableHeader from "./DataTable/DataTableHeader";
import DataTableBody from "./DataTable/DataTableBody";
import DataTableFooter from "./DataTable/DataTableFooter";
import DataRowModal, { TableColumn } from "./DataTable/DataRowModal";
import DataContextMenu from "./DataTable/DataContextMenu";
import ExportModal from "./DataTable/ExportModal";

interface DataTableProps {
  selectedTable?: string;
}

const DataTable = ({ selectedTable }: DataTableProps) => {
  const { selectedCluster, dropTable } = useClusterStore();

  // ── Self-contained data state (not shared via store) ──────────────────────
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  // ── Selection / editing ────────────────────────────────────────────────────
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeCell, setActiveCell] = useState<{
    rowKey: string;
    colName: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    rowKey: string;
    colName: string;
    value: string;
    original: string;
  } | null>(null);

  // ── UI ─────────────────────────────────────────────────────────────────────
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    rowId: string;
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

  // ── Row modal ──────────────────────────────────────────────────────────────
  const [showRowModal, setShowRowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(
    null,
  );
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // Editor text per column; parsed by column type on submit.
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [nullFields, setNullFields] = useState<Set<string>>(new Set());

  // ── Filters ────────────────────────────────────────────────────────────────
  const [activeFilters, setActiveFilters] = useState<
    { column: string; operator: string; value: string }[]
  >([]);
  const [stagedFilters, setStagedFilters] = useState<
    { column: string; operator: string; value: string }[]
  >([]);
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // ── Row identity ───────────────────────────────────────────────────────────
  const pkColumns = useMemo(
    () => primaryKeyColumns(tableColumns),
    [tableColumns],
  );
  const columnByName = useMemo(
    () => new Map(tableColumns.map((c) => [c.name, c])),
    [tableColumns],
  );
  const rowKeys = useMemo(() => {
    const map = new Map<Record<string, unknown>, string>();
    rows.forEach((row, i) => map.set(row, rowKey(row, pkColumns, i)));
    return map;
  }, [rows, pkColumns]);
  const getRowKey = useCallback(
    (row: Record<string, unknown>) => rowKeys.get(row) ?? "",
    [rowKeys],
  );
  const findRow = (key: string | number) =>
    rows.find((r) => rowKeys.get(r) === String(key));
  const selectedRowList = () =>
    rows.filter((r) => selectedRows.has(getRowKey(r)));
  const rowsUrl = () =>
    `/v1/clusters/${selectedCluster!.id}/tables/${encodeURIComponent(selectedTable!)}/rows`;

  // ── Data fetching (self-contained, not via store) ─────────────────────────

  // isLoading starts true; event handlers set it before asking for another
  // page, so the effect below never updates state synchronously.
  const fetchPage = useCallback(
    (page: number, filters: typeof activeFilters) => {
      if (!selectedTable || !selectedCluster) return Promise.resolve();
      const filterParam =
        filters.length > 0
          ? `&filters=${encodeURIComponent(JSON.stringify(filters))}`
          : "";
      return api
        .get(
          `/v1/clusters/${selectedCluster.id}/tables/${encodeURIComponent(selectedTable)}?page=${page}&limit=${rowsPerPage}${filterParam}`,
        )
        .then((res) => {
          const { data, total, page: resPage } = res.data;
          setRows(data);
          setTotalRows(total);
          setCurrentPage(resPage);
          setSelectedRows(new Set());
        })
        .catch(() => {
          // toast shown by api interceptor
        })
        .finally(() => setIsLoading(false));
    },
    [selectedTable, selectedCluster, rowsPerPage],
  );

  // Fetch columns once on mount / table change
  useEffect(() => {
    if (!selectedTable || !selectedCluster) return;
    api
      .get(
        `/v1/clusters/${selectedCluster.id}/tables/${encodeURIComponent(selectedTable)}/columns`,
      )
      .then((res) => setTableColumns(res.data as TableColumn[]))
      .catch(() => {});
  }, [selectedTable, selectedCluster]);

  // Fetch data when table/filters change
  useEffect(() => {
    void fetchPage(1, activeFilters);
  }, [selectedTable, selectedCluster, activeFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Close context menu on outside click ───────────────────────────────────
  const closeMenu = useCallback(() => {
    setContextMenu(null);
    setActiveCell(null);
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [closeMenu]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const loadPage = (page: number, filters = activeFilters) => {
    setIsLoading(true);
    return fetchPage(page, filters);
  };
  const applyFilters = (filters: typeof activeFilters) => {
    setIsLoading(true);
    setActiveFilters(filters);
  };
  const refresh = () => loadPage(currentPage);

  const handleContextMenu = (
    e: React.MouseEvent,
    rowId: string,
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
      setActiveCell({ rowKey: rowId, colName });
    }
  };

  const toggleRow = (key: string) => {
    const next = new Set(selectedRows);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === rows.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(rows.map(getRowKey)));
  };

  const updateRowValues = async (
    row: Record<string, unknown>,
    data: Record<string, unknown>,
  ) => {
    await api.patch(rowsUrl(), { data, where: whereForRow(row, tableColumns) });
    await refresh();
  };

  const setAsNull = async (key: string | number, colName: string) => {
    const row = findRow(key);
    if (!row || !selectedCluster || !selectedTable) return;
    if (columnByName.get(colName)?.isGenerated) {
      toast.error("Generated columns can't be changed");
      return;
    }
    try {
      await updateRowValues(row, { [colName]: null });
      toast.success(`${colName} set to NULL`);
    } catch {
      // toast shown by api interceptor
    }
  };

  const deleteRow = async (key: string | number) => {
    const row = findRow(key);
    if (!row || !selectedCluster || !selectedTable) return;
    try {
      await api.delete(rowsUrl(), {
        data: { where: whereForRow(row, tableColumns) },
      });
      toast.success("Row deleted successfully");
      await refresh();
    } catch {
      // toast shown by api interceptor
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedCluster || !selectedTable || selectedRows.size === 0) return;
    const targets = selectedRowList();
    try {
      // One request, one transaction: either every row is deleted or none.
      const res = await api.delete(rowsUrl(), {
        data: { wheres: targets.map((row) => whereForRow(row, tableColumns)) },
      });
      const count = res.data?.affectedRows ?? targets.length;
      toast.success(
        `${count} row${count === 1 ? "" : "s"} deleted successfully`,
      );
      setSelectedRows(new Set());
      await refresh();
    } catch {
      // toast shown by api interceptor
    }
  };

  const textFor = (row: Record<string, unknown>) => {
    const text: Record<string, string> = {};
    const nulls = new Set<string>();
    for (const key of Object.keys(row)) {
      if (row[key] === null || row[key] === undefined) nulls.add(key);
      else text[key] = toEditText(row[key], columnByName.get(key));
    }
    return { text, nulls };
  };

  /** Opens the insert form prefilled with a copy of the row. */
  const cloneRow = (key: string | number) => {
    const row = findRow(key);
    if (!row) return;
    const copy = { ...row };
    for (const col of tableColumns) {
      if (col.isAutoIncrement || col.isGenerated) delete copy[col.name];
    }
    const { text, nulls } = textFor(copy);
    setIsEditMode(false);
    setEditingRow(null);
    setFormData(text);
    setNullFields(nulls);
    setShowRowModal(true);
  };

  const handleCopy = (
    format: string,
    dataToProcess: Record<string, unknown>[] = selectedRowList(),
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

  /** Fetches every row matching the filters, in pages the API accepts. */
  const fetchAllRows = async () => {
    const filterParam =
      activeFilters.length > 0
        ? `&filters=${encodeURIComponent(JSON.stringify(activeFilters))}`
        : "";
    const pageSize = 5000;
    const all: Record<string, unknown>[] = [];
    for (let page = 1; ; page++) {
      const res = await api.get(
        `/v1/clusters/${selectedCluster!.id}/tables/${encodeURIComponent(selectedTable!)}?page=${page}&limit=${pageSize}${filterParam}`,
      );
      all.push(...(res.data.data as Record<string, unknown>[]));
      if (res.data.data.length < pageSize) return all;
    }
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
      if (showSelectedOnly && selectedRows.size > 0) {
        data = selectedRowList();
      } else {
        const toastId = toast.loading(
          `Preparing ${totalRows.toLocaleString()} rows for export...`,
        );
        try {
          data = await fetchAllRows();
          toast.dismiss(toastId);
        } catch {
          toast.error("Failed to fetch full dataset for export", {
            id: toastId,
          });
          return;
        }
      }
    }

    if (!data || data.length === 0)
      return toast.error("No data available to export");
    const content = formatData(format, data, selectedTable || "table");
    if (!content || (typeof content === "string" && content === ""))
      return toast.error("Failed to format data for export");
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

  const handleInputChange = (colName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [colName]: value }));
    if (nullFields.has(colName)) {
      const next = new Set(nullFields);
      next.delete(colName);
      setNullFields(next);
    }
  };

  const toggleNullField = (colName: string) => {
    const next = new Set(nullFields);
    if (next.has(colName)) next.delete(colName);
    else next.add(colName);
    setNullFields(next);
  };

  const startEdit = (key: string, colName: string) => {
    const row = findRow(key);
    const column = columnByName.get(colName);
    if (!row) return;
    if (column?.isGenerated) {
      toast.error("Generated columns can't be edited");
      return;
    }
    const text = toEditText(row[colName], column);
    setEditingCell({ rowKey: key, colName, value: text, original: text });
  };

  const handleSaveCell = async () => {
    if (!editingCell || !selectedCluster || !selectedTable) return;
    const { rowKey: key, colName, value, original } = editingCell;
    const row = findRow(key);
    if (!row || value === original) {
      setEditingCell(null);
      return;
    }
    let parsed: unknown;
    try {
      parsed = fromEditText(value, columnByName.get(colName));
    } catch (error) {
      toast.error(getErrorMessage(error));
      return; // keep the editor open so the value can be fixed
    }
    try {
      await updateRowValues(row, { [colName]: parsed });
      setEditingCell(null);
      toast.success("Cell updated");
    } catch {
      // toast shown by api interceptor
    }
  };

  const handleDropTable = async () => {
    if (!selectedCluster || !selectedTable) return;
    try {
      await dropTable(selectedCluster.id, selectedTable);
      toast.success("Table dropped successfully");
    } catch (error) {
      toast.error("Failed to drop table", {
        description: getErrorMessage(error),
      });
    }
  };

  const handleOpenInsertModal = () => {
    setIsEditMode(false);
    setEditingRow(null);
    setFormData({});
    setNullFields(new Set());
    setShowRowModal(true);
  };

  const handleOpenUpdateModal = (row: Record<string, unknown>) => {
    const { text, nulls } = textFor(row);
    setIsEditMode(true);
    setEditingRow(row);
    setFormData(text);
    setNullFields(nulls);
    setShowRowModal(true);
  };

  /** Parses the form; for updates only the changed columns are returned. */
  const collectFormValues = () => {
    const names = new Set([...Object.keys(formData), ...nullFields]);
    const values: Record<string, unknown> = {};
    for (const name of names) {
      const column = columnByName.get(name);
      if (column?.isGenerated) continue;
      if (nullFields.has(name)) {
        values[name] = null;
      } else if (isEditMode || formData[name] !== "") {
        values[name] = fromEditText(formData[name] ?? "", column);
      }
    }
    if (!isEditMode || !editingRow) return values;
    const original = textFor(editingRow);
    const originalValues: Record<string, unknown> = {};
    for (const name of names) {
      originalValues[name] = original.nulls.has(name)
        ? null
        : fromEditText(original.text[name] ?? "", columnByName.get(name));
    }
    return changedFields(originalValues, values);
  };

  const handleSubmitRow = async () => {
    if (!selectedCluster || !selectedTable) return;
    let values: Record<string, unknown>;
    try {
      values = collectFormValues();
    } catch (error) {
      toast.error(getErrorMessage(error));
      return;
    }
    setIsSaving(true);
    try {
      if (isEditMode && editingRow) {
        if (Object.keys(values).length === 0) {
          setShowRowModal(false);
          return;
        }
        await updateRowValues(editingRow, values);
        toast.success("Row updated");
      } else {
        await api.post(
          `/v1/clusters/${selectedCluster.id}/tables/${encodeURIComponent(selectedTable)}`,
          values,
        );
        toast.success("Row inserted");
        await refresh();
      }
      setShowRowModal(false);
    } catch {
      // toast shown by interceptor
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!selectedTable) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-zinc-600 gap-4 animate-in fade-in duration-1000">
        <div className="p-8 rounded-full bg-white/[0.01] border border-border/50 relative group">
          <Table className="h-16 w-16 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
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

  if (isLoading && rows.length === 0) {
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
            toEditText(findRow(rid)?.[col], columnByName.get(col)),
          )
        }
        onFilterByValue={(rid, col) => {
          const raw = findRow(rid)?.[col];
          const filter =
            raw === null || raw === undefined
              ? { column: col, operator: "is_null", value: "" }
              : {
                  column: col,
                  operator: "is",
                  value: toEditText(raw, columnByName.get(col)),
                };
          applyFilters([...activeFilters, filter]);
          setShowFilterPopover(true);
        }}
        onCopyColumn={copyToClipboard}
        onCopyRow={(format, rid) =>
          handleCopy(
            format,
            rid === -1
              ? selectedRowList()
              : rows.filter((r) => getRowKey(r) === String(rid)),
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
        onExportSelection={(fmt) => handleExport(fmt, selectedRowList())}
        onExportAll={(fmt) => handleExport(fmt, rows)}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        activeFiltersCount={activeFilters.length}
        stagedFilters={stagedFilters}
        onClearAllFilters={() => applyFilters([])}
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
          applyFilters(stagedFilters);
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
        filteredRows={
          showSelectedOnly
            ? rows.filter((r) => selectedRows.has(getRowKey(r)))
            : rows
        }
        getRowKey={getRowKey}
        selectedRows={selectedRows}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onOpenUpdateModal={handleOpenUpdateModal}
        onContextMenu={handleContextMenu}
        editingCell={editingCell}
        onStartEdit={startEdit}
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
        selectedTable={selectedTable}
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
        onPrevPage={() => {
          if (currentPage > 1) void loadPage(currentPage - 1);
        }}
        onNextPage={() => {
          if (currentPage * rowsPerPage < totalRows)
            void loadPage(currentPage + 1);
        }}
      />
    </div>
  );
};

export default DataTable;
