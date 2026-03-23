"use client";

import React, { useEffect } from "react";
import DataTable from "@/components/dashboard/DataTable";
import { useClusterStore } from "@/store/useClusterStore";
import { useParams } from "next/navigation";

export default function TableNamePage() {
  const params = useParams();
  const tableName = params.tableName as string;
  const { setSelectedTable, setActiveTab } = useClusterStore();

  useEffect(() => {
    if (tableName) {
      setSelectedTable(tableName);
      setActiveTab("table");
    }
  }, [tableName, setSelectedTable, setActiveTab]);

  return (
    <div className="flex-1 overflow-hidden bg-background min-w-0 h-full">
      <DataTable selectedTable={tableName} />
    </div>
  );
}
