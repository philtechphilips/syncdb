"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClusterStore } from "@/store/useClusterStore";

export default function TableNameRedirect() {
  const params = useParams();
  const router = useRouter();
  const { openTableTab, setActiveTab } = useClusterStore();

  useEffect(() => {
    const tableName = params.tableName as string;
    if (tableName) {
      openTableTab(tableName);
      setActiveTab("table");
      router.replace("/dashboard/table");
    }
  }, []);

  return null;
}
