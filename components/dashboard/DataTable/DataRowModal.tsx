import React from "react";
import { X, ArrowUpDown, Plus, FileMinus, Loader2 } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import CustomFKSelect from "@/components/ui/CustomFKSelect";

export interface TableColumn {
  name: string;
  type: string;
  nullable: string;
  columnKey: string;
  defaultValue: string | null;
  fullType?: string;
  enumValues?: string;
  referencedTable?: string;
  referencedColumn?: string;
}

interface DataRowModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSaving: boolean;
  selectedTable: string;
  tableColumns: TableColumn[];
  formData: Record<string, unknown>;
  nullFields: Set<string>;
  onInputChange: (col: string, val: unknown) => void;
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
    <div className="fixed inset-0 z-[200] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl h-full bg-[#021016] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
              {isEditMode ? (
                <ArrowUpDown className="h-5 w-5 text-primary rotate-45" />
              ) : (
                <Plus className="h-5 w-5 text-primary" />
              )}
              {isEditMode ? "Update Row" : "Insert New Row"}
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest mt-1">
              {isEditMode ? "Modifying existing data in " : "Adding to "}
              <span className="text-white">{selectedTable}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all group"
          >
            <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
          {tableColumns.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-white/[0.02] rounded-xl animate-pulse"
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
                const isDisabled =
                  (col.columnKey === "PRI" &&
                    col.defaultValue?.includes("nextval")) ||
                  col.name === "id";
                const lowerType = col.type.toLowerCase();

                const isBoolean =
                  lowerType === "boolean" ||
                  lowerType === "bool" ||
                  (lowerType === "tinyint" && col.fullType?.includes("(1)"));
                const isDateTime =
                  lowerType.includes("timestamp") ||
                  lowerType.includes("datetime");
                const isDate = lowerType === "date" && !isDateTime;

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
                      <label className="text-[10px] font-black text-zinc-400 tracking-widest flex items-center gap-2 group-focus-within:text-primary transition-colors">
                        {col.name}
                        {col.nullable === "NO" && col.columnKey !== "PRI" && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <div className="flex items-center gap-2">
                        {col.nullable === "YES" && (
                          <button
                            type="button"
                            onClick={() => onToggleNull(col.name)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest transition-all ${isNull ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "bg-white/5 text-zinc-500 border border-transparent hover:bg-white/10 hover:text-zinc-300"}`}
                          >
                            <FileMinus
                              className={`h-2.5 w-2.5 ${isNull ? "text-amber-500" : "text-zinc-600"}`}
                            />
                            {isNull ? "NULL SET" : "SET NULL"}
                          </button>
                        )}
                        <span className="text-[8px] font-black text-zinc-600 tracking-tighter bg-white/5 px-1.5 py-0.5 rounded">
                          {col.type}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`relative transition-all duration-300 ${isNull ? "opacity-100" : ""}`}
                    >
                      {col.referencedTable && col.referencedColumn ? (
                        <CustomFKSelect
                          value={
                            isNull
                              ? "NULL"
                              : ((formData[col.name] as
                                  | string
                                  | number
                                  | boolean
                                  | null) ?? "")
                          }
                          onChange={(val) => onInputChange(col.name, val)}
                          referencedTable={col.referencedTable}
                          referencedColumn={col.referencedColumn}
                          clusterId={selectedClusterId || ""}
                          disabled={isDisabled}
                          isNull={isNull}
                        />
                      ) : isBoolean ? (
                        <CustomSelect
                          value={
                            isNull
                              ? "NULL"
                              : ((formData[col.name] as
                                  | string
                                  | number
                                  | boolean
                                  | null) ?? true)
                          }
                          onChange={(val) => onInputChange(col.name, val)}
                          options={[
                            ...(col.nullable === "YES"
                              ? [{ label: "NULL (Unset)", value: "NULL" }]
                              : []),
                            { label: "True", value: true },
                            { label: "False", value: false },
                          ]}
                          placeholder={`Set ${col.name}...`}
                          disabled={isDisabled}
                        />
                      ) : enumOptions ? (
                        <CustomSelect
                          value={
                            isNull
                              ? "NULL"
                              : ((formData[col.name] as
                                  | string
                                  | number
                                  | boolean
                                  | null) ?? "")
                          }
                          onChange={(val) => onInputChange(col.name, val)}
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
                          value={
                            isNull ? "" : ((formData[col.name] as string) ?? "")
                          }
                          onChange={(val) => onInputChange(col.name, val)}
                          isDateTime={isDateTime}
                          disabled={isDisabled}
                          isNull={isNull}
                        />
                      ) : (
                        <div className="relative group/input">
                          <input
                            name={col.name}
                            type={
                              isNull
                                ? "text"
                                : lowerType.includes("int") ||
                                    lowerType === "decimal"
                                  ? "number"
                                  : "text"
                            }
                            placeholder={
                              col.defaultValue ||
                              (col.nullable === "YES"
                                ? "NULL"
                                : `Enter ${col.name}...`)
                            }
                            value={
                              isNull
                                ? "NULL"
                                : ((formData[col.name] as
                                    | string
                                    | number
                                    | readonly string[]
                                    | undefined) ?? "")
                            }
                            readOnly={isNull}
                            onChange={(e) =>
                              onInputChange(col.name, e.target.value)
                            }
                            className={`w-full border rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                              isNull
                                ? "bg-amber-500/[0.03] border-amber-500/20 text-amber-500/50 italic cursor-default"
                                : "bg-white/[0.02] border-white/5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 hover:bg-white/[0.04]"
                            }`}
                            disabled={isDisabled}
                          />
                          {isNull && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                              <span className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest">
                                Unset
                              </span>
                              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {col.columnKey === "PRI" && (
                      <p className="text-[8px] text-primary/50 font-black uppercase tracking-widest pt-1">
                        Primary Key (Auto-generated)
                      </p>
                    )}
                  </div>
                );
              })}
            </form>
          )}
        </div>

        <div className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            form="row-form"
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
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
