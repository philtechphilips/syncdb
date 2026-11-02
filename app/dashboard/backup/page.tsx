"use client";

import React, { useState } from "react";
import { useClusterStore } from "@/store/useClusterStore";
import {
  Download,
  Upload,
  FileJson,
  FileText,
  Database,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";

export default function BackupRestorePage() {
  const { selectedCluster, backup, restore } = useClusterStore();
  const [mode, setMode] = useState<"backup" | "restore">("backup");
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupFormat, setBackupFormat] = useState<"sql" | "csv" | "json">(
    "sql",
  );
  const [restoreFormat, setRestoreFormat] = useState<"sql" | "csv" | "json">(
    "sql",
  );

  const handleBackup = async () => {
    if (!selectedCluster) return toast.error("Please select a cluster first");

    setIsBackingUp(true);
    const t = toast.loading(
      `Generating ${backupFormat.toUpperCase()} backup...`,
    );

    try {
      const data = await backup(selectedCluster.id, backupFormat);

      // Download the file
      const blobContent =
        backupFormat === "sql"
          ? data.content || ""
          : JSON.stringify(data, null, 2);

      const blob = new Blob([blobContent], {
        type: backupFormat === "json" ? "application/json" : "text/plain",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // A CSV backup holds one CSV per table, packed as a JSON map.
      const extension = backupFormat === "csv" ? "csv.json" : backupFormat;
      a.download = `backup_${selectedCluster.name}_${new Date().toISOString().split("T")[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Backup successful", { id: t });
    } catch {
      toast.error("Backup failed", { id: t });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCluster) return;

    setIsRestoring(true);
    const t = toast.loading(`Restoring from ${file.name}...`);

    try {
      const text = await file.text();
      let restoreData;

      if (restoreFormat === "json") {
        restoreData = JSON.parse(text);
      } else if (restoreFormat === "csv") {
        // Either a CSV backup from SynqDB ({ table: csv }) or a single CSV
        // file, restored into the table named after the file.
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          // not JSON — a plain CSV file
        }
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          restoreData = parsed;
        } else {
          const tableName = file.name.replace(/\.csv$/i, "");
          restoreData = { [tableName]: text };
        }
      } else {
        restoreData = { content: text };
      }

      await restore(selectedCluster.id, restoreFormat, restoreData);
      toast.success("Restore completed successfully", { id: t });
    } catch (error: unknown) {
      toast.error(`Restore failed: ${getErrorMessage(error)}`, { id: t });
    } finally {
      setIsRestoring(false);
      if (event.target) event.target.value = "";
    }
  };

  if (!selectedCluster) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-subtle">
        <Database className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm">
          Please select a cluster to use Backup & Restore
        </p>
      </div>
    );
  }

  const formats: {
    id: "sql" | "csv" | "json";
    label: string;
    icon: React.ElementType;
    description: string;
  }[] = [
    {
      id: "sql",
      label: "SQL Dump",
      icon: Database,
      description: "Full schema and data. Best for migrations.",
    },
    {
      id: "json",
      label: "JSON Data",
      icon: FileJson,
      description: "Table structures. Great for API portability.",
    },
    {
      id: "csv",
      label: "CSV Files",
      icon: FileText,
      description: "Comma separated values. Ideal for snapshots.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6 font-sans">
      <div className="max-w-4xl space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-foreground">
            Backup &amp; restore
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Export this cluster to a file, or load a backup into it.
          </p>
        </div>

        {/* Mode Select */}
        <div className="flex">
          <div className="inline-flex p-0.5 bg-bg-200 border border-border rounded-lg">
            <button
              onClick={() => setMode("backup")}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "backup" ? "bg-primary text-white" : "text-subtle hover:text-foreground"}`}
            >
              <Download className="h-4 w-4" />
              Backup
            </button>
            <button
              onClick={() => setMode("restore")}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "restore" ? "bg-primary text-white" : "text-subtle hover:text-foreground"}`}
            >
              <Upload className="h-4 w-4" />
              Restore
            </button>
          </div>
        </div>

        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {mode === "backup" ? (
            /* Backup Section */
            <div className="relative rounded-xl border border-border bg-card p-6 flex flex-col gap-5">
              <div className="space-y-3">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Full snapshot
                </h2>
                <p className="text-subtle text-sm leading-relaxed max-w-xl">
                  Generate a portable export of all tables, relations, and data.
                  Depending on your cluster size, this may take a few seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {formats.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setBackupFormat(f.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${backupFormat === f.id ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" : "bg-muted/20 border-border hover:bg-muted/40"}`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${backupFormat === f.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span
                        className={`text-[11px] font-medium ${backupFormat === f.id ? "text-accent-fg" : "text-foreground"}`}
                      >
                        {f.label}
                      </span>
                      <p className="text-[11px] text-subtle mt-1 leading-tight">
                        {f.description}
                      </p>
                    </div>
                    {backupFormat === f.id && (
                      <CheckCircle2 className="h-4 w-4 text-accent-fg absolute top-4 right-4" />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleBackup}
                disabled={isBackingUp}
                className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgb(67_56_202/0.25)] transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {isBackingUp ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                Generate Backup
              </button>
            </div>
          ) : (
            /* Restore Section */
            <div className="relative rounded-xl border border-border bg-card p-6 flex flex-col gap-5">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">
                  System Restore
                </h2>
                <p className="text-subtle text-sm leading-relaxed max-w-xl">
                  Recover your database to a previous state by uploading a
                  backup. Warning: This operation will overwrite existing data.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {formats.map((f) => (
                  <div
                    key={f.id}
                    onClick={() =>
                      setRestoreFormat(f.id as "sql" | "json" | "csv")
                    }
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${restoreFormat === f.id ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" : "bg-muted/20 border-border hover:bg-muted/40"}`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${restoreFormat === f.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span
                        className={`text-[11px] font-medium ${restoreFormat === f.id ? "text-accent-fg" : "text-foreground"}`}
                      >
                        {f.label}
                      </span>
                      <p className="text-[11px] text-subtle mt-1 leading-tight">
                        {f.description}
                      </p>
                    </div>
                    {restoreFormat === f.id && (
                      <CheckCircle2 className="h-4 w-4 text-accent-fg absolute top-4 right-4" />
                    )}
                  </div>
                ))}
              </div>

              <div className="relative mt-4">
                <input
                  type="file"
                  id="restore-file"
                  className="hidden"
                  accept={
                    restoreFormat === "sql"
                      ? ".sql"
                      : restoreFormat === "json"
                        ? ".json"
                        : ".csv,.json"
                  }
                  onChange={handleRestore}
                  disabled={isRestoring}
                />
                <label
                  htmlFor="restore-file"
                  className={`w-full h-14 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-3 cursor-pointer ${isRestoring ? "opacity-50 pointer-events-none" : "border-primary/30 text-white hover:bg-primary/5 hover:border-primary/50 bg-primary"}`}
                >
                  {isRestoring ? (
                    <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-foreground" />
                      <span className="text-[13px] font-semibold text-foreground">
                        Select & Restore File
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-bg-200 border border-border rounded-xl p-6 flex gap-5">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-subtle" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-accent-fg">
              Workspace Context
            </span>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Backup/Restore is currently targeting{" "}
              <span className="text-foreground font-semibold">
                {selectedCluster.name}
              </span>{" "}
              ({selectedCluster.type}). All generated files are encrypted in
              transit and never stored on our intermediate servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
