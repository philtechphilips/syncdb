"use client";

import React, { useState } from "react";
import { useClusterStore } from "@/store/useClusterStore";
import {
  Download,
  Upload,
  FileJson,
  FileText,
  Database,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

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
        backupFormat === "sql" ? data.content : JSON.stringify(data, null, 2);
      const blob = new Blob([blobContent], {
        type: backupFormat === "json" ? "application/json" : "text/plain",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${selectedCluster.name}_${new Date().toISOString().split("T")[0]}.${backupFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Backup successful", { id: t });
    } catch (error) {
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
        restoreData = { [selectedCluster.database]: text }; // Simplistic mapping
      } else {
        restoreData = { content: text };
      }

      await restore(selectedCluster.id, restoreFormat, restoreData);
      toast.success("Restore completed successfully", { id: t });
    } catch (error: any) {
      toast.error(`Restore failed: ${error.message}`, { id: t });
    } finally {
      setIsRestoring(false);
      if (event.target) event.target.value = "";
    }
  };

  if (!selectedCluster) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <Database className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">
          Please select a cluster to use Backup & Restore
        </p>
      </div>
    );
  }

  const formats = [
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
    <div className="flex-1 overflow-y-auto bg-background p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-2 items-center text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 border border-primary/20">
            <ShieldCheck className="text-primary h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Database Maintenance
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg font-medium">
            Securely snapshot your workspace or recover from a previous state.
            Actions are performed server-side for maximum performance.
          </p>
        </div>

        {/* Mode Select */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-zinc-900/80 border border-white/5 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setMode("backup")}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === "backup" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-500 hover:text-white"}`}
            >
              <Download className="h-4 w-4" />
              Backup
            </button>
            <button
              onClick={() => setMode("restore")}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === "restore" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-500 hover:text-white"}`}
            >
              <Upload className="h-4 w-4" />
              Restore
            </button>
          </div>
        </div>

        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {mode === "backup" ? (
            /* Backup Section */
            <div className="group rounded-3xl border border-white/5 bg-zinc-900/40 p-10 flex flex-col gap-10 transition-all hover:bg-zinc-900/60 hover:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Download className="h-32 w-32 text-primary" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-black text-white">Full Snapshot</h2>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl">
                  Generate a portable export of all tables, relations, and data.
                  Depending on your cluster size, this may take a few seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {formats.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setBackupFormat(f.id as any)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${backupFormat === f.id ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" : "bg-muted/20 border-white/5 hover:bg-muted/40"}`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${backupFormat === f.id ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400"}`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${backupFormat === f.id ? "text-primary" : "text-zinc-200"}`}
                      >
                        {f.label}
                      </span>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                        {f.description}
                      </p>
                    </div>
                    {backupFormat === f.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary absolute top-4 right-4" />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleBackup}
                disabled={isBackingUp}
                className="w-full h-14 rounded-2xl bg-primary text-white text-[13px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 hover:shadow-[0_0_25px_rgba(0,237,100,0.3)] mt-4"
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
            <div className="group rounded-3xl border border-white/5 bg-zinc-900/40 p-10 flex flex-col gap-10 transition-all hover:bg-zinc-900/60 hover:border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Upload className="h-32 w-32 text-primary" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-black text-white">
                  System Restore
                </h2>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl">
                  Recover your database to a previous state by uploading a
                  backup. Warning: This operation will overwrite existing data.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {formats.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setRestoreFormat(f.id as any)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${restoreFormat === f.id ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" : "bg-muted/20 border-white/5 hover:bg-muted/40"}`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${restoreFormat === f.id ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400"}`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${restoreFormat === f.id ? "text-primary" : "text-zinc-200"}`}
                      >
                        {f.label}
                      </span>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
                        {f.description}
                      </p>
                    </div>
                    {restoreFormat === f.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary absolute top-4 right-4" />
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
                        : ".csv"
                  }
                  onChange={handleRestore}
                  disabled={isRestoring}
                />
                <label
                  htmlFor="restore-file"
                  className={`w-full h-14 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 cursor-pointer ${isRestoring ? "opacity-50 pointer-events-none" : "border-primary/30 text-white hover:bg-primary/5 hover:border-primary/50 bg-primary"}`}
                >
                  {isRestoring ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-white" />
                      <span className="text-[13px] font-black uppercase tracking-widest text-white">
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
        <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-6 flex gap-5 backdrop-blur-md">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black text-primary uppercase tracking-widest">
              Workspace Context
            </span>
            <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
              Backup/Restore is currently targeting{" "}
              <span className="text-white font-bold">
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
