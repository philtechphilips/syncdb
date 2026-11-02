/**
 * How table values are shown, edited and sent back. The API describes each
 * column with a `kind`; values arrive JSON-safe (dates as strings, binary
 * as 0x-hex, BIGINT/DECIMAL as exact strings, JSON columns as JSON values).
 */

export type ValueKind =
  | "json"
  | "binary"
  | "boolean"
  | "integer"
  | "bigint"
  | "decimal"
  | "float"
  | "date"
  | "datetime"
  | "datetimetz"
  | "time"
  | "uuid"
  | "array"
  | "text"
  | "other";

export interface TableColumn {
  name: string;
  type: string;
  nullable: string;
  columnKey: string;
  defaultValue: string | null;
  fullType?: string;
  enumValues?: string | null;
  referencedTable?: string | null;
  referencedColumn?: string | null;
  kind?: ValueKind;
  isAutoIncrement?: boolean;
  isGenerated?: boolean;
}

export type Row = Record<string, unknown>;

export const kindOf = (column?: TableColumn): ValueKind =>
  column?.kind ?? "text";

/** Text shown in a grid cell. */
export function displayValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function toBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  const s = String(value).trim().toLowerCase();
  if (["1", "true", "t", "yes", "0x01"].includes(s)) return true;
  if (["0", "false", "f", "no", "0x00"].includes(s)) return false;
  return null;
}

/** Text placed in an editor for a value (never "[object Object]" or "null"). */
export function toEditText(value: unknown, column?: TableColumn): string {
  if (value === null || value === undefined) return "";
  const kind = kindOf(column);
  if (kind === "json" || kind === "array")
    return JSON.stringify(value, null, 2);
  if (kind === "boolean") {
    const b = toBoolean(value);
    return b === null ? "" : String(b);
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

const NUMERIC = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
const HEX = /^0x([0-9a-fA-F]{2})*$/;

/**
 * Turns editor text back into the value the API expects for the column.
 * Throws an Error with a user-facing message when the text is invalid.
 */
export function fromEditText(text: string, column?: TableColumn): unknown {
  const kind = kindOf(column);
  const trimmed = text.trim();
  switch (kind) {
    case "json":
      if (trimmed === "") return null;
      try {
        return JSON.parse(trimmed);
      } catch {
        throw new Error(`"${column?.name}" must be valid JSON.`);
      }
    case "array":
      if (trimmed === "") return null;
      if (trimmed.startsWith("[")) {
        try {
          return JSON.parse(trimmed);
        } catch {
          throw new Error(`"${column?.name}" must be a JSON array.`);
        }
      }
      return trimmed; // Postgres array literal, e.g. {a,b}
    case "boolean": {
      if (trimmed === "") return null;
      const b = toBoolean(trimmed);
      if (b === null)
        throw new Error(`"${column?.name}" must be true or false.`);
      return b;
    }
    case "integer":
    case "bigint":
    case "decimal":
    case "float":
      if (trimmed === "") return null;
      if (!NUMERIC.test(trimmed))
        throw new Error(`"${column?.name}" must be a number.`);
      return trimmed; // a string, so BIGINT/DECIMAL keep every digit
    case "binary":
      if (trimmed === "") return null;
      if (!HEX.test(trimmed)) {
        throw new Error(
          `"${column?.name}" must be hex starting with 0x, e.g. 0x1f2a.`,
        );
      }
      return trimmed;
    case "date":
    case "datetime":
    case "datetimetz":
    case "time":
    case "uuid":
      return trimmed === "" ? null : trimmed;
    default:
      return text;
  }
}

export const primaryKeyColumns = (columns: TableColumn[]) =>
  columns.filter((c) => c.columnKey === "PRI").map((c) => c.name);

/** Stable id for a row: its primary key, or its position for key-less tables. */
export function rowKey(row: Row, pkColumns: string[], index: number): string {
  if (pkColumns.length > 0) {
    return JSON.stringify(pkColumns.map((c) => row[c] ?? null));
  }
  return `#${index}`;
}

const UNMATCHABLE: ValueKind[] = ["json", "binary", "float", "array", "other"];

/**
 * WHERE that identifies a row: the primary key when there is one, otherwise
 * every comparable column (the API then changes at most one matching row).
 */
export function whereForRow(row: Row, columns: TableColumn[]): Row {
  const pk = primaryKeyColumns(columns);
  const names =
    pk.length > 0
      ? pk
      : columns.length > 0
        ? columns
            .filter((c) => !UNMATCHABLE.includes(kindOf(c)))
            .map((c) => c.name)
        : Object.keys(row);
  const where: Row = {};
  for (const name of names) {
    if (name in row) where[name] = row[name];
  }
  return where;
}

export const sameValue = (a: unknown, b: unknown) =>
  JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** Only the columns the user actually changed. */
export function changedFields(original: Row, edited: Row): Row {
  const out: Row = {};
  for (const key of Object.keys(edited)) {
    if (!sameValue(original[key], edited[key])) out[key] = edited[key];
  }
  return out;
}
