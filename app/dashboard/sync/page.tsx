"use client";

import { useEffect, useState } from "react";
import { useClusterStore } from "@/store/useClusterStore";
import { toast } from "sonner";
import api from "@/lib/api";
import { useModalStore } from "@/store/useModalStore";
import { 
    Zap, 
    RefreshCw, 
    Database, 
    ChevronDown, 
    ArrowRight, 
    Search, 
    ShieldCheck, 
    AlertCircle, 
    Plus, 
    Minus,
    CheckCircle2,
    Box
} from "lucide-react";

interface DiffResult {
    missingInTarget: any[];
    missingInSource: any[];
    tableMismatches: any[];
    matchingTables: any[];
}

export default function SyncPage() {
    const { clusters, selectedCluster } = useClusterStore();
    const { open: openModal } = useModalStore();
    const [sourceId, setSourceId] = useState<string>(selectedCluster?.id || "");
    const [targetId, setTargetId] = useState<string>("");
    const [isComparing, setIsComparing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [diff, setDiff] = useState<DiffResult | null>(null);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [withData, setWithData] = useState(false);
    const [activeCategory, setActiveCategory] = useState<"mismatches" | "missing" | "matching" | "extra">("mismatches");

    useEffect(() => {
        if (selectedCluster && !sourceId) setSourceId(selectedCluster.id);
    }, [selectedCluster]);

    const handleDropTable = async (tableName: string) => {
        if (!targetId) return;
        
        openModal({
            title: "Drop Target Table",
            message: `Are you sure you want to PERMANENTLY delete table "${tableName}" from the target database? This action is irreversible.`,
            type: "danger",
            confirmLabel: "Drop Table",
            confirmValue: tableName,
            onConfirm: async () => {
                try {
                    await api.delete(`/v1/clusters/${targetId}/tables/${tableName}`);
                    toast.success("Table Dropped", { description: `${tableName} was successfully deleted.` });
                    handleCompare(); // Refresh
                } catch (error) {
                    toast.error("Failed to delete table");
                }
            }
        });
    };

    const handleCompare = async () => {
        if (!sourceId || !targetId) {
            toast.error("Simple Error", { description: "You must select both source and target." });
            return;
        }
        if (sourceId === targetId) {
            toast.error("Simple Error", { description: "Source and target cannot be the same." });
            return;
        }

        setIsComparing(true);
        setDiff(null);
        setSelectedTables([]);
        try {
            const res = await api.get(`/v1/clusters/${sourceId}/compare/${targetId}`);
            setDiff(res.data);
            
            // Set initial category based on results
            if (res.data.tableMismatches.length > 0) setActiveCategory("mismatches");
            else if (res.data.missingInTarget.length > 0) setActiveCategory("missing");
            else if (res.data.missingInSource.length > 0) setActiveCategory("extra");
            else setActiveCategory("matching");

            toast.success("Comparison Ready", { description: "Schemas analyzed successfully." });
        } catch (error) {
            toast.error("Failed to compare schemas");
        } finally {
            setIsComparing(false);
        }
    };

    const handleSync = async () => {
        if (selectedTables.length === 0) {
            toast.error("Simple Error", { description: "Select at least one table to sync." });
            return;
        }

        setIsSyncing(true);
        try {
            const res = await api.post(`/v1/clusters/${sourceId}/sync/${targetId}`, {
                tableNames: selectedTables,
                withData
            });
            
            const failures = res.data.filter((r: any) => !r.success);
            if (failures.length > 0) {
                toast.error(`Sync partially failed: ${failures.length} tables failed.`);
            } else {
                toast.success("Sync Complete", { description: `${selectedTables.length} tables synchronized.` });
                handleCompare(); // Refresh
            }
        } catch (error) {
            toast.error("Sync failed");
        } finally {
            setIsSyncing(false);
        }
    };

    const toggleTableSelection = (tableName: string) => {
        setSelectedTables(prev => 
            prev.includes(tableName) 
                ? prev.filter(t => t !== tableName) 
                : [...prev, tableName]
        );
    };

    const selectAllFromActive = () => {
        if (!diff) return;
        let tables: string[] = [];
        if (activeCategory === "mismatches") tables = diff.tableMismatches.map(t => t.tableName);
        if (activeCategory === "missing") tables = diff.missingInTarget.map(t => t.tableName);
        if (activeCategory === "matching") tables = diff.matchingTables.map(t => t.tableName);
        
        setSelectedTables(prev => [...new Set([...prev, ...tables])]);
    };

    const sourceCluster = clusters.find(c => c.id === sourceId);
    const targetCluster = clusters.find(c => c.id === targetId);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#040d12]">
            {/* Workbench Header */}
            <div className="px-10 py-8 border-b border-[#1e3a44] bg-[#040d12]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(39,121,85,0.1)]">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-tight">SYNC WORKBENCH</h1>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Automated Schema & Data Alignment</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCompare}
                            disabled={isComparing || !sourceId || !targetId}
                            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isComparing || !sourceId || !targetId ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(39,121,85,0.2)]'}`}
                        >
                            {isComparing ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                            {isComparing ? "Analyzing..." : "Analyze Diff"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-8 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Source Instance</span>
                            {sourceCluster && <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{sourceCluster.type}</span>}
                        </div>
                        <div className="relative group">
                            <Database className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-hover:text-primary transition-colors" />
                            <select 
                                value={sourceId}
                                onChange={(e) => setSourceId(e.target.value)}
                                className="w-full bg-[#0b1215] border border-[#1e3a44] rounded-xl pl-12 pr-10 py-3.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer transition-all hover:border-primary/30 shadow-sm"
                            >
                                <option value="">Select source...</option>
                                {clusters.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                        </div>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-[#1e3a44]/20 border border-[#1e3a44]/30 flex items-center justify-center">
                        <ArrowRight className="h-5 w-5 text-zinc-500" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Target Instance</span>
                            {targetCluster && <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{targetCluster.type}</span>}
                        </div>
                        <div className="relative group">
                            <Database className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-hover:text-primary transition-colors" />
                            <select 
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                                className="w-full bg-[#0b1215] border border-[#1e3a44] rounded-xl pl-12 pr-10 py-3.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer transition-all hover:border-primary/30 shadow-sm"
                            >
                                <option value="">Select target...</option>
                                {clusters.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col bg-[#040d12]">
                {!diff && !isComparing && (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
                            <div className="relative h-24 w-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                <Zap className="h-12 w-12 text-zinc-700" />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-4">Initialize Comparison</h3>
                        <p className="max-w-md text-sm text-zinc-500 font-bold leading-relaxed mb-10">
                            Select both source and target database instances above to start a deep schema comparison and alignment.
                        </p>
                        <div className="flex items-center gap-8 border-t border-white/5 pt-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] font-black text-zinc-600 uppercase">Mismatches</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                                <span className="text-[10px] font-black text-zinc-600 uppercase">Missing</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black text-zinc-600 uppercase">In Sync</span>
                            </div>
                        </div>
                    </div>
                )}

                {isComparing && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative mb-8">
                            <RefreshCw className="h-16 w-16 text-primary animate-spin" />
                            <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse"></div>
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] animate-pulse">Analyzing Schema Structures</p>
                    </div>
                )}

                {diff && (
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {/* Status Tabs */}
                        <div className="flex items-center gap-2 px-10 py-6 border-b border-[#1e3a44] bg-[#0b1215]/30">
                            {[
                                { id: "mismatches", label: "Structural Mismatches", count: diff.tableMismatches.length, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { id: "missing", label: "Missing in Target", count: diff.missingInTarget.length, color: "text-rose-500", bg: "bg-rose-500/10" },
                                { id: "matching", label: "Matching Perfectly", count: diff.matchingTables.length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { id: "extra", label: "Extra in Target", count: (diff as any).missingInSource.length, color: "text-zinc-400", bg: "bg-white/5" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveCategory(tab.id as any)}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${activeCategory === tab.id 
                                        ? `border-${tab.color.split('-')[1]}-500/50 ${tab.bg} ${tab.color}` 
                                        : 'border-white/5 bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/10'}`}
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black bg-black/40 border border-white/10`}>{tab.count}</span>
                                </button>
                            ))}
                            
                            <div className="ml-auto flex items-center gap-4 pl-8 border-l border-white/5">
                                <div className="flex items-center gap-2 bg-[#0b1215] border border-white/5 px-4 py-2.5 rounded-xl">
                                    <input 
                                        type="checkbox" 
                                        id="withDataMain"
                                        checked={withData}
                                        onChange={(e) => setWithData(e.target.checked)}
                                        className="accent-primary w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor="withDataMain" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Migrate Data</label>
                                </div>

                                <button
                                    onClick={handleSync}
                                    disabled={isSyncing || selectedTables.length === 0}
                                    className={`flex items-center gap-3 px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isSyncing || selectedTables.length === 0 ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}
                                >
                                    {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin text-emerald-950" /> : <ShieldCheck className="h-4 w-4" />}
                                    {isSyncing ? "Running..." : `Sync ${selectedTables.length} Tables`}
                                </button>
                            </div>
                        </div>

                        {/* Detailed View */}
                        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                            <div className="max-w-5xl mx-auto space-y-6">
                                {/* Bulk Action Bar */}
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">
                                            {activeCategory === "mismatches" ? "Structural Repair" : 
                                             activeCategory === "missing" ? "Missing Declarations" : 
                                             activeCategory === "extra" ? "Cleanup Required" : "Environment Parity"}
                                        </h3>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Review and select partitions for synchronization</p>
                                    </div>
                                    {activeCategory !== "extra" && (
                                        <button 
                                            onClick={selectAllFromActive}
                                            className="text-[10px] font-black text-primary uppercase tracking-[0.15em] hover:text-primary/110 flex items-center gap-2 group"
                                        >
                                            <Plus className="h-3 w-3 transition-transform group-hover:rotate-90" />
                                            Select All In Category
                                        </button>
                                    )}
                                </div>

                                {/* Items */}
                                {activeCategory === "mismatches" && (
                                    <div className="space-y-4">
                                        {diff.tableMismatches.map((item) => (
                                            <div key={item.tableName} className="group overflow-hidden rounded-2xl border border-white/5 bg-[#0b1215]/40 hover:border-blue-500/30 transition-all duration-300">
                                                <div className="flex items-center justify-between p-5 border-b border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                                            <AlertCircle className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-white">{item.tableName}</h4>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <span className="text-[10px] text-blue-500/70 font-black uppercase tracking-widest flex items-center gap-1.5 shadow-none">
                                                                    <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                                                                    Diff Found
                                                                </span>
                                                                <span className="text-[9px] text-zinc-600 font-bold">{item.missingColumns.length + item.typeMismatches.length} conflicts</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleTableSelection(item.tableName)}
                                                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedTables.includes(item.tableName)
                                                            ? 'bg-blue-500 text-blue-950 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                                            : 'bg-white/5 text-zinc-500 hover:text-white border border-transparent hover:bg-white/10'}`}
                                                    >
                                                        {selectedTables.includes(item.tableName) ? "Selected" : "Add to Sync"}
                                                    </button>
                                                </div>
                                                <div className="p-5 grid grid-cols-2 gap-4 bg-black/20">
                                                    {item.missingColumns.map((col: any) => (
                                                        <div key={col.name} className="flex items-center gap-3 p-3 bg-[#040d12] rounded-xl border border-white/[0.03]">
                                                            <div className={`h-1.5 w-1.5 rounded-full ${col.status === 'missing_in_target' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                                                            <span className="text-[11px] font-bold text-zinc-200">{col.name}</span>
                                                            <span className="text-[9px] text-zinc-600 font-black uppercase font-mono">{col.type}</span>
                                                            <span className="ml-auto text-[8px] font-black uppercase tracking-tighter opacity-40">
                                                                {col.status === 'missing_in_target' ? 'Drop' : 'Create'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {item.typeMismatches.map((col: any) => (
                                                        <div key={col.name} className="flex items-center gap-3 p-3 bg-[#040d12] rounded-xl border border-white/[0.03]">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                                            <span className="text-[11px] font-bold text-zinc-200">{col.name}</span>
                                                            <div className="flex items-center gap-2 ml-auto">
                                                                <span className="text-[9px] text-rose-500 font-bold uppercase">{col.targetType}</span>
                                                                <ArrowRight className="h-3 w-3 text-zinc-700" />
                                                                <span className="text-[9px] text-emerald-500 font-bold uppercase">{col.sourceType}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeCategory === "missing" && (
                                    <div className="space-y-4">
                                        {diff.missingInTarget.map((item) => (
                                            <div key={item.tableName} className="flex items-center justify-between p-5 bg-[#0b1215]/40 border border-white/5 hover:border-rose-500/30 rounded-2xl group transition-all duration-300">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                                                        <Minus className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-white">{item.tableName}</h4>
                                                        <p className="text-[10px] text-rose-500/70 font-black uppercase tracking-widest mt-0.5">Not present in target database</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleTableSelection(item.tableName)}
                                                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedTables.includes(item.tableName)
                                                        ? 'bg-rose-500 text-rose-950 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                                                        : 'bg-white/5 text-zinc-500 hover:text-white border border-transparent hover:bg-white/10'}`}
                                                >
                                                    {selectedTables.includes(item.tableName) ? "Selected" : "Declare Table"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeCategory === "matching" && (
                                    <div className="space-y-4">
                                        {diff.matchingTables.map((item: any) => (
                                            <div key={item.tableName} className="flex items-center justify-between p-5 bg-[#0b1215]/40 border border-white/5 hover:border-emerald-500/30 rounded-2xl group transition-all duration-300">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-white">{item.tableName}</h4>
                                                        <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-widest mt-0.5">Structural parity confirmed</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleTableSelection(item.tableName)}
                                                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedTables.includes(item.tableName)
                                                        ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                                        : 'bg-white/5 text-zinc-500 hover:text-white border border-transparent hover:bg-white/10'}`}
                                                >
                                                    {selectedTables.includes(item.tableName) ? "Selected" : "Mirror Data"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeCategory === "extra" && (diff as any).missingInSource.map((item: any) => (
                                    <div key={item.tableName} className="flex items-center justify-between p-5 bg-[#0b1215]/40 border border-white/5 hover:border-zinc-500/30 rounded-2xl group transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 border border-white/10">
                                                <AlertCircle className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-white">{item.tableName}</h4>
                                                <p className="text-[10px] text-zinc-500/70 font-black uppercase tracking-widest mt-0.5">This table only exists in Target. Environment is polluted.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDropTable(item.tableName)}
                                            className="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-rose-950 shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]"
                                        >
                                            Drop Table
                                        </button>
                                    </div>
                                ))}

                                {diff[activeCategory === "mismatches" ? "tableMismatches" : 
                                      activeCategory === "missing" ? "missingInTarget" : 
                                      activeCategory === "extra" ? "missingInSource" : "matchingTables"].length === 0 && (
                                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                                        <div className="h-16 w-16 rounded-full border border-dashed border-zinc-700 flex items-center justify-center mb-6">
                                            <Search className="h-8 w-8 text-zinc-700" />
                                        </div>
                                        <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">No entries found</h4>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase mt-2">All records for this category are in order</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
