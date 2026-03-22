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
    onSetExplainLevel
}: AiAssistantBarProps) => {
    if (!isOpen) return null;

    return (
        <div className="w-full bg-[#030d12] border-y border-primary/20 animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-white/[0.03] p-1 rounded-lg border border-white/5">
                        {(["generate", "explain", "optimize"] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => onSetMode(m)}
                                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,237,100,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-4 w-px bg-white/10 shrink-0"></div>

                {mode === "generate" ? (
                    <div className="flex-1 flex items-center gap-4">
                        <Sparkles className={`h-4 w-4 text-primary shrink-0 ${isGenerating ? 'animate-spin' : ''}`} />
                        <input
                            value={prompt}
                            onChange={(e) => onSetPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onRun()}
                            placeholder="e.g. 'Get all users who signed up last week'"
                            className="flex-1 bg-transparent border-none outline-none text-[12px] font-medium text-zinc-200 placeholder:text-zinc-500"
                            autoFocus
                        />
                    </div>
                ) : mode === "explain" ? (
                    <div className="flex-1 flex items-center gap-6">
                        <div className="flex items-center gap-3 shrink-0">
                            <HelpCircle className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Explain Mode:</span>
                            <select 
                                value={explainLevel}
                                onChange={(e: any) => onSetExplainLevel(e.target.value)}
                                className="bg-black/40 border border-white/10 text-zinc-300 text-[9px] px-2 py-1 rounded outline-none focus:border-primary/50 transition-colors uppercase font-bold"
                            >
                                <option value="simple">Simple</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium italic truncate">AI will analyze the current SQL in your editor...</p>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center gap-4">
                        <Zap className={`h-4 w-4 text-primary shrink-0 ${isGenerating ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Optimization Audit:</span>
                        <p className="text-[10px] text-zinc-500 font-medium italic truncate">AI will scan for missing indexes and inefficient joins...</p>
                    </div>
                )}

                <div className="flex items-center gap-4 shrink-0">
                    {isGenerating ? (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary animate-pulse whitespace-nowrap">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {(mode === "generate" ? "ENGINEERING SQL..." : mode === "explain" ? "ANALYZING..." : "AUDITING PERFORMANCE...")}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={onRun}
                                className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-sm whitespace-nowrap"
                            >
                                Run AI {mode}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:text-white text-zinc-500 hover:bg-white/5 rounded-lg transition-all"
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
