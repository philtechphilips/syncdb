"use client";

import React, { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { format } from "sql-formatter";
import { toast } from "sonner";
import { useClusterStore } from "@/store/useClusterStore";
import api from "@/lib/api";

// Sub-components
import QueryTabs from "./QueryEditor/QueryTabs";
import AiAssistantBar from "./QueryEditor/AiAssistantBar";
import EditorActions from "./QueryEditor/EditorActions";
import QueryResultsArea from "./QueryEditor/QueryResultsArea";

const QueryEditor = () => {
    const { selectedCluster, executeQuery, fetchSchema, fetchQueryLogs } = useClusterStore();
    const monaco = useMonaco();
    
    // Core State
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

    // UI/AI State
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiMode, setAiMode] = useState<"generate" | "explain" | "optimize">("generate");
    const [explainLevel, setExplainLevel] = useState<"simple" | "advanced">("simple");
    const [aiOutput, setAiOutput] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const activeQuery = queries.find(q => q.id === activeQueryId) || queries[0];

    // -------------------------------------------------------------------------
    // Effects
    // -------------------------------------------------------------------------

    // Autocomplete Setup
    useEffect(() => {
        if (selectedCluster) fetchSchema(selectedCluster.id).then(setSchemaMetadata);
    }, [selectedCluster?.id, fetchSchema]);

    useEffect(() => {
        if (!monaco || schemaMetadata.length === 0) return;
        const tableNames = Array.from(new Set(schemaMetadata.map(s => s.tableName || s.table_name)));
        const columns = schemaMetadata.map(s => ({ table: s.tableName || s.table_name, name: s.name }));
        const provider = monaco.languages.registerCompletionItemProvider('sql', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
                const suggestions: any[] = [
                    ...['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'AND', 'OR', 'AS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].map(k => ({ label: k, kind: monaco.languages.CompletionItemKind.Keyword, insertText: k, range })),
                    ...tableNames.map(t => ({ label: t, kind: monaco.languages.CompletionItemKind.Struct, insertText: t, detail: 'Table', range })),
                    ...columns.map(c => ({ label: c.name, kind: monaco.languages.CompletionItemKind.Field, insertText: c.name, detail: `Column of ${c.table}`, range })),
                ];
                return { suggestions };
            },
        });
        return () => provider.dispose();
    }, [monaco, schemaMetadata]);

    // Load History
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
        if (bottomTab === "history" && selectedCluster) loadHistory();
    }, [bottomTab, selectedCluster?.id]);

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------

    const handleUpdateCode = (newCode: string) => {
        setQueries(queries.map(q => q.id === activeQueryId ? { ...q, code: newCode } : q));
    };

    const handleRunQuery = async () => {
        if (!selectedCluster) return toast.error("Please select a cluster first");
        
        const sql = activeQuery.code.trim();
        if (!sql) return;

        const lowerSql = sql.toLowerCase();
        if (lowerSql.includes("drop database")) return toast.error("Strictly prohibited command.");

        const destructive = ["drop table", "truncate", "delete", "update", "alter table"].filter(k => lowerSql.includes(k));
        if (destructive.length > 0 && !window.confirm(`Destructive action warning: ${destructive.join(", ").toUpperCase()}. Proceed?`)) return;

        setIsRunning(true);
        setQueryResults(null);
        try {
            const results = await executeQuery(selectedCluster.id, sql);
            setQueryResults(results);
            setBottomTab("results");
            toast.success("Query executed");
            if (bottomTab === "history") loadHistory();
        } catch (err: any) {
            toast.error(err.message || "Execution failed");
        } finally {
            setIsRunning(false);
        }
    };

    const handleAskAi = async () => {
        if (aiMode === "generate" && !aiPrompt.trim()) return;
        if (!selectedCluster) return;

        setIsGenerating(true);
        setAiOutput(null);

        try {
            if (aiMode === "generate") {
                const response = await api.post(`/v1/ai/${selectedCluster.id}/generate`, { prompt: aiPrompt });
                handleUpdateCode(response.data.sql);
                setIsAiOpen(false);
                setAiPrompt("");
                toast.success("SQL generated");
            } else if (aiMode === "explain") {
                const response = await api.post(`/v1/ai/explain`, { sql: activeQuery.code, mode: explainLevel });
                setAiOutput(response.data.explanation);
                setBottomTab("results");
                setQueryResults(null);
            } else if (aiMode === "optimize") {
                const response = await api.post(`/v1/ai/${selectedCluster.id}/optimize`, { sql: activeQuery.code });
                setAiOutput(response.data.suggestions);
                setBottomTab("results");
                setQueryResults(null);
            }
        } catch (error) {
            toast.error("AI service failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFormat = () => {
        try {
            handleUpdateCode(format(activeQuery.code, { language: 'postgresql', keywordCase: 'upper' }));
            toast.success("Formatted");
        } catch (e) { toast.error("Format failed"); }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(activeQuery.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-background font-sans min-w-0 w-full overflow-hidden">
            <QueryTabs 
                queries={queries}
                activeQueryId={activeQueryId}
                onSetActive={setActiveQueryId}
                onDelete={(id) => {
                    if (queries.length === 1) return handleUpdateCode("");
                    const next = queries.filter(q => q.id !== id);
                    setQueries(next);
                    if (activeQueryId === id) setActiveQueryId(next[0].id);
                }}
                onNew={() => {
                    const id = Math.max(...queries.map(q => q.id), 0) + 1;
                    const q = { id, name: `query_${id}.sql`, code: `-- New query ${id}\nSELECT * FROM users LIMIT 10;` };
                    setQueries([...queries, q]);
                    setActiveQueryId(id);
                }}
                onToggleAi={() => setIsAiOpen(!isAiOpen)}
                isAiOpen={isAiOpen}
            />

            <AiAssistantBar 
                isOpen={isAiOpen}
                mode={aiMode}
                onSetMode={setAiMode}
                prompt={aiPrompt}
                onSetPrompt={setAiPrompt}
                onRun={handleAskAi}
                isGenerating={isGenerating}
                explainLevel={explainLevel}
                onSetExplainLevel={setExplainLevel}
                onClose={() => setIsAiOpen(false)}
            />

            <div className={`flex flex-col w-full overflow-hidden relative font-mono text-sm group transition-all duration-500 min-h-0 ${queryResults ? 'flex-[1.5]' : 'flex-1'}`}>
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
                        scrollBeyondLastLine: false,
                        readOnly: isRunning,
                        automaticLayout: true,
                        padding: { top: 20 },
                        fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                    }}
                />

                <div className="absolute top-6 right-8 flex items-center gap-3 px-4 py-1.5 rounded-lg border border-white/5 bg-black/40 text-[9px] font-black text-zinc-500 uppercase tracking-widest backdrop-blur-md opacity-40 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className={`h-1.5 w-1.5 rounded-full ${selectedCluster ? 'bg-primary shadow-[0_0_8px_rgba(0,237,100,0.8)]' : 'bg-red-500'}`}></div>
                    {selectedCluster ? `${selectedCluster.type === 'postgres' ? 'PostgreSQL' : 'MySQL'} - ${selectedCluster.database}` : 'No Cluster Selected'}
                </div>
            </div>

            <EditorActions 
                isRunning={isRunning}
                onRun={handleRunQuery}
                onFormat={handleFormat}
                onCopy={handleCopy}
                onClear={() => handleUpdateCode("")}
                copied={copied}
                clusterSelected={!!selectedCluster}
            />

            <QueryResultsArea 
                queryResults={queryResults}
                bottomTab={bottomTab}
                onSetTab={setBottomTab}
                onClose={() => { setQueryResults(null); setBottomTab("results"); }}
                aiOutput={aiOutput}
                onCloseAiOutput={() => setAiOutput(null)}
                aiMode={aiMode}
                isLoadingHistory={isLoadingHistory}
                queryHistory={queryHistory}
                onRestoreQuery={(sql) => { handleUpdateCode(sql); toast.success("Query loaded"); }}
            />
        </div>
    );
};

export default QueryEditor;
