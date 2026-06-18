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
  Server,
  FlaskConical,
  Rocket,
  Eye,
  EyeOff,
  Plug,
} from "lucide-react";
import { useClusterStore, Cluster } from "@/store/useClusterStore";
import { UI_CLASSES } from "@/lib/constants";

// ── Types ─────────────────────────────────────────────────────────────────────

type DbType = "mysql" | "postgres" | "mssql" | "sqlite";
type EnvType = "development" | "staging" | "production";

// ── Config ────────────────────────────────────────────────────────────────────

const DB_OPTIONS: { id: DbType; name: string; port: string }[] = [
  { id: "postgres", name: "PostgreSQL", port: "5432" },
  { id: "mysql", name: "MySQL / MariaDB", port: "3306" },
  { id: "mssql", name: "SQL Server", port: "1433" },
  { id: "sqlite", name: "SQLite", port: "" },
];

const ENV_OPTIONS: {
  id: EnvType;
  label: string;
  color: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { id: "development", label: "Development", color: "#3B82F6", Icon: Server },
  { id: "staging", label: "Staging", color: "#F59E0B", Icon: FlaskConical },
  { id: "production", label: "Production", color: "#EF4444", Icon: Rocket },
];

const PRESET_COLORS = [
  "#00ED64",
  "#3B82F6",
  "#A855F7",
  "#EC4899",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-3">
    {children}
  </p>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 px-0.5">
    {children}
  </label>
);

const inputCls =
  "h-11 w-full rounded-xl border border-white/6 bg-white/3 px-3.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-medium";

// ── Main component ────────────────────────────────────────────────────────────

