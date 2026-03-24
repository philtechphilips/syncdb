"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useClusterStore } from "@/store/useClusterStore";
import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";

// Sub-components
import DiagramToolbar from "./ERDiagram/DiagramToolbar";
import DiagramConnections from "./ERDiagram/DiagramConnections";
import TableNode from "./ERDiagram/TableNode";
import DiagramOverlay from "./ERDiagram/DiagramOverlay";

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

  // Core Diagram Data
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Interaction State
  const [draggingNode, setDraggingNode] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [panning, setPanning] = useState<{
    startX: number;
    startY: number;
  } | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const diagramRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!selectedCluster) return;

    const loadSchema = async () => {
      setIsLoading(true);
      try {
        const schema = (await fetchSchema(selectedCluster.id)) as {
          tableName?: string;
          table_name?: string;
          name: string;
          type?: string;
          udtName?: string;
          columnKey?: string;
          referencedTable?: string;
        }[];
        const tables: Record<string, typeof schema> = {};
        schema.forEach((col) => {
          const tName = (col.tableName || col.table_name)!;
          if (!tables[tName]) tables[tName] = [];
          tables[tName].push(col);
        });

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        const tableNames = Object.keys(tables).sort();

        tableNames.forEach((name) => {
          tables[name].forEach((c) => {
            if (c.referencedTable && tables[c.referencedTable]) {
              newEdges.push({
                source: name,
                target: c.referencedTable,
                sourceColumn: c.name,
              });
            }
          });
        });

        const rankGroups: Record<number, string[]> = {};
        const tableRanks: Record<string, number> = {};
        tableNames.forEach((t) => {
          tableRanks[t] = 0;
          newEdges
            .filter((e) => e.source === t || e.target === t)
            .forEach((e) => {
              if (e.source === t) tableRanks[t]--;
              else tableRanks[t]++;
            });
        });

        tableNames.forEach((t) => {
          const r = tableRanks[t];
          if (!rankGroups[r]) rankGroups[r] = [];
          rankGroups[r].push(t);
        });

        const sortedRanks = Object.keys(rankGroups)
          .map(Number)
          .sort((a, b) => a - b);
        sortedRanks.forEach((rank, colIdx) => {
          rankGroups[rank].sort().forEach((name, rowIdx) => {
            newNodes.push({
              id: name,
              name: name,
              x: colIdx * 450 + 100,
              y: rowIdx * 450 + 100,
              isExpanded: true,
              columns: tables[name].map((c) => ({
                name: c.name,
                type: c.type || c.udtName || "unknown",
                isPk:
                  c.columnKey === "PRI" ||
                  c.columnKey?.includes("PRIMARY") ||
                  c.name === "id" ||
                  c.name === "uuid",
                isFk: !!c.referencedTable,
              })),
            });
          });
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (err: unknown) {
        // Error is handled
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Connection failed";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchema();
  }, [selectedCluster, fetchSchema]);

  // -------------------------------------------------------------------------
  // Filtering Logic
  // -------------------------------------------------------------------------

  const filteredNodes = useMemo(() => {
    if (!search && !activeTableId) return nodes;
    const matchingIds = new Set<string>();
    if (search)
      nodes.forEach((n) => {
        if (n.name.toLowerCase().includes(search.toLowerCase()))
          matchingIds.add(n.id);
      });
    else if (activeTableId) matchingIds.add(activeTableId);

    if (matchingIds.size === 0) return [];
    const visibleIds = new Set<string>(matchingIds);
    edges.forEach((e) => {
      if (matchingIds.has(e.source)) visibleIds.add(e.target);
      if (matchingIds.has(e.target)) visibleIds.add(e.source);
    });
    return nodes.filter((n) => visibleIds.has(n.id));
  }, [nodes, edges, search, activeTableId]);

  const filteredEdges = useMemo(() => {
    const visibleIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target),
    );
  }, [edges, filteredNodes]);

  // -------------------------------------------------------------------------
  // Export Handlers
  // -------------------------------------------------------------------------

  const exportDiagram = async (format: "png" | "jpeg" | "pdf") => {
    if (!contentRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading(
      `Preparing ${format.toUpperCase()} export...`,
    );
    try {
      const activeNodes = filteredNodes.length > 0 ? filteredNodes : nodes;
      const minX = Math.min(...activeNodes.map((n) => n.x)) - 100;
      const minY = Math.min(...activeNodes.map((n) => n.y)) - 100;
      const maxX = Math.max(...activeNodes.map((n) => n.x)) + 350;
      const maxY = Math.max(...activeNodes.map((n) => n.y)) + 500;
      const width = maxX - minX;
      const height = maxY - minY;

      const opts = {
        pixelRatio: 2,
        bgcolor: "#ffffff",
        width,
        height,
        style: {
          transform: `translate(${-minX}px, ${-minY}px) scale(1)`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
        },
      };
      const dataUrl =
        format === "jpeg"
          ? await toJpeg(contentRef.current, opts)
          : await toPng(contentRef.current, opts);

      if (format === "pdf") {
        const pdf = new jsPDF(width > height ? "l" : "p", "px", [
          width,
          height,
        ]);
        pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
        pdf.save(`ER-Diagram-${selectedCluster?.name}.pdf`);
      } else {
        const link = document.createElement("a");
        link.download = `ER-Diagram-${selectedCluster?.name}.${format}`;
        link.href = dataUrl;
        link.click();
      }
      toast.success(`Exported successfully`, { id: toastId });
    } catch {
      toast.error("Memory limit exceeded for large schema.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Canvas Navigation
  // -------------------------------------------------------------------------

  const getColumnPoint = (nodeId: string, colName?: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    if (!colName || !node.isExpanded)
      return { x: node.x + 208, y: node.y + 20 };
    const idx = node.columns.findIndex((c) => c.name === colName);
    return { x: node.x + 208, y: node.y + 40 + idx * 28 + 14 };
  };

  const getTargetPoint = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? { x: node.x, y: node.y + 20 } : { x: 0, y: 0 };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNode.id
            ? {
                ...n,
                x: e.clientX / zoom - draggingNode.offsetX,
                y: e.clientY / zoom - draggingNode.offsetY,
              }
            : n,
        ),
      );
    } else if (panning) {
      setCanvasOffset({
        x: e.clientX - panning.startX,
        y: e.clientY - panning.startY,
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      setZoom((prev) => Math.min(3, Math.max(0.3, prev - e.deltaY * 0.001)));
    } else {
      setCanvasOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-[#021016]/10 backdrop-blur-sm select-none transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-[100] h-screen w-screen bg-black rounded-none border-none" : "h-full min-h-[600px]"}`}
      onMouseMove={handleMouseMove}
      onMouseUp={() => {
        setDraggingNode(null);
        setPanning(null);
      }}
      onMouseLeave={() => {
        setDraggingNode(null);
        setPanning(null);
      }}
    >
      <DiagramToolbar
        isFullscreen={isFullscreen}
        nodesCount={nodes.length}
        visibleNodesCount={filteredNodes.length}
        isFiltering={!!(search || activeTableId)}
        search={search}
        onSearchChange={setSearch}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(3, z + 0.1))}
        onZoomOut={() => setZoom((z) => Math.max(0.3, z - 0.1))}
        onResetView={() => {
          setCanvasOffset({ x: 0, y: 0 });
          setZoom(1);
        }}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onToggleAll={(exp) =>
          setNodes((prev) => prev.map((n) => ({ ...n, isExpanded: exp })))
        }
        onExport={exportDiagram}
        isExporting={isExporting}
      />

      <div
        className="relative flex-1 overflow-hidden p-8 bg-[#021016]/20"
        onMouseDown={(e) =>
          e.button === 0 &&
          setPanning({
            startX: e.clientX - canvasOffset.x,
            startY: e.clientY - canvasOffset.y,
          })
        }
        onWheel={handleWheel}
        ref={diagramRef}
      >
        {isLoading && (
          <div className="absolute inset-0 z-[100] bg-[#021016]/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">
              Mapping Schema...
            </span>
          </div>
        )}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #277955 1px, transparent 1px)`,
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
          }}
        ></div>

        <div
          ref={contentRef}
          className="absolute inset-0 h-[20000px] w-[20000px] text-left"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          <DiagramConnections
            filteredEdges={filteredEdges}
            getColumnPoint={getColumnPoint}
            getTargetPoint={getTargetPoint}
            activeTableId={activeTableId}
          />

          {filteredNodes.map((node) => (
            <TableNode
              key={node.id}
              node={node}
              onMouseDown={(e) => {
                setActiveTableId(node.id);
                setDraggingNode({
                  id: node.id,
                  offsetX: e.clientX / zoom - node.x,
                  offsetY: e.clientY / zoom - node.y,
                });
                e.stopPropagation();
              }}
              isActive={activeTableId === node.id}
              onToggleExpand={() =>
                setNodes((prev) =>
                  prev.map((n) =>
                    n.id === node.id ? { ...n, isExpanded: !n.isExpanded } : n,
                  ),
                )
              }
              isDragging={draggingNode?.id === node.id}
            />
          ))}
        </div>
      </div>

      <DiagramOverlay
        activeTableId={activeTableId}
        onClearFocus={() => setActiveTableId(null)}
      />

      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 right-8 z-[110] px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl"
        >
          Close [Esc]
        </button>
      )}
    </div>
  );
};

export default ERDiagram;
