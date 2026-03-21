"use client";

import QueryEditor from "@/components/dashboard/QueryEditor";
import DataTable from "@/components/dashboard/DataTable";
import { useClusterStore } from "@/store/useClusterStore";
import { useEffect } from "react";

export default function QueryPage() {
    const { setActiveTab } = useClusterStore();

    useEffect(() => {
        setActiveTab("query");
    }, []);

    return (
        <div className="flex flex-1 flex-col divide-y divide-white/5 text-foreground min-w-0 overflow-hidden">
            <div className="flex-none h-[500px] min-w-0 overflow-hidden">
                <QueryEditor />
            </div>
            <div className="flex-1 overflow-hidden bg-background min-w-0">
                <DataTable />
            </div>
        </div>
    );
}
