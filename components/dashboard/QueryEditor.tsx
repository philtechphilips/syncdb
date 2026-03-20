"use client";

import React, { useState } from "react";
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
    Loader2
} from "lucide-react";

const QueryEditor = () => {
    const [queries, setQueries] = useState([
        {
            id: 1,
            name: "query_1.sql",
            code: `-- Select all active users
SELECT 
    u.id, 
    u.name, 
    u.email, 
    u.role, 
    u.created_at, 
    u.status
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
AND o.amount > 100
ORDER BY u.created_at DESC
LIMIT 10;`
        }
    ]);
    const [activeQueryId, setActiveQueryId] = useState(1);

    const activeQuery = queries.find(q => q.id === activeQueryId) || queries[0];

    const handleNewQuery = () => {
        const newId = Math.max(...queries.map(q => q.id), 0) + 1;
        const newQuery = {
            id: newId,
            name: `query_${newId}.sql`,
            code: `-- New query ${newId}\nSELECT * FROM table_name LIMIT 10;`
        };
        setQueries([...queries, newQuery]);
        setActiveQueryId(newId);
    };

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

            <div className="flex flex-1 w-full overflow-hidden relative font-mono text-sm group">
                {/* Line Numbers */}
                <div
                    className="flex w-14 shrink-0 flex-col items-center bg-[#021016]/30 py-6 text-[11px] text-zinc-400 border-r border-white/5 select-none leading-7"
                    aria-hidden="true"
                >
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className={activeQuery.code.split('\n').length > i ? "text-zinc-300" : "text-zinc-600"}>
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Editor Area */}
                <textarea
                    value={activeQuery.code}
                    onChange={(e) => handleUpdateCode(e.target.value)}
                    className="w-full flex-1 resize-none bg-transparent p-6 leading-7 text-zinc-300 focus:outline-none scrollbar-hide selection:bg-primary/20 placeholder:text-zinc-900"
                    spellCheck={false}
                    autoFocus
                    placeholder="Enter your SQL query here..."
                    style={{ tabSize: 4 }}
                />

                {/* Connection Tooltip */}
                <div className="absolute top-6 right-8 flex items-center gap-3 px-4 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-[9px] font-black text-zinc-500 uppercase tracking-widest backdrop-blur-md opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,237,100,0.8)]"></div>
                    PostgreSQL 15.4
                </div>
            </div>

            {/* Action Bar */}
            <div className="w-full border-t border-white/5 p-2 bg-[#021016] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-4">
                    <span className="flex items-center gap-2">
                        <span className="text-zinc-500">UTF-8</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="text-zinc-500">Line:</span>
                        <span className="text-zinc-400">{activeQuery.code.split('\n').length}</span>
                    </span>
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
                        onClick={() => handleDeleteQuery(activeQueryId)}
                        className="p-2 rounded-lg text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-all group/btn relative"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-white/5">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QueryEditor;
