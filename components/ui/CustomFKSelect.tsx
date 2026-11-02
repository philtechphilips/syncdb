import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronDown,
  CheckCircle2,
  Search,
  Loader2,
  Database,
  X,
  Maximize2,
} from "lucide-react";
import api from "@/lib/api";

interface CustomFKSelectProps {
  value: unknown;
  onChange: (val: unknown) => void;
  referencedTable: string;
  referencedColumn: string;
  clusterId: string;
  disabled?: boolean;
  placeholder?: string;
  isNull?: boolean;
}

import FKTablePickerModal from "./FKTablePickerModal";

const CustomFKSelect = ({
  value,
  onChange,
  referencedTable,
  referencedColumn,
  clusterId,
  disabled,
  placeholder,
  isNull,
}: CustomFKSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOptions = useCallback(
    async (pageNum: number = 1, isSearch: boolean = false) => {
      if (isLoading || (!hasMore && pageNum > 1 && !isSearch)) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/v1/clusters/${clusterId}/tables/${referencedTable}`,
          {
            params: { page: pageNum, limit: 50 },
          },
        );
        // Handle paginated response format { data, total, page, limit }
        const newData = (response.data?.data || response.data || []) as Record<
          string,
          unknown
        >[];

        if (isSearch || pageNum === 1) {
          setOptions(newData);
        } else {
          setOptions((prev) => [...prev, ...newData]);
        }

        setHasMore(newData.length === 50);
        setPage(pageNum);
      } catch (err) {
        console.error("Failed to fetch FK options:", err);
        setError(`Could not load records from ${referencedTable}`);
      } finally {
        setIsLoading(false);
      }
    },
    [clusterId, hasMore, isLoading, referencedTable],
  );

  // Loads the first page when opened, and again (debounced) when searching.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(
      () => {
        setPage(1);
        setHasMore(true);
        void fetchOptions(1, true);
      },
      search ? 300 : 0,
    );
    return () => clearTimeout(timer);
  }, [search, isOpen, referencedTable, fetchOptions]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50 &&
      hasMore &&
      !isLoading
    ) {
      fetchOptions(page + 1);
    }
  };

  const getOptionLabel = (opt: Record<string, unknown>) => {
    const val = opt[referencedColumn];
    const descriptives = [
      "name",
      "title",
      "label",
      "display_name",
      "email",
      "username",
      "full_name",
    ];
    const labelKey = Object.keys(opt).find((k) =>
      descriptives.includes(k.toLowerCase()),
    );

    if (labelKey && labelKey !== referencedColumn) {
      return `${val} (${opt[labelKey]})`;
    }
    return String(val);
  };

  const selectedOption = options.find((opt) => opt[referencedColumn] === value);
  const displayValue = selectedOption
    ? getOptionLabel(selectedOption)
    : (value as string) || placeholder || `Select from ${referencedTable}...`;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled || isNull}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background border border-line-strong rounded-md px-4 py-2 text-sm text-foreground flex items-center justify-between outline-none focus:border-primary/60 transition-all disabled:opacity-30 hover:bg-ink/[0.04]"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Database className="h-3.5 w-3.5 text-accent-fg/50 shrink-0" />
          <span
            className={`truncate ${value !== undefined && value !== null ? "text-foreground" : "text-subtle"}`}
          >
            {displayValue}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-subtle transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-accent-fg" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 z-[210] bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col min-w-[320px]">
          <div className="p-2 border-b border-border bg-ink/[0.02] flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-subtle" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${referencedTable}...`}
                className="w-full bg-background border border-line-strong rounded-md pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-subtle outline-none focus:border-primary/60 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setShowModal(true);
                setIsOpen(false);
              }}
              className="p-2 rounded-lg bg-ink/5 hover:bg-ink/10 text-subtle hover:text-foreground transition-all border border-border group"
              title="Open Large Table Browser"
            >
              <Maximize2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-72 overflow-y-auto thin-scrollbar py-1"
          >
            {isLoading && options.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="h-5 w-5 text-accent-fg animate-spin" />
                <span className="text-[11px] font-medium text-subtle">
                  Loading records...
                </span>
              </div>
            ) : error ? (
              <div className="py-8 px-4 text-center flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-err/10 flex items-center justify-center">
                  <X className="h-4 w-4 text-err" />
                </div>
                <span className="text-[11px] font-medium text-err">
                  {error}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fetchOptions(1);
                  }}
                  className="mt-1 text-[11px] font-medium text-subtle hover:text-foreground underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            ) : options.length === 0 ? (
              <div className="py-8 text-center px-4">
                <span className="text-[11px] font-medium text-subtle block mb-2">
                  No quick results found
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 mx-auto px-3 py-1.5 rounded-lg bg-primary/10 text-accent-fg text-[11px] font-medium hover:bg-primary/20 transition-all border border-primary/20"
                >
                  <Maximize2 className="h-3 w-3" />
                  Browse Full Table
                </button>
              </div>
            ) : (
              <>
                {options.map((opt, i) => {
                  const optVal = opt[referencedColumn];
                  const optLabel = getOptionLabel(opt);
                  const isSelected = optVal === value;

                  // Get secondary info (first 3 other columns)
                  const secondaryInfo = Object.entries(opt)
                    .filter(
                      ([k]) =>
                        k !== referencedColumn &&
                        !k.toLowerCase().includes("id") &&
                        k !==
                          Object.keys(opt).find((key) =>
                            [
                              "name",
                              "title",
                              "label",
                              "display_name",
                              "email",
                              "username",
                              "full_name",
                            ].includes(key.toLowerCase()),
                          ),
                    )
                    .slice(0, 3);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onChange(optVal);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-all hover:bg-ink/5 border-b border-border last:border-0 flex items-center justify-between group ${isSelected ? "bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold truncate ${isSelected ? "text-accent-fg" : "text-foreground"}`}
                          >
                            {optLabel}
                          </span>
                        </div>
                        {secondaryInfo.length > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
                            {secondaryInfo.map(([k, v]) => (
                              <div
                                key={k}
                                className="flex items-center gap-1.5 shrink-0"
                              >
                                <span className="text-[11px] font-medium text-subtle">
                                  {k}:
                                </span>
                                <span className="text-[11px] text-subtle truncate max-w-[120px]">
                                  {String(v || "NULL")}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-accent-fg shrink-0 ml-4" />
                      )}
                      {!isSelected && (
                        <div className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle2 className="h-4 w-4 text-foreground/10" />
                        </div>
                      )}
                    </button>
                  );
                })}
                {isLoading && (
                  <div className="flex items-center justify-center py-4 border-t border-border bg-ink/[0.01]">
                    <Loader2 className="h-4 w-4 text-accent-fg/50 animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-2 border-t border-border bg-ink/[0.02] flex items-center justify-between px-4">
            <span className="text-[11px] text-subtle font-medium">
              {options.length} records loaded
            </span>
            {hasMore && (
              <span className="text-[11px] text-accent-fg font-medium animate-pulse">
                Scroll for more
              </span>
            )}
          </div>
        </div>
      )}

      <FKTablePickerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(val) => {
          onChange(val);
          setShowModal(false);
        }}
        referencedTable={referencedTable}
        referencedColumn={referencedColumn}
        clusterId={clusterId}
        selectedValue={value as string | number | boolean | null}
      />
    </div>
  );
};

export default CustomFKSelect;
