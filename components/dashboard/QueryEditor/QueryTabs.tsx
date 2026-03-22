import React from "react";
import { X, Sparkles } from "lucide-react";

interface QueryTabsProps {
    queries: any[];
    activeQueryId: number;
    onSetActive: (id: number) => void;
    onDelete: (id: number) => void;
    onNew: () => void;
    onToggleAi: () => void;
    isAiOpen: boolean;
}

const QueryTabs = ({
    queries,
    activeQueryId,
    onSetActive,
    onDelete,
    onNew,
    onToggleAi,
    isAiOpen
}: QueryTabsProps) => {
    return (
        <div className="w-full overflow-hidden border-b border-white/10 bg-[#021016]">
            <div className="flex items-center pl-4 overflow-x-auto scrollbar-hide">
                {queries.map((q) => (
                    <div
                        key={q.id}
                        onClick={() => onSetActive(q.id)}
                        className={`group flex shrink-0 items-center gap-3 px-6 py-2.5 text-[11px] font-bold border-x border-t transition-all cursor-pointer relative -mb-[1px] translate-y-[1px] ${activeQueryId === q.id
                            ? "bg-background border-white/10 text-primary"
                            : "border-transparent text-zinc-300 hover:text-white"
                            }`}
                    >
                        <div className={`h-1.5 w-1.5 rounded-full ${activeQueryId === q.id ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(0,237,100,0.5)]' : 'bg-zinc-600'}`}></div>
                        {q.name}
                        {queries.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(q.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-white/10 text-zinc-500 hover:text-white transition-all outline-none"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={onNew}
                    className="flex shrink-0 items-center gap-1.5 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-zinc-100 transition-all active:scale-95 outline-none border-x border-white/10"
                >
                    <span className="text-sm">+</span> New Query
                </button>
                <button
                    onClick={onToggleAi}
                    className={`flex shrink-0 items-center gap-2.5 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 outline-none border-r border-white/10 ${isAiOpen ? 'text-primary bg-primary/10' : 'text-zinc-300 hover:text-primary'}`}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Assistant
                </button>
            </div>
        </div>
    );
};

export default QueryTabs;
