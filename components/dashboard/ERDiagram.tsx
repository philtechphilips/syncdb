"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Maximize2,
    ZoomIn,
    ZoomOut,
    RefreshCcw,
    MousePointer2,
    Table as TableIcon,
    ChevronDown,
    ChevronRight,
    Search,
    Grid3X3,
    Minimize2
} from "lucide-react";

interface Node {
    id: string;
    name: string;
    x: number;
    y: number;
    isExpanded: boolean;
    columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[];
}

interface Edge {
    source: string;
    target: string;
}

const ERDiagram = () => {
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: "users",
            name: "users",
            x: 100,
            y: 80,
            isExpanded: true,
            columns: [
                { name: "id", type: "uuid", isPk: true },
                { name: "email", type: "varchar" },
                { name: "username", type: "varchar" },
                { name: "role_id", type: "uuid", isFk: true },
            ]
        },
        {
            id: "roles",
            name: "roles",
            x: 450,
            y: 100,
            isExpanded: true,
            columns: [
                { name: "id", type: "uuid", isPk: true },
                { name: "name", type: "varchar" },
                { name: "permissions", type: "jsonb" },
            ]
        },
        {
            id: "posts",
            name: "posts",
            x: 250,
            y: 350,
            isExpanded: true,
            columns: [
                { name: "id", type: "uuid", isPk: true },
                { name: "title", type: "varchar" },
                { name: "content", type: "text" },
                { name: "author_id", type: "uuid", isFk: true },
            ]
        }
    ]);

    const [edges] = useState<Edge[]>([
        { source: "users", target: "roles" },
        { source: "posts", target: "users" }
    ]);

    const [draggingNode, setDraggingNode] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
    const [panning, setPanning] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent, node: Node) => {
        setDraggingNode({
            id: node.id,
            offsetX: (e.clientX / zoom) - node.x,
            offsetY: (e.clientY / zoom) - node.y
        });
        e.stopPropagation();
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left click on background for panning
            setPanning({
                startX: e.clientX - canvasOffset.x,
                startY: e.clientY - canvasOffset.y,
                currentX: e.clientX,
                currentY: e.clientY
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingNode) {
            setNodes(prev => prev.map(n =>
                n.id === draggingNode.id
                    ? { ...n, x: (e.clientX / zoom) - draggingNode.offsetX, y: (e.clientY / zoom) - draggingNode.offsetY }
                    : n
            ));
        } else if (panning) {
            setCanvasOffset({
                x: e.clientX - panning.startX,
                y: e.clientY - panning.startY
            });
        }
    };

    const handleMouseUp = () => {
        setDraggingNode(null);
        setPanning(null);
    };

    const toggleExpand = (nodeId: string) => {
        setNodes(prev => prev.map(n =>
            n.id === nodeId ? { ...n, isExpanded: !n.isExpanded } : n
        ));
    };

    const getNodePoint = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        // Return center of node side
        return {
            x: node.x + 104, // Half width (w-52 = 208px / 2)
            y: node.y + (node.isExpanded ? (node.columns.length * 28 + 40) / 2 : 20)
        };
    };

    return (
        <div
            className={`flex flex-col overflow-hidden rounded-xl border border-border bg-muted/10 backdrop-blur-sm select-none transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[100] h-screen w-screen bg-background rounded-none border-none' : 'h-full min-h-[600px]'}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Toolbar */}
            <div className={`flex items-center justify-between border-b border-border bg-background px-4 py-2 ${isFullscreen ? 'h-14 px-8' : ''}`}>
                <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground">
                    <div className="flex items-center gap-2 text-primary">
                        <MousePointer2 className="h-3.5 w-3.5" />
                        <span>INTERACTIVE CANVAS</span>
                    </div>
                    <div className="h-4 w-px bg-border"></div>
                    <span className="flex items-center gap-2">
                        <Grid3X3 className="h-3.5 w-3.5" />
                        public schema
                    </span>
                    {isFullscreen && (
                        <span className="ml-4 px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] uppercase">Full Width Mode</span>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center bg-muted/50 rounded-lg border border-border p-0.5">
                        <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="rounded p-1 hover:bg-background transition-colors"><ZoomOut className="h-3.5 w-3.5" /></button>
                        <span className="text-[10px] font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="rounded p-1 hover:bg-background transition-colors"><ZoomIn className="h-3.5 w-3.5" /></button>
                    </div>
                    <button
                        onClick={() => { setCanvasOffset({ x: 0, y: 0 }); setZoom(1); }}
                        className="rounded-lg border border-border bg-background p-1.5 shadow-sm hover:bg-muted transition-colors" title="Reset View"
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="rounded-lg border border-border bg-background p-1.5 shadow-sm hover:bg-muted transition-colors"
                    >
                        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div
                className="relative flex-1 overflow-hidden p-8 bg-zinc-50 dark:bg-zinc-950/20"
                onMouseDown={handleCanvasMouseDown}
            >
                {/* Visual Grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
                        backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
                        backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
                    }}
                ></div>

                {/* Transformable Area */}
                <div
                    className="absolute inset-0"
                    style={{
                        transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
                        transformOrigin: '0 0'
                    }}
                >
                    {/* SVG Connections - Dynamically Calculated */}
                    <svg className="absolute inset-0 h-[5000px] w-[5000px] pointer-events-none">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" className="fill-primary/40" />
                            </marker>
                        </defs>
                        {edges.map((edge, i) => {
                            const start = getNodePoint(edge.source);
                            const end = getNodePoint(edge.target);

                            // Bezier curve calculation
                            const dx = end.x - start.x;
                            const dy = end.y - start.y;
                            const cp1x = start.x + dx * 0.5;
                            const cp1y = start.y;
                            const cp2x = start.x + dx * 0.5;
                            const cp2y = end.y;

                            return (
                                <path
                                    key={i}
                                    d={`M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`}
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="text-primary/40"
                                    fill="none"
                                    markerEnd="url(#arrowhead)"
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes */}
                    {nodes.map((node) => (
                        <div
                            key={node.id}
                            onMouseDown={(e) => handleMouseDown(e, node)}
                            className={`absolute w-52 rounded-xl border bg-background shadow-lg transition-shadow duration-75 ${draggingNode?.id === node.id ? 'shadow-2xl ring-2 ring-primary/30 z-10 cursor-grabbing' : 'cursor-grab hover:shadow-xl'}`}
                            style={{ left: node.x, top: node.y }}
                        >
                            <div className={`flex items-center justify-between rounded-t-xl px-3 py-2 border-b border-border ${node.isExpanded ? 'bg-muted/30' : 'bg-background hover:bg-muted/20'}`}>
                                <div className="flex items-center gap-2">
                                    <TableIcon className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-[11px] font-bold text-foreground">{node.name}</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                                    className="p-1 rounded hover:bg-muted transition-colors"
                                >
                                    {node.isExpanded ? <ChevronDown className="h-3 w-3.5" /> : <ChevronRight className="h-3 w-3.5" />}
                                </button>
                            </div>

                            {node.isExpanded && (
                                <div className="p-2 space-y-0.5">
                                    {node.columns.map((col, i) => (
                                        <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors group">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1 w-1 rounded-full ${col.isPk ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' : col.isFk ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                                                <span className={`text-[10px] font-medium ${col.isPk ? 'text-amber-600' : 'text-foreground'}`}>{col.name}</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                                {col.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="rounded-full border border-border bg-background/90 px-3 py-1.5 flex items-center gap-2 text-[9px] font-black text-muted-foreground backdrop-blur-xl shadow-md uppercase tracking-widest">
                    <MousePointer2 className="h-3 w-3" />
                    Drag to Pan • Left Click to Move Tables
                </div>
            </div>

            {isFullscreen && (
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-6 right-8 z-[110] px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl"
                >
                    Close Fullscreen [Esc]
                </button>
            )}
        </div>
    );
};

export default ERDiagram;
