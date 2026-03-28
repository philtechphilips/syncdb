"use client";

import { useState, useCallback, useEffect } from "react";
import { calculateContextMenuPosition } from "@/lib/uiUtils";

export interface DataExplorerState {
  activeCell: { rowId: string | number; colName: string } | null;
  editingCell: {
    rowId: string | number;
    colName: string;
    value: string;
  } | null;
  contextMenu: {
    x: number;
    y: number;
    rowId: string | number;
    colName: string;
    type: "cell" | "row";
    value?: any;
  } | null;
  selectedRows: Set<string | number>;
}

export function useDataExplorer(initialData: any[] = []) {
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
  const [contextMenu, setContextMenu] =
    useState<DataExplorerState["contextMenu"]>(null);

  const closeMenu = useCallback(() => {
    setContextMenu(null);
    setActiveCell(null);
  }, []);

  const handleContextMenu = useCallback(
    (
      e: React.MouseEvent,
      rowId: string | number,
      colName: string,
      value: any,
      type: "cell" | "row" = "cell",
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const isSelected = selectedRows.has(rowId);
      const { x, y } = calculateContextMenuPosition(
        e.clientX,
        e.clientY,
        isSelected,
      );

      setContextMenu({ x, y, rowId, colName, type, value });
      setActiveCell({ rowId, colName });
    },
    [selectedRows],
  );

  const toggleRowSelection = useCallback(
    (rowId: string | number, multi: boolean = false) => {
      setSelectedRows((prev) => {
        const next = new Set(multi ? prev : []);
        if (next.has(rowId)) next.delete(rowId);
        else next.add(rowId);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", closeMenu);
      return () => window.removeEventListener("click", closeMenu);
    }
  }, [closeMenu]);

  return {
    selectedRows,
    setSelectedRows,
    activeCell,
    setActiveCell,
    editingCell,
    setEditingCell,
    contextMenu,
    setContextMenu,
    closeMenu,
    handleContextMenu,
    toggleRowSelection,
  };
}
