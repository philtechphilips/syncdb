import React from "react";
import { MousePointer2, Maximize2, RefreshCcw } from "lucide-react";

interface DiagramOverlayProps {
    onClearFocus: () => void;
    activeTableId: string | null;
}

const DiagramOverlay = ({ onClearFocus, activeTableId }: DiagramOverlayProps) => {
    return (
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <div className="rounded-full border border-white/10 bg-[#021016]/80 px-3 py-1.5 flex items-center gap-4 text-[9px] font-black text-zinc-500 backdrop-blur-xl shadow-md uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <MousePointer2 className="h-3 w-3" />
                    <span>Drag to Pan</span>
                </div>
                <div className="h-2 w-px bg-white/10"></div>
                <div className="flex items-center gap-1.5 text-primary">
                    <Maximize2 className="h-3 w-3" />
                    <span>Click Table to Focus Relationships</span>
                </div>
            </div>
            {activeTableId && (
                <button 
                    onClick={onClearFocus}
                    className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 flex items-center gap-2 text-[9px] font-black text-primary backdrop-blur-xl shadow-md uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                    <RefreshCcw className="h-2.5 w-2.5" />
                    Clear Focus
                </button>
            )}
        </div>
    );
};

export default DiagramOverlay;
