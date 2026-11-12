import React from "react";
import { X, ArrowUpDown, Plus, FileMinus, Loader2 } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import CustomFKSelect from "@/components/ui/CustomFKSelect";
import { kindOf, TableColumn, toBoolean } from "@/lib/cellValue";

export type { TableColumn } from "@/lib/cellValue";

interface DataRowModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSaving: boolean;
  selectedTable: string;
  tableColumns: TableColumn[];
  /** Editor text per column (see lib/cellValue toEditText/fromEditText). */
  formData: Record<string, string>;
  nullFields: Set<string>;
  onInputChange: (col: string, val: string) => void;
  onToggleNull: (col: string) => void;
  selectedClusterId?: string;
}

const DataRowModal = ({
  isOpen,
  isEditMode,
  onClose,
  onSubmit,
  isSaving,
  selectedTable,
  tableColumns,
  formData,
  nullFields,
  onInputChange,
  onToggleNull,
  selectedClusterId,
}: DataRowModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end bg-muted/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="w-full max-w-xl h-full bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-ink/[0.01]">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-3">
              {isEditMode ? (
                <ArrowUpDown className="h-5 w-5 text-accent-fg rotate-45" />
              ) : (
                <Plus className="h-5 w-5 text-accent-fg" />
              )}
              {isEditMode ? "Update Row" : "Insert New Row"}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              {isEditMode ? "Modifying existing data in " : "Adding to "}
              <span className="text-foreground">{selectedTable}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-ink/5 rounded-xl text-muted-foreground hover:text-foreground transition-all group"
          >
            <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 thin-scrollbar">
          {tableColumns.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-ink/[0.02] rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <form
              id="row-form"
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              {tableColumns.map((col) => {
                const isNull = nullFields.has(col.name);
                const kind = kindOf(col);
                const isDisabled = !!col.isAutoIncrement || !!col.isGenerated;
                const text = formData[col.name] ?? "";
                const lowerType = col.type.toLowerCase();

                const isBoolean = kind === "boolean";
                const isDateTime = kind === "datetime" || kind === "datetimetz";
                const isDate = kind === "date";
                const isJson = kind === "json" || kind === "array";

                let enumOptions: string[] | null = null;
                if (lowerType === "enum" && col.fullType) {
                  const match = col.fullType.match(/enum\((.*)\)/);
                  if (match)
                    enumOptions = match[1]
                      .split(",")
                      .map((s: string) => s.replace(/'/g, "").trim());
                } else if (col.enumValues) {
                  enumOptions = col.enumValues.split(",");
                }

                return (
                  <div key={col.name} className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-2 group-focus-within:text-accent-fg transition-colors">
                        {col.name}
                        {col.nullable === "NO" && col.columnKey !== "PRI" && (
                          <span className="text-err">*</span>
                        )}
                      </label>
                      <div className="flex items-center gap-2">
                        {col.nullable === "YES" && (
                          <button
                            type="button"
                            onClick={() => onToggleNull(col.name)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${isNull ? "bg-warn/20 text-warn border border-warn/30" : "bg-ink/5 text-muted-foreground border border-transparent hover:bg-ink/10 hover:text-foreground"}`}
                          >
                            <FileMinus
                              className={`h-2.5 w-2.5 ${isNull ? "text-warn" : "text-subtle"}`}
                            />
                            {isNull ? "NULL SET" : "SET NULL"}
                          </button>
                        )}
                        <span className="text-[11px] font-medium text-subtle bg-ink/5 px-1.5 py-0.5 rounded">
                          {col.type}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`relative transition-all duration-300 ${isNull ? "opacity-100" : ""}`}
                    >
                      {col.referencedTable && col.referencedColumn ? (
                        <CustomFKSelect
                          value={isNull ? "NULL" : text}
                          onChange={(val) =>
                            onInputChange(
                              col.name,
                              val == null ? "" : String(val),
                            )
                          }
                          referencedTable={col.referencedTable}
                          referencedColumn={col.referencedColumn}
                          clusterId={selectedClusterId || ""}
                          disabled={isDisabled}
                          isNull={isNull}
                        />
                      ) : isBoolean ? (
                        <CustomSelect<string>
                          value={
                            isNull
                              ? "NULL"
                              : toBoolean(text) === null
                                ? ""
                                : String(toBoolean(text))
                          }
                          onChange={(val) =>
                            val === "NULL"
                              ? onToggleNull(col.name)
                              : onInputChange(col.name, val)
                          }
                          options={[
                            ...(col.nullable === "YES"
                              ? [{ label: "NULL (Unset)", value: "NULL" }]
                              : []),
                            { label: "True", value: "true" },
                            { label: "False", value: "false" },
                          ]}
                          placeholder={`Set ${col.name}...`}
                          disabled={isDisabled}
                        />
                      ) : enumOptions ? (
                        <CustomSelect<string>
                          value={isNull ? "NULL" : text}
                          onChange={(val) =>
                            val === "NULL"
                              ? onToggleNull(col.name)
                              : onInputChange(col.name, val)
                          }
                          options={[
                            ...(col.nullable === "YES"
                              ? [{ label: "NULL (Unset)", value: "NULL" }]
                              : []),
                            ...enumOptions.map((opt) => ({
                              label: opt,
                              value: opt,
                            })),
                          ]}
                          placeholder={`Select ${col.name}...`}
                          disabled={isDisabled}
                        />
                      ) : isDate || isDateTime ? (
                        <CustomDatePicker
                          value={isNull ? "" : text}
                          onChange={(val) => onInputChange(col.name, val)}
                          isDateTime={isDateTime}
                          disabled={isDisabled}
                          isNull={isNull}
                        />
                      ) : isJson && !isNull ? (
                        <textarea
                          name={col.name}
                          rows={6}
                          spellCheck={false}
                          value={text}
                          placeholder={
                            kind === "array" ? '["a", "b"]' : '{"key": "value"}'
                          }
                          onChange={(e) =>
                            onInputChange(col.name, e.target.value)
                          }
                          disabled={isDisabled}
                          className="w-full border rounded-md px-4 py-2 text-xs font-mono bg-background border-line-strong text-foreground placeholder:text-subtle outline-none focus:border-primary/60 resize-y"
                        />
                      ) : (
                        <div className="relative group/input">
                          <input
                            name={col.name}
                            type={
                              !isNull &&
                              (kind === "integer" || kind === "float")
                                ? "number"
                                : "text"
                            }
                            inputMode={
                              kind === "bigint" || kind === "decimal"
                                ? "decimal"
                                : undefined
                            }
                            placeholder={
                              kind === "binary"
                                ? "0x…"
                                : col.defaultValue ||
                                  (col.nullable === "YES"
                                    ? "NULL"
                                    : `Enter ${col.name}...`)
                            }
                            value={isNull ? "NULL" : text}
                            readOnly={isNull}
                            onChange={(e) =>
                              onInputChange(col.name, e.target.value)
                            }
                            className={`w-full border rounded-md px-4 py-3 text-sm font-medium transition-all ${
                              isNull
                                ? "bg-warn/[0.03] border-warn/20 text-warn/50 italic cursor-default"
                                : "bg-background border-line-strong text-foreground placeholder:text-subtle outline-none focus:border-primary/60 hover:bg-ink/[0.04] text-sm"
                            }`}
                            disabled={isDisabled}
                          />
                          {isNull && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                              <span className="text-[11px] font-medium text-warn/40">
                                Unset
                              </span>
                              <div className="h-1.5 w-1.5 rounded-full bg-warn animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {(col.columnKey === "PRI" || col.isGenerated) && (
                      <p className="text-[11px] text-accent-fg/50 pt-1">
                        {col.isGenerated
                          ? "Generated column (read-only)"
                          : col.isAutoIncrement
                            ? "Primary Key (Auto-generated)"
                            : "Primary Key"}
                      </p>
                    )}
                  </div>
                );
              })}
            </form>
          )}
        </div>

        <div className="px-8 py-6 bg-ink/[0.01] border-t border-border flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-ink/5 transition-all"
          >
            Cancel
          </button>
          <button
            form="row-form"
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-2.5 bg-primary text-white rounded-md text-[11px] font-medium transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                {isEditMode ? "Updating..." : "Inserting..."}
              </>
            ) : (
              <>
                {isEditMode ? (
                  <ArrowUpDown className="h-4 w-4 rotate-45" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isEditMode ? "Update Row" : "Insert Row"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataRowModal;
