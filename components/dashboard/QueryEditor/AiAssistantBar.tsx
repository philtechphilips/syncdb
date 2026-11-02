import React from "react";
import { Sparkles, HelpCircle, Zap, Loader2, X } from "lucide-react";

interface AiAssistantBarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "generate" | "explain" | "optimize";
  onSetMode: (mode: "generate" | "explain" | "optimize") => void;
  prompt: string;
  onSetPrompt: (prompt: string) => void;
  onRun: () => void;
  isGenerating: boolean;
  explainLevel: "simple" | "advanced";
  onSetExplainLevel: (level: "simple" | "advanced") => void;
}

const AiAssistantBar = ({
  isOpen,
  onClose,
  mode,
  onSetMode,
  prompt,
  onSetPrompt,
  onRun,
  isGenerating,
  explainLevel,
  onSetExplainLevel,
}: AiAssistantBarProps) => {
  if (!isOpen) return null;

  return (
    <div className="w-full bg-background border-y border-primary/20 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-ink/[0.03] p-1 rounded-lg border border-border">
            {(["generate", "explain", "optimize"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onSetMode(m)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${mode === m ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-ink/10 shrink-0"></div>

        {mode === "generate" ? (
          <div className="flex-1 flex items-center gap-4">
            <Sparkles
              className={`h-4 w-4 text-accent-fg shrink-0 ${isGenerating ? "animate-spin" : ""}`}
            />
            <input
              value={prompt}
              onChange={(e) => onSetPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onRun()}
              placeholder="e.g. 'Get all users who signed up last week'"
              className="flex-1 bg-transparent border-none outline-none text-[12px] font-medium text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        ) : mode === "explain" ? (
          <div className="flex-1 flex items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <HelpCircle className="h-4 w-4 text-subtle" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Explain Mode:
              </span>
              <select
                value={explainLevel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onSetExplainLevel(e.target.value as "simple" | "advanced")
                }
                className="bg-background border border-line-strong text-foreground/80 text-[11px] px-2 py-1 rounded outline-none focus:border-primary/60 transition-colors"
              >
                <option value="simple">Simple</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <p className="text-[11px] text-muted-foreground italic truncate">
              AI will analyze the current SQL in your editor...
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-4">
            <Zap
              className={`h-4 w-4 text-accent-fg shrink-0 ${isGenerating ? "animate-pulse" : ""}`}
            />
            <span className="text-[11px] font-medium text-muted-foreground">
              Optimization Audit:
            </span>
            <p className="text-[11px] text-muted-foreground italic truncate">
              AI will scan for missing indexes and inefficient joins...
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 shrink-0">
          {isGenerating ? (
            <div className="flex items-center gap-2 text-[11px] font-medium text-accent-fg animate-pulse whitespace-nowrap">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {mode === "generate"
                ? "ENGINEERING SQL..."
                : mode === "explain"
                  ? "ANALYZING..."
                  : "AUDITING PERFORMANCE..."}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onRun}
                className="px-4 py-1.5 bg-ink/5 border border-border rounded-lg text-[11px] font-medium text-accent-fg hover:bg-primary hover:text-white transition-all shadow-sm whitespace-nowrap"
              >
                Run AI {mode}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:text-foreground text-muted-foreground hover:bg-ink/5 rounded-lg transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiAssistantBar;
