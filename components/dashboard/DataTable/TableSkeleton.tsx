import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  showCheckbox?: boolean;
}

export const TableSkeleton = ({
  rowCount = 12,
  columnCount = 6,
  showCheckbox = true,
}: TableSkeletonProps) => {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center border-b border-border/50 bg-muted/20 px-4 py-3 shrink-0">
        {showCheckbox && (
          <div className="w-10 shrink-0">
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        )}
        {Array.from({ length: columnCount }).map((_, i) => (
          <div key={i} className="flex-1 px-4">
            <Skeleton className="h-3 w-24 opacity-60" />
          </div>
        ))}
      </div>

      {/* Body Skeleton */}
      <div className="flex-1 overflow-hidden divide-y divide-border/20">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="flex items-center px-4 py-3 lg:py-4 transition-colors"
          >
            {showCheckbox && (
              <div className="w-10 shrink-0">
                <Skeleton className="h-4 w-4 rounded opacity-40" />
              </div>
            )}
            {Array.from({ length: columnCount }).map((_, j) => (
              <div
                key={j}
                className="flex-1 px-4"
                style={{
                  opacity: 1 - (j / columnCount) * 0.5, // Fade out right columns
                }}
              >
                <Skeleton
                  className="h-3 w-full rounded-sm"
                  style={{
                    width: `${Math.floor(Math.random() * (90 - 40 + 1) + 40)}%`, // Random widths for realism
                    animationDelay: `${i * 0.05}s`, // Staggered animation
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="border-t border-border/50 bg-muted/10 px-6 py-4 flex items-center justify-between shrink-0">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
};
