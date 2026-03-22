import React from "react";
import { X, FileJson, FileSpreadsheet, FileText, Database, CheckCircle2 } from "lucide-react";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: string) => void;
    selectedRowsCount: number;
    showSelectedOnly: boolean;
    onToggleSelectedOnly: (val: boolean) => void;
    exportSuccess: string | null;
}

const ExportModal = ({
    isOpen,
    onClose,
    onExport,
    selectedRowsCount,
    showSelectedOnly,
    onToggleSelectedOnly,
    exportSuccess
}: ExportModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Export Data</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Select your preferred format</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-3">
                    {[
                        { id: 'json', label: 'JSON', icon: FileJson, desc: 'JavaScript Object Notation' },
                        { id: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Comma Separated Values' },
                        { id: 'markdown', label: 'Markdown', icon: FileText, desc: 'GitHub Flavored Table' },
                        { id: 'sql', label: 'SQL', icon: Database, desc: 'SQL Insert Statements' },
                    ].map((format) => (
                        <button
                            key={format.id}
                            onClick={() => onExport(format.id)}
                            className="flex flex-col items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 transition-all text-left group"
                        >
                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                <format.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{format.label}</span>
                                    {exportSuccess === format.id && (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-primary animate-in zoom-in" />
                                    )}
                                </div>
                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight mt-0.5">{format.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${selectedRowsCount > 0 ? 'bg-primary' : 'bg-zinc-700'}`}></div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            {selectedRowsCount > 0 ? `${selectedRowsCount} Rows Selected` : 'Full Dataset'}
                        </span>
                    </div>
                    {selectedRowsCount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-zinc-600 uppercase">Export Selection Only</span>
                            <input
                                type="checkbox"
                                checked={showSelectedOnly}
                                onChange={(e) => onToggleSelectedOnly(e.target.checked)}
                                className="accent-primary w-3.5 h-3.5"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