const ConnectionDialog = ({
  isOpen,
  onClose,
  editCluster,
}: {
  isOpen: boolean;
  onClose: () => void;
  editCluster?: Cluster;
}) => {
  const { createCluster, updateCluster, testConnection, isLoading } = useClusterStore();

  const isEdit = !!editCluster;

  const [selectedDb, setSelectedDb] = useState<DbType>(
    (editCluster?.type as DbType) ?? "postgres",
  );
  const [formData, setFormData] = useState({
    name: editCluster?.name ?? "",
    type: (editCluster?.type as DbType) ?? ("postgres" as DbType),
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
    environment: (editCluster?.environment as EnvType) ?? ("development" as EnvType),
    color: editCluster?.color ?? "#00ED64",
  });
  const [isLocal, setIsLocal] = useState(editCluster?.isLocal ?? false);
  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const field = (key: string, value: string) => {
    setFormData((f) => ({ ...f, [key]: value }));
    setTestResult(null);
  };

  const handleDbSelect = (id: DbType) => {
    const db = DB_OPTIONS.find((d) => d.id === id)!;
    setSelectedDb(id);
    setFormData((f) => ({ ...f, type: id, port: db.port }));
    setTestResult(null);
  };

  const handleEnvSelect = (env: (typeof ENV_OPTIONS)[number]) => {
    setFormData((f) => ({ ...f, environment: env.id, color: env.color }));
  };

  const handleTest = async () => {
    try {
      const result = (await testConnection({
        ...formData,
        type: selectedDb,
        port: parseInt(formData.port),
      })) as { message: string };
      setTestResult({ success: true, message: result.message });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.response?.data?.message ?? "Connection failed",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && editCluster) {
        const patch: Record<string, unknown> = {
          name: formData.name,
          type: selectedDb,
          environment: formData.environment,
          color: formData.color,
          isLocal,
        };
        // Only send connection fields if the user filled them in
        if (formData.host) patch.host = formData.host;
        if (formData.port) patch.port = parseInt(formData.port);
        if (formData.database) patch.database = formData.database;
        if (formData.username) patch.username = formData.username;
        if (formData.password) patch.password = formData.password;
        await updateCluster(editCluster.id, patch);
      } else {
        await createCluster({
          ...formData,
          type: selectedDb,
          port: parseInt(formData.port),
          isLocal,
        });
      }
      onClose();
    } catch {
      // error handled by store toast
    }
  };

  const selectedEnv = ENV_OPTIONS.find((e) => e.id === formData.environment)!;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-zinc-950 border border-white/8 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Ambient glow tied to cluster colour */}
        <div
          className="absolute -top-32 -right-32 h-72 w-72 rounded-full blur-[120px] pointer-events-none opacity-10 transition-colors duration-500"
          style={{ backgroundColor: formData.color }}
        />

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Plug className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight leading-none mb-0.5">
                {isEdit ? "Edit Connection" : "New Connection"}
              </h2>
              <p className="text-[11px] text-zinc-500 font-medium">
                {isEdit ? `Editing ${editCluster?.name}` : "Configure your database cluster"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/8 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            {/* ── Left panel ─────────────────────────────────────────────── */}
            <div className="p-6 space-y-7">
              {/* Database engine */}
              <div>
                <SectionLabel>Database Engine</SectionLabel>
                <div className="space-y-1.5">
                  {DB_OPTIONS.map((db) => {
                    const active = selectedDb === db.id;
                    return (
                      <button
                        key={db.id}
                        type="button"
                        onClick={() => handleDbSelect(db.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                          active
                            ? "border-primary/40 bg-primary/6 text-white"
                            : "border-transparent bg-white/3 text-zinc-400 hover:bg-white/5 hover:text-zinc-300"
                        }`}
                      >
                        <Database
                          className={`h-3.5 w-3.5 shrink-0 ${active ? "text-primary" : "text-zinc-600"}`}
                        />
                        <span className="text-xs font-semibold">{db.name}</span>
                        <span
                          className={`ml-auto font-mono text-[10px] ${active ? "text-primary/70" : "text-zinc-700"}`}
                        >
                          :{db.port}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Local toggle */}
              <div>
                <SectionLabel>Connection Mode</SectionLabel>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocal((v) => !v);
                    setTestResult(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all ${
                    isLocal
                      ? "border-primary/40 bg-primary/6"
                      : "border-white/6 bg-white/3 hover:bg-white/5"
                  }`}
                >
                  <Laptop
                    className={`h-3.5 w-3.5 shrink-0 ${isLocal ? "text-primary" : "text-zinc-600"}`}
                  />
                  <div className="text-left flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold ${isLocal ? "text-white" : "text-zinc-400"}`}
                    >
                      Local Database
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5 font-medium">
                      Route via local agent CLI
                    </p>
                  </div>
                  {/* Toggle pill */}
                  <div
                    className={`h-4 w-7 rounded-full relative shrink-0 transition-colors ${isLocal ? "bg-primary" : "bg-white/10"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${isLocal ? "left-3.5" : "left-0.5"}`}
                    />
                  </div>
                </button>
              </div>

              {/* Environment */}
              <div>
                <SectionLabel>Environment</SectionLabel>
                <div className="space-y-1.5">
                  {ENV_OPTIONS.map((env) => {
                    const active = formData.environment === env.id;
                    return (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => handleEnvSelect(env)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                          active
                            ? "border-white/15 bg-white/5 text-white"
                            : "border-transparent bg-white/2 text-zinc-500 hover:bg-white/4 hover:text-zinc-400"
                        }`}
                      >
                        <span
                          className="shrink-0"
                          style={{ color: active ? env.color : "#52525b" }}
                        >
                          <env.Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-semibold">
                          {env.label}
                        </span>
                        {env.id === "production" && (
                          <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-red-500/70">
                            Guarded
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colour tag */}
              <div>
                <SectionLabel>Cluster Colour</SectionLabel>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData((f) => ({ ...f, color: c }))}
                      className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === c ? "border-white scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <div className="relative h-5 w-5 rounded-full overflow-hidden border border-white/10 ml-1">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, color: e.target.value }))
                      }
                      className="absolute inset-0 h-10 w-10 -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right panel ────────────────────────────────────────────── */}
            <div className="p-6 space-y-5">
              {/* Display name + preview */}
              <div>
                <FieldLabel>Connection Name</FieldLabel>
                <div className="relative">
                  {/* Colour accent preview inside field */}
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full"
                    style={{ backgroundColor: formData.color }}
                  />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => field("name", e.target.value)}
                    placeholder="e.g. Analytics Production"
                    className={`${inputCls} pl-7`}
                  />
                </div>
              </div>

              {/* Host + Port (or File Path for SQLite) */}
              {formData.type === "sqlite" ? (
                <div>
                  <FieldLabel>File Path</FieldLabel>
                  <div className="relative">
                    <Database className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                    <input
                      type="text"
                      required
                      value={formData.host}
                      onChange={(e) => field("host", e.target.value)}
                      placeholder="/path/to/database.db"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1.5 px-0.5">
                    Absolute path to the .db file on the server (or agent
                    machine).
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_88px] gap-3">
                  <div>
                    <FieldLabel>Host</FieldLabel>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                      <input
                        type="text"
                        required
                        value={formData.host}
                        onChange={(e) => field("host", e.target.value)}
                        placeholder={isLocal ? "localhost" : "db.example.com"}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Port</FieldLabel>
                    <input
                      type="text"
                      required
                      value={formData.port}
                      onChange={(e) => field("port", e.target.value)}
                      className={`${inputCls} text-center tracking-widest`}
                    />
                  </div>
                </div>
              )}

              {/* Database name (hidden for SQLite — file path is the database) */}
              {formData.type !== "sqlite" && (
                <div>
                  <FieldLabel>Database</FieldLabel>
                  <input
                    type="text"
                    required
                    value={formData.database}
                    onChange={(e) => field("database", e.target.value)}
                    placeholder="my_database"
                    className={inputCls}
                  />
                </div>
              )}

              {/* Credentials (hidden for SQLite) */}
              {formData.type !== "sqlite" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Username</FieldLabel>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => field("username", e.target.value)}
                      placeholder="admin"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>Password</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => field("password", e.target.value)}
                        placeholder="••••••••"
                        className={`${inputCls} pl-9 pr-9`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Local agent info banner */}
              {isLocal && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Laptop className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Queries route through the local agent. Run{" "}
                    <code className="text-primary font-mono bg-white/5 px-1 rounded">
                      synqdb-agent login
                    </code>{" "}
                    then{" "}
                    <code className="text-primary font-mono bg-white/5 px-1 rounded">
                      synqdb-agent
                    </code>{" "}
                    on your machine. No keys to copy.
                  </p>
                </div>
              )}

              {/* Test result */}
              {testResult && (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-[11px] font-semibold animate-in fade-in duration-200 ${
                    testResult.success
                      ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/8 border-red-500/20 text-red-400"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {testResult.message}
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3 px-8 py-5 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              {/* Live colour + env indicator */}
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: selectedEnv.color }}
              />
              <span className="text-[10px] text-zinc-600 font-semibold">
                {selectedEnv.label}
                {isLocal && " · Local"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              {!isLocal && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleTest}
                  className="px-4 py-2 rounded-lg border border-white/8 bg-white/4 text-xs font-semibold text-zinc-300 hover:bg-white/8 hover:text-white transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Test Connection
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-primary text-black text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                {isEdit ? "Save Changes" : "Add Connection"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionDialog;
