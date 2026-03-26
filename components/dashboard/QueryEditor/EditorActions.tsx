import {
  Loader2,
  Play,
  AlignLeft,
  CopyCheck,
  Copy,
  Eraser,
  Save,
  Library
} from "lucide-react";

interface EditorActionsProps {
  isRunning: boolean;
  onRun: () => void;
  onFormat: () => void;
  onCopy: () => void;
  onClear: () => void;
  onSave: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  copied: boolean;
  clusterSelected: boolean;
}

const EditorActions = ({
  isRunning,
  onRun,
  onFormat,
  onCopy,
  onClear,
  onSave,
  onToggleSidebar,
  isSidebarOpen,
  copied,
  clusterSelected,
}: EditorActionsProps) => {
  return (
    <div className="w-full border-y border-border/50 p-2 bg-[#021016] flex items-center justify-between px-4 lg:px-6 shrink-0 h-auto min-h-[3.5rem] flex-wrap gap-y-2">
      <div className="flex items-center gap-2 lg:gap-4 text-left">
        <button
          onClick={onRun}
          disabled={isRunning || !clusterSelected}
          className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-primary/95 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale whitespace-nowrap"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-white" />
          )}
          Run Query
        </button>
        <button
          onClick={onFormat}
          className="flex items-center gap-2 px-3 lg:px-4 py-2 text-white hover:text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 rounded-lg transition-all whitespace-nowrap"
        >
          <AlignLeft className="h-3.5 w-3.5 text-white" />
          <span className="hidden sm:inline">Format SQL</span>
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 lg:px-4 py-2 text-white hover:text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 rounded-lg transition-all whitespace-nowrap"
        >
          <Save className="h-3.5 w-3.5 text-white" />
          <span className="hidden sm:inline">Save Query</span>
        </button>
      </div>
      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={onCopy}
          className={`p-2 rounded-lg transition-all group/btn relative ${copied ? "text-white bg-primary/10" : "text-white hover:bg-white/5 hover:text-white"}`}
        >
          {copied ? (
            <CopyCheck className="h-4 w-4 text-white" />
          ) : (
            <Copy className="h-4 w-4 text-white" />
          )}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-border/50 whitespace-nowrap">
            {copied ? "Copied!" : "Copy Code"}
          </span>
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded-lg text-white hover:bg-white/5 hover:text-white transition-all group/btn relative"
        >
          <Eraser className="h-4 w-4 text-white" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-border/50 whitespace-nowrap">
            Clear SQL
          </span>
        </button>

        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-all group/btn relative ${isSidebarOpen ? "bg-primary/10 text-primary" : "text-white hover:bg-white/5"}`}
        >
          <Library className="h-4 w-4" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none border border-border/50 whitespace-nowrap">
            {isSidebarOpen ? "Hide Library" : "Show Library"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default EditorActions;
