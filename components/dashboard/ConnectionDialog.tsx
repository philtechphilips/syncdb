"use client";

import React, { useState } from "react";
import {
  X,
  Database,
  Shield,
  Globe,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
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
  });
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
      await createCluster({
        ...formData,
        type: selectedDb,
        port: parseInt(formData.port),
      });
      onClose();
      // Reset form
      setFormData({
        name: "",
        host: "",
        port: selectedDb === "postgres" ? "5432" : "3306",
        database: "",
        username: "",
        password: "",
      });
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl rounded-[2.5rem] bg-background p-10 shadow-3xl border border-white/5 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Background Tech Elements */}
        <div className="absolute inset-0 tech-grid opacity-[0.05] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>

        <div className="flex items-start justify-between mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-serif text-white tracking-tight">
              Add New Connection
            </h2>
            <p className="text-zinc-500 font-medium">
              Configure your terminal to access remote clusters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2.5 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10"
        >
          {/* Provider Selection */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
              Select Provider
            </span>
            <div className="grid grid-cols-1 gap-3">
              {databases.map((db) => (
                <button
                  key={db.id}
                  type="button"
                  onClick={() => handleDbSelect(db.id)}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition-all group relative overflow-hidden ${
                    selectedDb === db.id
                      ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(0,237,100,0.1)]"
                      : "bg-white/[0.02] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform ${selectedDb === db.id ? "text-primary" : "text-zinc-500"}`}
                  >
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={`text-sm font-bold ${selectedDb === db.id ? "text-white" : "text-zinc-400"}`}
                    >
                      {db.name}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-600">
                      Standard Driver
                    </span>
                  </div>
                  {selectedDb === db.id && (
                    <div className="absolute top-0 right-0 h-10 w-10 bg-primary/10 rounded-bl-3xl flex items-center justify-center translate-x-1 -translate-y-1">
                      <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,237,100,1)]"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-6 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                Identity
              </span>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Friendly Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Production DB"
                  className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            {testResult && (
              <div
                className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-left-2 ${testResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-xs font-bold">{testResult.message}</span>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 rounded-2xl border bg-red-500/10 border-red-500/20 text-red-400 flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span className="text-xs font-bold">{error}</span>
                <button onClick={clearError} className="ml-auto">
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
              Connection Details
            </span>
            <div className="glass rounded-[2rem] p-8 border border-white/5 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Host & Port
                </label>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-8 relative">
                    <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="text"
                      required
                      value={formData.host}
                      onChange={(e) =>
                        handleInputChange("host", e.target.value)
                      }
                      placeholder="127.0.0.1"
                      className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                  <div className="col-span-4 text-center">
                    <input
                      type="text"
                      required
                      value={formData.port}
                      onChange={(e) =>
                        handleInputChange("port", e.target.value)
                      }
                      placeholder="5432"
                      className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Database Info
                </label>
                <input
                  type="text"
                  required
                  value={formData.database}
                  onChange={(e) =>
                    handleInputChange("database", e.target.value)
                  }
                  placeholder="Database Name"
                  className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Authentication
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    placeholder="Username"
                    className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                  />
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Password (Optional)"
                      className="h-12 w-full rounded-xl border border-white/5 bg-white/[0.03] pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleTest}
                className="flex-1 rounded-xl px-8 py-3.5 text-sm font-black text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Test Connection"
                )}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] flex items-center justify-center gap-3 rounded-xl bg-primary px-10 py-3.5 text-sm font-black text-primary-foreground shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:shadow-[0_0_30px_rgba(0,237,100,0.5)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                ) : (
                  "Establish Connection"
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 flex items-center justify-between gap-6 relative z-10 border-t border-white/5 pt-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Secure Tunnel
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                End-to-End TLS Encryption
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-xs font-bold text-zinc-600 hover:text-white transition-colors"
          >
            Discard Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDialog;
