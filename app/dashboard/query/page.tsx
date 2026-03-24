"use client";

import QueryEditor from "@/components/dashboard/QueryEditor";
import { useClusterStore } from "@/store/useClusterStore";
import { useEffect } from "react";

export default function QueryPage() {
  const { setActiveTab } = useClusterStore();

  useEffect(() => {
    setActiveTab("query");
  }, [setActiveTab]);

  return (
    <div className="flex flex-1 flex-col text-foreground min-w-0 h-full overflow-hidden">
      <QueryEditor />
    </div>
  );
}
