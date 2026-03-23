"use client";

import ERDiagram from "@/components/dashboard/ERDiagram";
import { useClusterStore } from "@/store/useClusterStore";
import { useEffect } from "react";

export default function ERPage() {
  const { setActiveTab } = useClusterStore();

  useEffect(() => {
    setActiveTab("er");
  }, []);

  return (
    <div className="flex-1 p-8 bg-background/50 h-full overflow-hidden">
      <ERDiagram />
    </div>
  );
}
