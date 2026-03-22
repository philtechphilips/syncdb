import React from "react";
import { Loader2, Play, AlignLeft, CopyCheck, Copy, Eraser } from "lucide-react";

interface EditorActionsProps {
    isRunning: boolean;
    onRun: () => void;
    onFormat: () => void;
    onCopy: () => void;
    onClear: () => void;
    copied: boolean;
    clusterSelected: boolean;
}

const EditorActions = ({
    isRunning,
    onRun,
    onFormat,
    onCopy,
    onClear,
    copied,
    clusterSelected
}: EditorActionsProps) => {
    return (
        <div className="w-full border-y border-white/5 p-2 bg-[#021016] flex items-center justify-between px-6 shrink-0 h-14">
            <div className="flex items-center gap-4 text-left">
                <button
                    onClick={onRun}
                    disabled={isRunning || !clusterSelected}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-[#021016] text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                    Run Query
                </button>
                <button
                    onClick={onFormat}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 rounded-lg transition-all"
                >
                    <AlignLeft className="h-3.5 w-3.5" />
                    Format SQL
                </button>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onCopy}
                    className={`p-2 rounded-lg transition-all group/btn relative ${copied ? 'text-primary bg-primary/10' : 'text-zinc-600 hover:bg-white/5 hover:text-white'}`}
                >
                    {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-white/5 whitespace-nowrap">
                        {copied ? 'Copied!' : 'Copy Code'}
                    </span>
                </button>
                <button
                    onClick={onClear}
                    className="p-2 rounded-lg text-zinc-600 hover:bg-white/5 hover:text-white transition-all group/btn relative"
                >
                    <Eraser className="h-4 w-4" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-white/5 whitespace-nowrap">Clear SQL</span>
                </button>
            </div>
        </div>
    );
};

export default EditorActions;
