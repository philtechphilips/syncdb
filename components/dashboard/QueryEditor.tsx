"use client";

import React, { useState, useEffect } from "react";
import {
    Copy,
    CopyCheck,
    Trash2,
    Settings2,
    Terminal,
    X,
    Sparkles,
    Wand2,
    Command,
    Loader2,
    Play,
    AlignLeft,
    History,
    Clock,
    CheckCircle2,
    AlertCircle,
    Eraser
} from "lucide-react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { format } from "sql-formatter";
import { useClusterStore } from "@/store/useClusterStore";
import { toast } from "sonner";
import DataTable from "./DataTable";

const QueryEditor = () => {
    const { selectedCluster, executeQuery, fetchSchema } = useClusterStore();
    const monaco = useMonaco();
    
    const [queries, setQueries] = useState([
        {
            id: 1,
            name: "query_1.sql",
            code: "-- Select all active users\nSELECT * FROM users LIMIT 10;"
        }
    ]);
    const [activeQueryId, setActiveQueryId] = useState(1);
    const [queryResults, setQueryResults] = useState<any[] | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [schemaMetadata, setSchemaMetadata] = useState<any[]>([]);
    const [bottomTab, setBottomTab] = useState<"results" | "history">("results");
    const [queryHistory, setQueryHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const { fetchQueryLogs } = useClusterStore();


    // Load schema for autocomplete
    useEffect(() => {
        if (selectedCluster) {
            fetchSchema(selectedCluster.id).then(setSchemaMetadata);
        }
    }, [selectedCluster?.id]);

    // Setup Autocomplete
    useEffect(() => {
        if (!monaco || schemaMetadata.length === 0) return;

        const tableNames = Array.from(new Set(schemaMetadata.map(s => s.tableName || s.table_name)));
        const columns = schemaMetadata.map(s => ({ table: s.tableName || s.table_name, name: s.name }));

        const completionProvider = monaco.languages.registerCompletionItemProvider('sql', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions: any[] = [
                    // SQL Keywords
                    ...['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'AND', 'OR', 'AS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].map(k => ({
                        label: k,
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: k,
                        range
                    })),
                    // Tables
                    ...tableNames.map(t => ({
                        label: t,
                        kind: monaco.languages.CompletionItemKind.Struct,
                        insertText: t,
                        detail: 'Table',
                        range
                    })),
                    // Columns
                    ...columns.map(c => ({
                        label: c.name,
                        kind: monaco.languages.CompletionItemKind.Field,
                        insertText: c.name,
                        detail: `Column of ${c.table}`,
                        range
                    })),
                ];

                return { suggestions };
            },
        });

        return () => completionProvider.dispose();
    }, [monaco, schemaMetadata]);

    const activeQuery = queries.find(q => q.id === activeQueryId) || queries[0];

    const handleNewQuery = () => {
        const newId = Math.max(...queries.map(q => q.id), 0) + 1;
        const newQuery = {
            id: newId,
            name: `query_${newId}.sql`,
            code: `-- New query ${newId}\nSELECT * FROM users LIMIT 10;`
        };
        setQueries([...queries, newQuery]);
        setActiveQueryId(newId);
        setQueryResults(null);
    };

    const handleFormat = () => {
        try {
            const formatted = format(activeQuery.code, { language: 'postgresql', keywordCase: 'upper' });
            handleUpdateCode(formatted);
            toast.success("SQL Formatted");
        } catch (e) {
            toast.error("Format failed");
        }
    };

    const handleRunQuery = async () => {
        if (!selectedCluster) {
            toast.error("Please select a cluster first");
            return;
        }
        
        const sql = activeQuery.code.trim();
        if (!sql) return;

        // --- SAFETY ENGINE ---
        const lowerSql = sql.toLowerCase();
        
        // Block extremely dangerous commands
        if (lowerSql.includes("drop database")) {
            toast.error("Executing 'DROP DATABASE' is strictly prohibited for safety reasons.", {
                description: "Contact an administrator if you need to remove an entire database."
            });
            return;
        }

        // Warn for destructive commands
        const destructiveKeywords = ["drop table", "truncate", "delete", "update", "alter table"];
        const matched = destructiveKeywords.filter(k => lowerSql.includes(k));
        
        if (matched.length > 0) {
            const confirmed = window.confirm(`⚠️ DESTRUCTIVE ACTION WARNING\n\nYour query contains high-risk operations: ${matched.join(", ").toUpperCase()}.\n\nExecuting this could permanently modify or delete data.\n\nAre you sure you want to proceed?`);
            if (!confirmed) {
                toast("Operation cancelled by user.");
                return;
            }
        }
        // ---------------------

        setIsRunning(true);
        setQueryResults(null);
        try {
            const results = await executeQuery(selectedCluster.id, sql);
            setQueryResults(results);
            setBottomTab("results");
            toast.success("Query executed successfully");
            // Refresh history if open
            if (bottomTab === "history") loadHistory();
        } catch (err: any) {
            toast.error(err.message || "Failed to execute query");
        } finally {
            setIsRunning(false);
        }
    };

    const loadHistory = async () => {
        if (!selectedCluster) return;
        setIsLoadingHistory(true);
        try {
            const logs = await fetchQueryLogs(selectedCluster.id);
            setQueryHistory(logs);
        } catch (error) {
            toast.error("Failed to load query history");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (bottomTab === "history") {
            loadHistory();
        }
    }, [bottomTab, selectedCluster?.id]);

    const handleUpdateCode = (newCode: string) => {
        setQueries(queries.map(q => q.id === activeQueryId ? { ...q, code: newCode } : q));
    };

    const handleDeleteQuery = (id: number) => {
        if (queries.length === 1) {
            handleUpdateCode("");
            return;
        }
        const newQueries = queries.filter(q => q.id !== id);
        setQueries(newQueries);
        if (activeQueryId === id) {
            setActiveQueryId(newQueries[0].id);
        }
    };

    const [copied, setCopied] = useState(false);

    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAskAi = () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        // Simulate AI thinking and generating
        setTimeout(() => {
            const mockSql = `-- Generated from: ${aiPrompt}\nSELECT \n    u.name, \n    COUNT(o.id) as total_orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.active = true\nGROUP BY u.name\nHAVING total_orders > 0\nORDER BY total_orders DESC;`;
            handleUpdateCode(mockSql);
            setIsGenerating(false);
            setIsAiOpen(false);
            setAiPrompt("");
        }, 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(activeQuery.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-background font-sans min-w-0 w-full overflow-hidden">
            {/* Tab Strip Container */}
            <div className="w-full overflow-hidden border-b border-white/5">
                <div className="flex items-center bg-background pl-4 overflow-x-auto scrollbar-hide">
                    {queries.map((q) => (
                        <div
                            key={q.id}
                            onClick={() => setActiveQueryId(q.id)}
                            className={`group flex shrink-0 items-center gap-3 px-6 py-2.5 text-[11px] font-bold border-x border-t transition-all cursor-pointer relative -mb-[1px] translate-y-[1px] ${activeQueryId === q.id
                                ? "bg-background border-white/5 text-primary"
                                : "bg-background/50 border-transparent text-zinc-400 hover:text-white"
                                }`}
                        >
                            <div className={`h-1.5 w-1.5 rounded-full ${activeQueryId === q.id ? 'bg-primary animate-pulse' : 'bg-zinc-600'}`}></div>
                            {q.name}
                            {queries.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteQuery(q.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-white/10 text-zinc-600 hover:text-white transition-all outline-none"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={handleNewQuery}
                        className="flex shrink-0 items-center gap-1.5 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-200 transition-all active:scale-95 outline-none border-r border-white/5"
                    >
                        <span className="text-sm">+</span> New Query
                    </button>
                    <button
                        onClick={() => setIsAiOpen(!isAiOpen)}
                        className={`flex shrink-0 items-center gap-2.5 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 outline-none border-r border-white/5 ${isAiOpen ? 'text-primary bg-primary/5' : 'text-zinc-400 hover:text-primary'}`}
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Assistant
                    </button>
                </div>
            </div>

            {/* AI Generation Bar */}
            {isAiOpen && (
                <div className="w-full bg-zinc-900 border-b border-primary/20 animate-in slide-in-from-top duration-300">
                    <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4 group/ai">
                        <div className="flex items-center gap-2 shrink-0">
                            <Sparkles className={`h-4 w-4 text-primary ${isGenerating ? 'animate-spin' : ''}`} />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ask AI</span>
                        </div>
                        <input
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                            placeholder="e.g. 'Show me top 5 customers with most orders from last year'"
                            className="flex-1 bg-transparent border-none outline-none text-[12px] font-medium text-zinc-200 placeholder:text-zinc-500"
                            autoFocus
                        />
                        <div className="flex items-center gap-4">
                            {isGenerating ? (
                                <div className="flex items-center gap-2 text-[10px] font-bold text-primary animate-pulse">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ENGINEERING SQL...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-zinc-400 border border-white/10 px-2 py-1 rounded uppercase tracking-tighter bg-white/[0.02]">Enter to Generate</span>
                                    <button
                                        onClick={() => setIsAiOpen(false)}
                                        className="p-1 hover:text-white text-zinc-400 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Generation Bar */}
            {isAiOpen && (
                <div className="w-full bg-zinc-900 border-b border-primary/20 animate-in slide-in-from-top duration-300">
                    <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4 group/ai">
                        <div className="flex items-center gap-2 shrink-0">
                            <Sparkles className={`h-4 w-4 text-primary ${isGenerating ? 'animate-spin' : ''}`} />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ask AI</span>
                        </div>
                        <input
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                            placeholder="e.g. 'Show me top 5 customers with most orders from last year'"
                            className="flex-1 bg-transparent border-none outline-none text-[12px] font-medium text-zinc-200 placeholder:text-zinc-500"
                            autoFocus
                        />
                        <div className="flex items-center gap-4">
                            {isGenerating ? (
                                <div className="flex items-center gap-2 text-[10px] font-bold text-primary animate-pulse">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ENGINEERING SQL...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-zinc-400 border border-white/10 px-2 py-1 rounded uppercase tracking-tighter bg-white/[0.02]">Enter to Generate</span>
                                    <button
                                        onClick={() => setIsAiOpen(false)}
                                        className="p-1 hover:text-white text-zinc-400 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className={`flex flex-col w-full overflow-hidden relative font-mono text-sm group transition-all duration-500 ease-in-out min-h-0 ${queryResults ? 'flex-[1.5]' : 'flex-1'}`}>
                {/* Editor Area */}
                <Editor
                    height="100%"
                    defaultLanguage="sql"
                    theme="vs-dark"
                    value={activeQuery.code}
                    onChange={(val) => handleUpdateCode(val || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: isRunning,
                        automaticLayout: true,
                        padding: { top: 20 },
                        fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                    }}
                />

                {/* Connection Tooltip */}
                <div className="absolute top-6 right-8 flex items-center gap-3 px-4 py-1.5 rounded-lg border border-white/5 bg-black/40 text-[9px] font-black text-zinc-500 uppercase tracking-widest backdrop-blur-md opacity-40 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className={`h-1.5 w-1.5 rounded-full ${selectedCluster ? 'bg-primary shadow-[0_0_8px_rgba(0,237,100,0.8)]' : 'bg-red-500'}`}></div>
                    {selectedCluster ? `${selectedCluster.type === 'postgres' ? 'PostgreSQL' : 'MySQL'} - ${selectedCluster.database}` : 'No Cluster Selected'}
                </div>
            </div>

            {/* Middle Action Bar */}
            <div className="w-full border-y border-white/5 p-2 bg-[#021016] flex items-center justify-between px-6 shrink-0 h-14">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRunQuery}
                        disabled={isRunning || !selectedCluster}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-[#021016] text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                        Run Query
                    </button>
                    <button
                        onClick={handleFormat}
                        className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 rounded-lg transition-all"
                    >
                        <AlignLeft className="h-3.5 w-3.5" />
                        Format SQL
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCopy}
                        className={`p-2 rounded-lg transition-all group/btn relative ${copied ? 'text-primary bg-primary/10' : 'text-zinc-600 hover:bg-white/5 hover:text-white'}`}
                    >
                        {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-white/5 whitespace-nowrap">
                            {copied ? 'Copied!' : 'Copy Code'}
                        </span>
                    </button>
                    <button
                        onClick={() => handleUpdateCode("")}
                        className="p-2 rounded-lg text-zinc-600 hover:bg-white/5 hover:text-white transition-all group/btn relative"
                    >
                        <Eraser className="h-4 w-4" />
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-white/5 whitespace-nowrap">Clear SQL</span>
                    </button>
                </div>
            </div>

            {/* Results Area */}
            {(queryResults || bottomTab === "history") && (
                <div className="flex-1 flex flex-col bg-[#021016]/50 overflow-hidden border-t border-white/5 min-h-0 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 bg-black/20 shrink-0">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => setBottomTab("results")}
                                className={`flex items-center gap-3 py-1 transition-all relative ${bottomTab === "results" ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Terminal className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Query Output</span>
                                {bottomTab === "results" && <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]" />}
                            </button>
                            <button 
                                onClick={() => setBottomTab("history")}
                                className={`flex items-center gap-3 py-1 transition-all relative ${bottomTab === "history" ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <History className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">History</span>
                                {bottomTab === "history" && <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]" />}
                            </button>
                        </div>
                        <button 
                            onClick={() => {
                                setQueryResults(null);
                                setBottomTab("results");
                            }}
                            className="p-1 hover:text-white text-zinc-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto bg-black/5">
                        {bottomTab === "results" ? (
                            Array.isArray(queryResults) && queryResults.length > 0 ? (
                                <table className="w-full text-left border-collapse text-[11px]">
                                    <thead className="sticky top-0 bg-zinc-900 z-10 shadow-sm">
                                        <tr>
                                            {Object.keys(queryResults[0]).map((key) => (
                                                <th key={key} className="px-4 py-2 font-bold text-zinc-500 border-b border-white/5">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queryResults.map((row, i) => (
                                            <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                                                {Object.values(row).map((val: any, j) => (
                                                    <td key={j} className="px-4 py-2 font-mono text-zinc-400 truncate max-w-[300px]">
                                                        {val === null ? <span className="font-italic text-zinc-600">NULL</span> : String(val)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : queryResults ? (
                                <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 max-w-md">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <Terminal className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="text-zinc-200 font-bold text-sm mb-2 uppercase tracking-widest text-[11px]">Query Executed Successfully</h3>
                                        <p className="text-zinc-500 text-[10px] uppercase tracking-wider leading-relaxed">
                                            {Array.isArray(queryResults) 
                                                ? "The statement returned 0 rows. Your schema might be empty or the filter didn't match any data." 
                                                : "The query was processed by the engine without returning a dataset. (Affected rows: " + ((queryResults as any).rowCount || (queryResults as any).affectedRows || 0) + ")"
                                            }
                                        </p>
                                        {!Array.isArray(queryResults) && (
                                            <pre className="mt-4 p-4 rounded bg-black/40 text-[10px] text-zinc-400 font-mono text-left overflow-auto max-h-[200px]">
                                                {JSON.stringify(queryResults, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest gap-4">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    No output to display. Run a query first.
                                </div>
                            )
                        ) : (
                            /* History Tab View */
                            <div className="flex flex-col h-full">
                                {isLoadingHistory ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Retrieving audit logs...</span>
                                    </div>
                                ) : queryHistory.length > 0 ? (
                                    <table className="w-full text-left border-collapse text-[11px]">
                                        <thead className="sticky top-0 bg-zinc-900 z-10 shadow-sm">
                                            <tr>
                                                <th className="px-6 py-3 font-bold text-zinc-500 border-b border-white/5 w-16 uppercase tracking-tighter text-[9px]">Status</th>
                                                <th className="px-6 py-3 font-bold text-zinc-500 border-b border-white/5 uppercase tracking-tighter text-[9px]">SQL Query</th>
                                                <th className="px-6 py-3 font-bold text-zinc-500 border-b border-white/5 w-24 uppercase tracking-tighter text-[9px]">Duration</th>
                                                <th className="px-6 py-3 font-bold text-zinc-500 border-b border-white/5 w-40 uppercase tracking-tighter text-[9px]">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {queryHistory.map((log) => (
                                                <tr 
                                                    key={log.id} 
                                                    className="border-b border-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group/row"
                                                    onClick={() => {
                                                        handleUpdateCode(log.query);
                                                        toast.success("Query loaded from history");
                                                    }}
                                                >
                                                    <td className="px-6 py-3">
                                                        {log.success ? (
                                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                                        ) : (
                                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 font-mono text-zinc-300">
                                                        <div className="truncate max-w-[500px]">{log.query}</div>
                                                    </td>
                                                    <td className="px-6 py-3 font-mono text-zinc-500 text-[10px]">
                                                        {log.executionTimeMs}ms
                                                    </td>
                                                    <td className="px-6 py-3 text-zinc-600 text-[10px] whitespace-nowrap">
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 p-10 text-center gap-4">
                                        <History className="h-10 w-10 opacity-20" />
                                        <div className="max-w-xs">
                                            <h3 className="text-zinc-400 font-bold text-[11px] uppercase tracking-widest mb-1">No History Yet</h3>
                                            <p className="text-[10px] uppercase tracking-wider leading-relaxed opacity-60">
                                                Queries you run will appear here. You can click any entry to restore the SQL to the editor.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueryEditor;
