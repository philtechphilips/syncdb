import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-linear-to-r from-muted/50 via-muted/20 to-muted/50",
        className,
      )}
      style={{
        backgroundSize: "200% 100%",
      }}
      {...props}
    />
  );
}
