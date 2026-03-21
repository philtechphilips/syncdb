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
    Minimize2,
    Loader2,
    Eye,
    Download,
    FileImage,
    FileText,
    ChevronDown as DropdownIcon
} from "lucide-react";
import { useClusterStore } from "@/store/useClusterStore";
import { useMemo } from "react";
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { toast } from "sonner";

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
    sourceColumn?: string;
}

const ERDiagram = () => {
    const { selectedCluster, fetchSchema } = useClusterStore();
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [activeTableId, setActiveTableId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const diagramRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const exportDiagram = async (format: 'png' | 'jpeg' | 'pdf') => {
        if (!contentRef.current) return;
        
        setIsExporting(true);
        const toastId = toast.loading(`Preparing Full ${format.toUpperCase()} export...`);
        
        try {
            // Find nodes bounding box to capture exactly what exists
            const activeNodes = filteredNodes.length > 0 ? filteredNodes : nodes;
            if (activeNodes.length === 0) {
                toast.error("No tables to export", { id: toastId });
                return;
            }
            
            // Calculate content boundaries
            const minX = Math.min(...activeNodes.map(n => n.x)) - 100;
            const minY = Math.min(...activeNodes.map(n => n.y)) - 100;
            const maxX = Math.max(...activeNodes.map(n => n.x)) + 350; 
            const maxY = Math.max(...activeNodes.map(n => n.y)) + 500; 
            
            const width = maxX - minX;
            const height = maxY - minY;

            const options = {
                pixelRatio: 2, 
                bgcolor: '#ffffff',
                width,
                height,
                style: {
                    transform: `translate(${-minX}px, ${-minY}px) scale(1)`,
                    transformOrigin: 'top left',
                    width: `${width}px`,
                    height: `${height}px`,
                }
            };

            const dataUrl = format === 'jpeg' 
                ? await toJpeg(contentRef.current, options)
                : await toPng(contentRef.current, options);
                
            if (format === 'pdf') {
                const orientation = width > height ? 'l' : 'p';
                const pdf = new jsPDF(orientation, 'px', [width, height]);
                pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
                pdf.save(`ER-Diagram-Full-${selectedCluster?.name}.pdf`);
            } else {
                const link = document.createElement('a');
                link.download = `ER-Diagram-Full-${selectedCluster?.name}.${format}`;
                link.href = dataUrl;
                link.click();
            }
            toast.success(`Full ER Diagram exported`, { id: toastId });
        } catch (err) {
            console.error("Export failed", err);
            toast.error("Export failed. The schema might be too large for browser memory.", { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        if (!selectedCluster) return;

        const loadSchema = async () => {
            if (!selectedCluster) return;
            setIsLoading(true);
            try {
                const schema = await fetchSchema(selectedCluster.id);
                
                // Group columns by tableName
                const tables: Record<string, any[]> = {};
                schema.forEach(col => {
                    const tName = col.tableName || col.table_name; // Handle potential case differences
                    if (!tables[tName]) tables[tName] = [];
                    tables[tName].push(col);
                });

                const newNodes: Node[] = [];
                const newEdges: Edge[] = [];
                
                const tableNames = Object.keys(tables).sort();

                // Generate preliminary edges to calculate ranks
                tableNames.forEach(name => {
                    const columns = tables[name];
                    columns.forEach(c => {
                        if (c.referencedTable) {
                            if (tables[c.referencedTable]) {
                                newEdges.push({
                                    source: name,
                                    target: c.referencedTable,
                                    sourceColumn: c.name
                                });
                            }
                        }
                    });
                });

                // Calculate ranks based on connection flow (Topological-ish sorting)
                const tableRanks: Record<string, number> = {};
                tableNames.forEach(t => tableRanks[t] = 0);
                newEdges.forEach(edge => {
                    tableRanks[edge.source]--;
                    tableRanks[edge.target]++;
                });

                // Group tables by their relative rank to create levels (columns)
                const rankGroups: Record<number, string[]> = {};
                tableNames.forEach(t => {
                    const r = tableRanks[t];
                    if (!rankGroups[r]) rankGroups[r] = [];
                    rankGroups[r].push(t);
                });

                const sortedRanks = Object.keys(rankGroups).map(Number).sort((a, b) => a - b);
                
                // Position nodes in a leveled layout (Supabase style)
                sortedRanks.forEach((rank, colIdx) => {
                    const group = rankGroups[rank].sort();
                    group.forEach((name, rowIdx) => {
                        const columns = tables[name];
                        newNodes.push({
                            id: name,
                            name: name,
                            x: colIdx * 450 + 100,
                            y: rowIdx * 450 + 100,
                            isExpanded: true,
                            columns: columns.map(c => ({
                                name: c.name,
                                type: c.type || c.udtName || 'unknown',
                                isPk: c.columnKey === 'PRI' || c.columnKey?.includes('PRIMARY') || c.name === 'id' || c.name === 'uuid',
                                isFk: !!c.referencedTable
                            }))
                        });
                    });
                });

                setNodes(newNodes);
                setEdges(newEdges);
            } catch (err) {
                console.error("Failed to load ER diagram schema:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadSchema();
    }, [selectedCluster?.id, fetchSchema]);

    const filteredNodes = useMemo(() => {
        if (!search && !activeTableId) return nodes;

        const matchingIds = new Set<string>();
        
        if (search) {
            nodes.forEach(n => {
                if (n.name.toLowerCase().includes(search.toLowerCase())) {
                    matchingIds.add(n.id);
                }
            });
        } else if (activeTableId) {
            matchingIds.add(activeTableId);
        }

        if (matchingIds.size === 0) return [];

        const visibleIds = new Set<string>(matchingIds);
        edges.forEach(e => {
            if (matchingIds.has(e.source)) visibleIds.add(e.target);
            if (matchingIds.has(e.target)) visibleIds.add(e.source);
        });

        return nodes.filter(n => visibleIds.has(n.id));
    }, [nodes, edges, search, activeTableId]);

    const filteredEdges = useMemo(() => {
        const visibleIds = new Set(filteredNodes.map(n => n.id));
        return edges.filter(e => visibleIds.has(e.source) && visibleIds.has(e.target));
    }, [edges, filteredNodes]);

    const toggleAll = (expanded: boolean) => {
        setNodes(prev => prev.map((n: Node) => ({ ...n, isExpanded: expanded })));
    };

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
            setNodes((prev: Node[]) => prev.map((n: Node) =>
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
        setNodes((prev: Node[]) => prev.map((n: Node) =>
            n.id === nodeId ? { ...n, isExpanded: !n.isExpanded } : n
        ));
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            // Zoom on Ctrl/Cmd + Scroll
            const zoomAmount = -e.deltaY * 0.001;
            setZoom((prev: number) => Math.min(3, Math.max(0.3, prev + zoomAmount)));
        } else {
            // Pan on regular Scroll
            setCanvasOffset((prev: {x: number, y: number}) => ({
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY
            }));
        }
    };

    const getColumnPoint = (nodeId: string, colName?: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        
        const nodeWidth = 208; // w-52
        if (!colName || !node.isExpanded) {
            return {
                x: node.x + nodeWidth,
                y: node.y + 20
            };
        }

        const colIndex = node.columns.findIndex(c => c.name === colName);
        if (colIndex === -1) return { x: node.x + nodeWidth, y: node.y + 20 };

        return {
            x: node.x + nodeWidth, // Right side of source table
            y: node.y + 40 + (colIndex * 28) + 14 // Header height + index * row height + half row height
        };
    };

    const getTargetPoint = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };
        return {
            x: node.x, // Left side of target table
            y: node.y + 20 // Center of header
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
                    <span className="flex items-center gap-2">
                        <Grid3X3 className="h-3.5 w-3.5" />
                        {filteredNodes.length} visible of {nodes.length}
                    </span>
                    <div className="h-4 w-px bg-border"></div>
                    {(search || activeTableId) && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5">
                            <Eye className="h-2.5 w-2.5" />
                            Filtering Active
                        </span>
                    )}
                    <div className="h-4 w-px bg-border"></div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Find Table..."
                            className="bg-muted/50 border border-border rounded-md pl-8 pr-3 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/30 w-40 transition-all font-medium"
                        />
                    </div>
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
                    <div className="h-4 w-px bg-border mx-1"></div>
                    <div className="flex items-center gap-1 bg-muted/50 rounded-lg border border-border p-0.5">
                        <button onClick={() => toggleAll(true)} className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-background rounded transition-all">Expand All</button>
                        <button onClick={() => toggleAll(false)} className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-background rounded transition-all">Collapse All</button>
                    </div>
                    <div className="h-4 w-px bg-border mx-1"></div>
                    <div className="flex items-center gap-1 bg-muted/50 rounded-lg border border-border p-0.5">
                        <button 
                            disabled={isExporting}
                            onClick={() => exportDiagram('png')} 
                            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-background rounded transition-all flex items-center gap-1.5 text-zinc-600 hover:text-primary disabled:opacity-50"
                        >
                            <Download className="h-2.5 w-2.5" />
                            PNG
                        </button>
                        <button 
                            disabled={isExporting}
                            onClick={() => exportDiagram('jpeg')} 
                            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-background rounded transition-all flex items-center gap-1.5 text-zinc-600 hover:text-primary disabled:opacity-50"
                        >
                            JPEG
                        </button>
                        <button 
                            disabled={isExporting}
                            onClick={() => exportDiagram('pdf')} 
                            className="px-2 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-background rounded transition-all flex items-center gap-1.5 text-zinc-600 hover:text-primary disabled:opacity-50"
                        >
                            <FileText className="h-2.5 w-2.5" />
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Canvas Container */}
            <div
                className="relative flex-1 overflow-hidden p-8 bg-zinc-50 dark:bg-zinc-950/20"
                onMouseDown={handleCanvasMouseDown}
                onWheel={handleWheel}
                ref={diagramRef}
            >
                {isLoading && (
                    <div className="absolute inset-0 z-[100] bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Mapping Schema...</span>
                    </div>
                )}
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
                    ref={contentRef}
                    className="absolute inset-0 h-[20000px] w-[20000px]"
                    style={{
                        transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
                        transformOrigin: '0 0'
                    }}
                >
                    {/* SVG Connections - Dynamically Calculated */}
                    <svg className="absolute inset-0 h-full w-full pointer-events-none overflow-visible">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" className="fill-primary/40" />
                            </marker>
                        </defs>
                        {filteredEdges.map((edge, i) => {
                            const start = getColumnPoint(edge.source, edge.sourceColumn);
                            const end = getTargetPoint(edge.target);
                            
                            const isActive = activeTableId === edge.source || activeTableId === edge.target;

                            // Manhattan (Orthogonal) path routing with rounded corners
                            // To prevent lines from "sleeping on themselves", we add a unique offset to the mid-channel
                            const midXOffset = (i % 10) * 12 - 60;
                            const midX = start.x + (end.x - start.x) / 2 + midXOffset;
                            
                            const dy = end.y - start.y;
                            const radius = 8;
                            const ry = dy > 0 ? radius : -radius;
                            // Clamp radius
                            const currentRy = Math.abs(dy) < radius * 2 ? dy / 2 : ry;

                            const path = `
                                M ${start.x} ${start.y}
                                L ${midX - 10} ${start.y}
                                Q ${midX} ${start.y} ${midX} ${start.y + currentRy}
                                L ${midX} ${end.y - currentRy}
                                Q ${midX} ${end.y} ${midX + 10} ${end.y}
                                L ${end.x} ${end.y}
                            `;

                            return (
                                <g key={i} className="transition-opacity duration-300">
                                    <path
                                        d={path}
                                        stroke="currentColor"
                                        strokeWidth={isActive ? "2" : "1"}
                                        className={`${isActive ? 'text-primary' : 'text-primary/20'} transition-all`}
                                        fill="none"
                                        markerEnd="url(#arrowhead)"
                                    />
                                    <circle cx={start.x} cy={start.y} r={isActive ? "3" : "2"} className={`fill-primary transition-all`} />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Nodes */}
                    {filteredNodes.map((node) => {
                        const isActive = activeTableId === node.id;

                        return (
                            <div
                                key={node.id}
                                onMouseDown={(e) => {
                                    handleMouseDown(e, node);
                                    setActiveTableId(node.id);
                                }}
                                className={`absolute w-52 rounded-xl border bg-background shadow-lg transition-all duration-300 ${draggingNode?.id === node.id ? 'shadow-2xl ring-2 ring-primary/30 z-50 cursor-grabbing' : 'cursor-grab hover:shadow-xl'} ${isActive ? 'ring-2 ring-primary z-50 shadow-2xl scale-105' : ''}`}
                                style={{ left: node.x, top: node.y }}
                            >
                                <div 
                                    className={`flex items-center justify-between rounded-t-xl px-3 py-2 border-b border-border ${node.isExpanded ? 'bg-muted/30' : 'bg-background hover:bg-muted/20'} ${isActive ? 'bg-primary/10' : ''}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <TableIcon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-primary/70'}`} />
                                        <span className={`text-[11px] font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>{node.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                                        className="p-1 rounded hover:bg-muted transition-colors"
                                    >
                                        {node.isExpanded ? <ChevronDown className="h-3 w-3.5" /> : <ChevronRight className="h-3 w-3.5" />}
                                    </button>
                                </div>

                                {node.isExpanded && (
                                    <div className="p-2 space-y-0.5 max-h-60 overflow-y-auto scrollbar-hide">
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
                        );
                    })}
                </div>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                <div className="rounded-full border border-border bg-background/90 px-3 py-1.5 flex items-center gap-4 text-[9px] font-black text-muted-foreground backdrop-blur-xl shadow-md uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <MousePointer2 className="h-3 w-3" />
                        <span>Drag to Pan</span>
                    </div>
                    <div className="h-2 w-px bg-border"></div>
                    <div className="flex items-center gap-1.5 text-primary">
                        <Maximize2 className="h-3 w-3" />
                        <span>Click Table to Focus Relationships</span>
                    </div>
                </div>
                {activeTableId && (
                    <button 
                        onClick={() => setActiveTableId(null)}
                        className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 flex items-center gap-2 text-[9px] font-black text-primary backdrop-blur-xl shadow-md uppercase tracking-widest hover:bg-primary/20 transition-all"
                    >
                        <RefreshCcw className="h-2.5 w-2.5" />
                        Clear Focus
                    </button>
                )}
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
