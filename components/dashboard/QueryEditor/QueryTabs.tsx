import React from "react";
import { X, Sparkles } from "lucide-react";

interface QueryTabsProps {
  queries: { id: number; name: string }[];

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
  isAiOpen,
}: QueryTabsProps) => {
  return (
    <div className="w-full overflow-hidden border-b border-border bg-background">
      <div className="flex items-center pl-4 overflow-x-auto thin-scrollbar">
        {queries.map((q) => (
          <div
            key={q.id}
            onClick={() => onSetActive(q.id)}
            className={`group flex shrink-0 items-center gap-3 px-6 py-2.5 text-[11px] font-medium border-x border-t transition-all cursor-pointer relative -mb-[1px] translate-y-[1px] ${
              activeQueryId === q.id
                ? "bg-background border-border text-accent-fg"
                : "border-transparent text-foreground/80 hover:text-foreground"
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${activeQueryId === q.id ? "bg-primary" : "bg-ink/20"}`}
            ></div>
            {q.name}
            {queries.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(q.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-ink/10 text-muted-foreground hover:text-foreground transition-all outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={onNew}
          className="flex shrink-0 items-center gap-1.5 px-6 py-2.5 text-[11px] font-medium text-foreground/80 hover:text-foreground transition-all active:scale-95 outline-none border-x border-border"
        >
          <span className="text-sm">+</span> New Query
        </button>
        <button
          onClick={onToggleAi}
          className={`flex shrink-0 items-center gap-2.5 px-6 py-2.5 text-[11px] font-medium transition-all active:scale-95 outline-none border-r border-border ${isAiOpen ? "text-accent-fg bg-primary/10" : "text-foreground/80 hover:text-accent-fg"}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Assistant
        </button>
      </div>
    </div>
  );
};

export default QueryTabs;
