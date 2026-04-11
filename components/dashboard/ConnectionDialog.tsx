"use client";

import React, { useState } from "react";
import {
  X,
  Database,
  Globe,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Laptop,
} from "lucide-react";
import { useClusterStore } from "@/store/useClusterStore";

const ConnectionDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { createCluster, testConnection, isLoading, error, clearError } =
    useClusterStore();

  const [selectedDb, setSelectedDb] = useState<"mysql" | "postgres" | "mssql">(
    "postgres",
  );
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
    environment: "development" as "development" | "staging" | "production",
    color: "#00ED64",
  });
  const [isLocal, setIsLocal] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const databases: {
    id: "mysql" | "postgres" | "mssql";
    name: string;
    icon: string;
    defaultPort: string;
  }[] = [
    { id: "postgres", name: "PostgreSQL", icon: "🐘", defaultPort: "5432" },
    { id: "mysql", name: "MySQL / MariaDB", icon: "🐬", defaultPort: "3306" },
    {
      id: "mssql",
      name: "SQL Server (MSSQL)",
      icon: "🖥️",
      defaultPort: "1433",
    },
  ];

  const environments = [
    { id: "development", name: "Development", color: "#3B82F6", icon: "🛠️" },
    { id: "staging", name: "Staging", color: "#F59E0B", icon: "🧪" },
    { id: "production", name: "Production", color: "#EF4444", icon: "🚀" },
  ];

  const presetColors = [
    "#00ED64", // Synq Green
    "#3B82F6", // Blue
    "#A855F7", // Purple
    "#EC4899", // Pink
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#06B6D4", // Cyan
  ];

  const handleDbSelect = (id: "mysql" | "postgres" | "mssql") => {
    const db = databases.find((d) => d.id === id);
    setSelectedDb(id);
    setFormData({ ...formData, port: db?.defaultPort || "5432" });
    setTestResult(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTestResult(null);
  };

  const handleTest = async () => {
    try {
      const result = (await testConnection({
        ...formData,
        type: selectedDb,
        port: parseInt(formData.port),
      })) as { message: string };
      setTestResult({ success: true, message: result.message });
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message:
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Connection failed",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = (await createCluster({
        ...formData,
        type: selectedDb,
        port: parseInt(formData.port),
        isLocal,
      })) as any;
      // Reset form
      setFormData({
        name: "",
        host: "",
        port: selectedDb === "postgres" ? "5432" : "3306",
        database: "",
        username: "",
        password: "",
        environment: "development",
        color: "#00ED64",
      });
      onClose();
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl rounded-[2.5rem] bg-background p-10 shadow-3xl border border-border/50 overflow-hidden max-h-[95vh] overflow-y-auto scrollbar-hide">
        {/* Background Tech Elements */}
        <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
        <div
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-[100px] pointer-events-none opacity-20"
          style={{ backgroundColor: formData.color }}
        ></div>

        <div className="flex items-start justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-3xl font-serif text-white tracking-tight">
              Establish Terminal Connection
            </h2>
            <p className="text-muted-foreground font-medium">
              Configure your remote cluster and set visibility rules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2.5 bg-white/5 border border-border text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10"
        >
          {/* Left Column: DB Type & Meta */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                1. Data Source
              </span>
              <div className="grid grid-cols-1 gap-2">
                {databases.map((db) => (
                  <button
                    key={db.id}
                    type="button"
                    onClick={() => handleDbSelect(db.id)}
                    className={`flex items-center gap-4 rounded-2xl border p-3.5 transition-all group relative overflow-hidden ${
                      selectedDb === db.id
                        ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(0,237,100,0.1)]"
                        : "bg-white/[0.02] border-border/50 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl bg-white/5 border border-border/50 group-hover:scale-110 transition-transform ${selectedDb === db.id ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <Database className="h-4 w-4" />
                    </div>
                    <span
                      className={`text-xs font-bold ${selectedDb === db.id ? "text-white" : "text-zinc-400"}`}
                    >
                      {db.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLocal(!isLocal);
                setTestResult(null);
              }}
              className={`flex items-center gap-3 w-full rounded-2xl border p-3.5 transition-all ${isLocal ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(0,237,100,0.07)]" : "bg-white/2 border-border/50 hover:border-white/20"}`}
            >
              <div
                className={`p-2 rounded-xl bg-white/5 border border-border/50 ${isLocal ? "text-primary" : "text-muted-foreground"}`}
              >
                <Laptop className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div
                  className={`text-xs font-bold ${isLocal ? "text-white" : "text-zinc-400"}`}
                >
                  Local Database
                </div>
                <div className="text-[9px] text-zinc-600 font-medium">
                  Connect via local relay agent
                </div>
              </div>
              <div
                className={`ml-auto h-4 w-8 rounded-full transition-all ${isLocal ? "bg-primary" : "bg-white/10"} relative`}
              >
                <span
                  className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${isLocal ? "left-4" : "left-0.5"}`}
                />
              </div>
            </button>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                2. Environment Label
              </span>
              <div className="grid grid-cols-3 gap-2">
                {environments.map((env) => (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        environment: env.id as any,
                        color: env.color,
                      });
                    }}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                      formData.environment === env.id
                        ? "bg-white/5 border-white/20 ring-1 ring-white/10"
                        : "bg-white/[0.01] border-border/30 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                    }`}
                  >
                    <span className="text-lg">{env.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      {env.name}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-zinc-600 font-medium px-1">
                * Production clusters will trigger confirmation dialogs for all
                destructive actions.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                3. Cluster Name Tag
              </span>
              <div className="flex flex-wrap gap-2 px-1">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-125 ${formData.color === c ? "border-white scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/10 ml-auto">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="absolute inset-0 h-10 w-10 -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  />
                </div>
              </div>
              {/* Preview of the cluster name tag */}
              <div className="flex items-center gap-2 px-1">
                <div
                  className="h-5 w-5 rounded flex items-center justify-center text-[9px] font-black text-white shrink-0"
                  style={{
                    borderLeft: `2px solid ${formData.color}`,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                >
                  {formData.name ? formData.name[0].toUpperCase() : "A"}
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {formData.name || "Cluster name"} preview
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Connection Details */}
          <div className="lg:col-span-8 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
              4. Authentication & Network
            </span>
            <div className="glass rounded-[2rem] p-8 border border-border/50 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Connection Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g. Master Analytics Production"
                    className="h-12 w-full rounded-xl border border-border/50 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-8 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Cluster Host
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                      <input
                        type="text"
                        required
                        value={formData.host}
                        onChange={(e) =>
                          handleInputChange("host", e.target.value)
                        }
                        placeholder="db.example.com or 10.0.0.1"
                        className="h-12 w-full rounded-xl border border-border/50 bg-white/[0.03] pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="col-span-4 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-center block">
                      Port
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.port}
                      onChange={(e) =>
                        handleInputChange("port", e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-border/50 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium text-center"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Default Database
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.database}
                    onChange={(e) =>
                      handleInputChange("database", e.target.value)
                    }
                    placeholder="main_production"
                    className="h-12 w-full rounded-xl border border-border/50 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-border/50 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="h-12 w-full rounded-xl border border-border/50 bg-white/[0.03] pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isLocal && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary">
                <Laptop className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-[10px] font-bold leading-relaxed">
                  Queries will route through your local agent. Find your agent
                  key in{" "}
                  <span className="underline">
                    Project Settings → Local Agent
                  </span>{" "}
                  and run{" "}
                  <code className="font-mono bg-white/10 px-1 rounded">
                    npx synqdb-agent &lt;key&gt;
                  </code>
                  .
                </span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                {!isLocal && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleTest}
                    className="flex-1 rounded-xl px-8 py-4 text-xs font-black text-white bg-white/5 border border-border hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify Network"
                    )}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] flex items-center justify-center gap-3 rounded-xl bg-primary px-10 py-4 text-xs font-black text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                  ) : (
                    "Authorize & Establish"
                  )}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${testResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {testResult.message}
                  </span>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="mt-10 flex items-center justify-end gap-6 relative z-10 border-t border-border/50 pt-8">
          <button
            onClick={onClose}
            type="button"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDialog;
