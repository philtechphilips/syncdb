import React from "react";

interface Edge {
  source: string;
  target: string;
  sourceColumn?: string;
}

interface DiagramConnectionsProps {
  filteredEdges: Edge[];
  getColumnPoint: (
    nodeId: string,
    colName?: string,
  ) => { x: number; y: number };
  getTargetPoint: (nodeId: string) => { x: number; y: number };
  activeTableId: string | null;
}

const DiagramConnections = ({
  filteredEdges,
  getColumnPoint,
  getTargetPoint,
  activeTableId,
}: DiagramConnectionsProps) => {
  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none overflow-visible">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" className="fill-primary/40" />
        </marker>
      </defs>
      {filteredEdges.map((edge, i) => {
        const start = getColumnPoint(edge.source, edge.sourceColumn);
        const end = getTargetPoint(edge.target);

        const isActive =
          activeTableId === edge.source || activeTableId === edge.target;

        // Manhattan (Orthogonal) path routing with rounded corners
        const midXOffset = (i % 10) * 12 - 60;
        const midX = start.x + (end.x - start.x) / 2 + midXOffset;

        const dy = end.y - start.y;
        const radius = 8;
        const ry = dy > 0 ? radius : -radius;
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
              className={`${isActive ? "text-primary shadow-[0_0_8px_rgba(0,237,100,0.5)]" : "text-primary/20"} transition-all`}
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <circle
              cx={start.x}
              cy={start.y}
              r={isActive ? "3" : "2"}
              className={`fill-primary transition-all`}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default DiagramConnections;
