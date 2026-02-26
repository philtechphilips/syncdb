"use client";

import React from "react";
import {
    Search,
    Bell,
    User,
    ChevronRight,
    Play,
    Database
} from "lucide-react";

interface NavbarProps {
    onOpenConnect: () => void;
}

const Navbar = ({ onOpenConnect }: NavbarProps) => {
    return (
        <nav className="fixed right-0 top-0 z-30 flex h-14 w-[calc(100%-16rem)] items-center justify-between border-b border-white/5 bg-background px-6 font-sans overflow-hidden">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                    <span className="hover:text-foreground cursor-pointer transition-colors">Projects</span>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
                    <span className="text-foreground font-bold">Main Service</span>
                </div>
                <div className="h-4 w-px bg-border mx-2"></div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-black text-primary border border-primary/20">
                    <div className="h-1 w-1 rounded-full bg-primary"></div>
                    SECURE
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r border-border pr-4 mr-2">
                    <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95">
                        <Play className="h-3 w-3 fill-primary-foreground" />
                        Run Query
                    </button>
                    <button className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-all" onClick={onOpenConnect}>
                        <Database className="h-3 w-3" />
                        Connect
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Command + K to search..."
                            className="h-8 w-48 rounded-md border border-border bg-muted/20 pl-9 pr-3 text-[11px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                        />
                    </div>
                    <button className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <Bell className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
