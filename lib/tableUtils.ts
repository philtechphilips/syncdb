/**
 * Table data manipulation and filtering utilities
 */

export interface FilterRule {
  column: string;
  operator: string;
  value: string;
}

export const applyFilters = <T extends Record<string, unknown>>(
  rows: T[],
  filters: FilterRule[],
  showSelectedOnly: boolean,
  selectedRows: Set<string | number>,
) => {
  return rows.filter((row) => {
    // 1. Selection Filter
    if (showSelectedOnly && !selectedRows.has(row.id as string | number))
      return false;

    // 2. Advanced Column Filters
    return filters.every((filter) => {
      const rowValue = row[filter.column];
      const filterValue = filter.value.toLowerCase();
      const valStr = String(rowValue).toLowerCase();

      switch (filter.operator) {
        case "is":
          return valStr === filterValue;
        case "is_not":
          return valStr !== filterValue;
        case "contains":
          return valStr.includes(filterValue);
        case "not_contains":
          return !valStr.includes(filterValue);
        case "starts_with":
          return valStr.startsWith(filterValue);
        case "ends_with":
          return valStr.endsWith(filterValue);
        case "gt":
          return Number(rowValue) > Number(filter.value);
        case "lt":
          return Number(rowValue) < Number(filter.value);
        case "is_null":
          return rowValue === null || rowValue === "NULL";
        case "is_not_null":
          return rowValue !== null && rowValue !== "NULL";
        default:
          return true;
      }
    });
  });
};

export const cloneTableRow = <T extends Record<string, unknown>>(
  rows: T[],
  rowId: string | number,
) => {
  const rowToClone = rows.find((r) => r.id === rowId);
  if (!rowToClone) return rows;

  const newId = Math.max(...rows.map((r) => Number(r.id) || 0)) + 1;
  const newRow = { ...rowToClone, id: newId } as T;
  const index = rows.findIndex((r) => r.id === rowId);

  const nextRows = [...rows];
  nextRows.splice(index + 1, 0, newRow);
  return nextRows;
};

export const deleteTableRow = <T extends Record<string, unknown>>(
  rows: T[],
  id: string | number,
) => {
  return rows.filter((r) => r.id !== id);
};
