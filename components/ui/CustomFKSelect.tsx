import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, CheckCircle2, Search, Loader2, Database, X, Maximize2, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import api from "@/lib/api";

interface CustomFKSelectProps {
    value: any;
    onChange: (val: any) => void;
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
    isNull 
}: CustomFKSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchOptions = async (pageNum: number = 1, isSearch: boolean = false) => {
        if (isLoading || (!hasMore && pageNum > 1 && !isSearch)) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/v1/clusters/${clusterId}/tables/${referencedTable}`, {
                params: { page: pageNum, limit: 50 }
            });
            const newData = response.data || [];
            
            if (isSearch || pageNum === 1) {
                setOptions(newData);
            } else {
                setOptions(prev => [...prev, ...newData]);
            }
            
            setHasMore(newData.length === 50);
            setPage(pageNum);
        } catch (err) {
            console.error("Failed to fetch FK options:", err);
            setError(`Could not load records from ${referencedTable}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setPage(1);
            setHasMore(true);
            fetchOptions(1);
        }
    }, [isOpen, referencedTable]);

    // Handle searching with a delay to avoid too many requests
    useEffect(() => {
        if (isOpen && search !== undefined) {
            const timer = setTimeout(() => {
                setPage(1);
                setHasMore(true);
                fetchOptions(1, true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [search]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50 && hasMore && !isLoading) {
            fetchOptions(page + 1);
        }
    };

    const getOptionLabel = (opt: any) => {
        const val = opt[referencedColumn];
        const descriptives = ['name', 'title', 'label', 'display_name', 'email', 'username', 'full_name'];
        const labelKey = Object.keys(opt).find(k => descriptives.includes(k.toLowerCase()));
        
        if (labelKey && labelKey !== referencedColumn) {
            return `${val} (${opt[labelKey]})`;
        }
        return String(val);
    };

    const selectedOption = options.find(opt => opt[referencedColumn] === value);
    const displayValue = selectedOption ? getOptionLabel(selectedOption) : (value || placeholder || `Select from ${referencedTable}...`);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                disabled={disabled || isNull}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all disabled:opacity-30 hover:bg-white/[0.04]"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <Database className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                    <span className={`truncate ${value !== undefined && value !== null ? 'text-white' : 'text-zinc-500'}`}>
                        {displayValue}
                    </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 z-[210] bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col min-w-[320px]">
                    <div className="p-2 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                            <input 
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`Search ${referencedTable}...`}
                                className="w-full bg-zinc-950 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-all"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setShowModal(true);
                                setIsOpen(false);
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-white/5 group"
                            title="Open Large Table Browser"
                        >
                            <Maximize2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    <div 
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="max-h-72 overflow-y-auto scrollbar-hide py-1"
                    >
                        {isLoading && options.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Loading records...</span>
                            </div>
                        ) : error ? (
                            <div className="py-8 px-4 text-center flex flex-col items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <X className="h-4 w-4 text-red-500" />
                                </div>
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</span>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fetchOptions(1);
                                    }}
                                    className="mt-1 text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-wider underline underline-offset-4"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : options.length === 0 ? (
                            <div className="py-8 text-center px-4">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-2">No quick results found</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(true);
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-2 mx-auto px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/20"
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
                                        .filter(([k]) => k !== referencedColumn && !k.toLowerCase().includes('id') && k !== Object.keys(opt).find(key => ['name', 'title', 'label', 'display_name', 'email', 'username', 'full_name'].includes(key.toLowerCase())))
                                        .slice(0, 3);

                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                onChange(optVal);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-all hover:bg-white/5 border-b border-white/[0.02] last:border-0 flex items-center justify-between group ${isSelected ? 'bg-primary/5' : 'text-zinc-400 hover:text-white'}`}
                                        >
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold truncate ${isSelected ? 'text-primary' : 'text-white'}`}>{optLabel}</span>
                                                </div>
                                                {secondaryInfo.length > 0 && (
                                                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
                                                        {secondaryInfo.map(([k, v]) => (
                                                            <div key={k} className="flex items-center gap-1.5 shrink-0">
                                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">{k}:</span>
                                                                <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">{String(v || 'NULL')}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0 ml-4" />}
                                            {!isSelected && <div className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <CheckCircle2 className="h-4 w-4 text-white/10" />
                                            </div>}
                                        </button>
                                    );
                                })}
                                {isLoading && (
                                    <div className="flex items-center justify-center py-4 border-t border-white/[0.02] bg-white/[0.01]">
                                        <Loader2 className="h-4 w-4 text-primary/50 animate-spin" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    <div className="p-2 border-t border-white/5 bg-white/[0.02] flex items-center justify-between px-4">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                            {options.length} records loaded
                        </span>
                        {hasMore && (
                            <span className="text-[8px] text-primary font-black uppercase tracking-widest animate-pulse">
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
                selectedValue={value}
            />
        </div>
    );
};

export default CustomFKSelect;
