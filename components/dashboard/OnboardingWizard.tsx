"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  Table2,
  GitMerge,
  X,
  Terminal,
} from "lucide-react";
import { useClusterStore } from "@/store/useClusterStore";
import { useRouter } from "next/navigation";

const ONBOARDING_KEY = "synqdb_onboarding_done";

const DB_OPTIONS: {
  id: "postgres" | "mysql" | "mssql";
  label: string;
  icon: string;
  defaultPort: string;
}[] = [
  { id: "postgres", label: "PostgreSQL", icon: "🐘", defaultPort: "5432" },
  { id: "mysql", label: "MySQL", icon: "🐬", defaultPort: "3306" },
  { id: "mssql", label: "SQL Server", icon: "🪟", defaultPort: "1433" },
];

const SAMPLE_QUERY = [
  [
    { t: "SELECT ", c: "#7DD3FC" },
    { t: "id, name, email,", c: "#E2E8F0" },
  ],
  [
    { t: "       ", c: "" },
    { t: "created_at", c: "#E2E8F0" },
  ],
  [{ t: "FROM ", c: "#7DD3FC" }, { t: "users", c: "#E2E8F0" }],
  [
    { t: "WHERE ", c: "#7DD3FC" },
    { t: "status = ", c: "#E2E8F0" },
    { t: "'active'", c: "#FDBA74" },
  ],
  [
    { t: "ORDER BY ", c: "#7DD3FC" },
    { t: "created_at ", c: "#E2E8F0" },
    { t: "DESC", c: "#7DD3FC" },
  ],
  [
    { t: "LIMIT ", c: "#7DD3FC" },
    { t: "20", c: "#FDBA74" },
    { t: ";", c: "#64748B" },
  ],
];

const FEATURES = [
  {
    icon: Terminal,
    title: "Query Editor",
    description:
      "Write and execute SQL with Monaco editor, syntax highlighting, and AI-assisted generation.",
    tab: "query",
  },
  {
    icon: Table2,
    title: "Data Explorer",
    description:
      "Browse, filter, sort, and edit table rows without writing any SQL.",
    tab: "table",
  },
  {
    icon: GitMerge,
    title: "ER Diagram",
    description:
      "Visualize your schema relationships as an interactive entity-relationship diagram.",
    tab: "er",
  },
  {
    icon: Sparkles,
    title: "AI SQL Copilot",
    description:
      "Describe what you need in plain English and get a ready-to-run query instantly.",
    tab: "query",
  },
];

// ── Step 1: Connect ───────────────────────────────────────────────────────────

const ConnectStep = ({ onSuccess }: { onSuccess: () => void }) => {
  const { createCluster, testConnection, isLoading, error, clearError } =
    useClusterStore();

  const [selectedDb, setSelectedDb] = useState<"postgres" | "mysql" | "mssql">(
    "postgres"
  );
  const [form, setForm] = useState({
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

  const handleDbChange = (id: "postgres" | "mysql" | "mssql") => {
    const opt = DB_OPTIONS.find((d) => d.id === id)!;
    setSelectedDb(id);
    setForm((f) => ({ ...f, port: opt.defaultPort }));
    setTestResult(null);
    clearError();
  };

  const field = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setTestResult(null);
    clearError();
  };

  const handleTest = async () => {
    setTestResult(null);
    clearError();
    try {
      await testConnection({ ...form, type: selectedDb });
      setTestResult({ success: true, message: "Connection successful" });
    } catch {
      setTestResult({ success: false, message: error || "Connection failed" });
    }
  };

  const handleConnect = async () => {
    clearError();
    try {
      await createCluster({ ...form, type: selectedDb });
      onSuccess();
    } catch {
      // error shown via store
    }
  };

  const inputCls =
    "w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all";

  return (
    <div className="space-y-6">
      {/* DB type picker */}
      <div className="grid grid-cols-3 gap-2">
        {DB_OPTIONS.map((db) => (
          <button
            key={db.id}
            onClick={() => handleDbChange(db.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
              selectedDb === db.id
                ? "bg-primary/10 border-primary/40 text-white"
                : "bg-white/2 border-white/8 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
            }`}
          >
            <span className="text-xl">{db.icon}</span>
            {db.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
            Connection Name
          </label>
          <input
            className={inputCls}
            placeholder="e.g. Production DB"
            value={form.name}
            onChange={(e) => field("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
            Host
          </label>
          <input
            className={inputCls}
            placeholder="localhost"
            value={form.host}
            onChange={(e) => field("host", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
            Port
          </label>
          <input
            className={inputCls}
            value={form.port}
            onChange={(e) => field("port", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
            Database
          </label>
          <input
            className={inputCls}
            placeholder="mydb"
            value={form.database}
            onChange={(e) => field("database", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
            Username
          </label>
          <input
            className={inputCls}
            placeholder="postgres"
            value={form.username}
            onChange={(e) => field("username", e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
            Password
          </label>
          <input
            type="password"
            className={inputCls}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => field("password", e.target.value)}
          />
        </div>
      </div>

      {/* Feedback */}
      {(testResult || error) && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
            testResult?.success
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {testResult?.success ? (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          )}
          {testResult?.message || error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleTest}
          disabled={isLoading || !form.host || !form.database}
          className="flex-1 py-2.5 rounded-full border border-white/10 text-sm font-semibold text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            "Test Connection"
          )}
        </button>
        <button
          onClick={handleConnect}
          disabled={isLoading || !form.host || !form.database || !form.name}
          className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Connect Database
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ── Step 2: First Query ───────────────────────────────────────────────────────

const QueryStep = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-5">
    <p className="text-sm text-zinc-400 leading-relaxed">
      Your database is connected. Here&apos;s a sample query ready to run — or
      write your own in the editor.
    </p>

    <div className="rounded-xl border border-white/8 bg-[#061018] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#040c14] border-b border-white/5">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
          SQL
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-600">
            ready to execute
          </span>
        </div>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed">
        {SAMPLE_QUERY.map((line, li) => (
          <div key={li} className="flex items-start gap-3">
            <span className="text-zinc-700 select-none w-4 text-right shrink-0 text-[10px] mt-0.5">
              {li + 1}
            </span>
            <span>
              {line.map((tok, ti) => (
                <span key={ti} style={{ color: tok.c || "inherit" }}>
                  {tok.t}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 text-center">
      {[
        { val: "Cmd+Enter", label: "Run query" },
        { val: "Ctrl+Space", label: "Autocomplete" },
        { val: "Ctrl+/", label: "Comment line" },
      ].map((tip) => (
        <div
          key={tip.label}
          className="p-3 rounded-xl border border-white/5 bg-white/2"
        >
          <div className="text-xs font-mono text-primary mb-1">{tip.val}</div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">
            {tip.label}
          </div>
        </div>
      ))}
    </div>

    <button
      onClick={onNext}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
    >
      Open Query Editor
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

// ── Step 3: Explore ───────────────────────────────────────────────────────────

const ExploreStep = ({ onDone }: { onDone: () => void }) => (
  <div className="space-y-5">
    <p className="text-sm text-zinc-400 leading-relaxed">
      You&apos;re all set. Here&apos;s everything available in your dashboard.
    </p>

    <div className="grid grid-cols-2 gap-3">
      {FEATURES.map((f) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-primary/20 hover:bg-primary/3 transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-sm font-bold text-white mb-1">{f.title}</div>
            <div className="text-[11px] text-zinc-500 leading-relaxed">
              {f.description}
            </div>
          </div>
        );
      })}
    </div>

    <button
      onClick={onDone}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
    >
      Enter Dashboard
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

// ── Main Wizard ───────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, title: "Connect your database", subtitle: "Add your first connection" },
  { number: 2, title: "Run your first query", subtitle: "See results in milliseconds" },
  { number: 3, title: "Explore your data", subtitle: "Everything at your fingertips" },
];

export const OnboardingWizard = ({ onDismiss }: { onDismiss: () => void }) => {
  const [step, setStep] = useState(0);
  const { selectedCluster } = useClusterStore();
  const router = useRouter();

  const complete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "1");
    }
    onDismiss();
    router.push(
      `/dashboard/query${selectedCluster ? `?cluster=${selectedCluster.id}` : ""}`
    );
  };

  const skip = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "1");
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.07] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Skip */}
        <button
          onClick={skip}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <X className="h-3 w-3" />
          Skip setup
        </button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="relative rounded-2xl border border-white/10 bg-[#040d12] overflow-hidden"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Step indicator */}
          <div className="flex items-center gap-0 border-b border-white/5">
            {STEPS.map((s, i) => (
              <div
                key={s.number}
                className={`flex-1 flex items-center gap-2.5 px-5 py-4 border-r border-white/5 last:border-r-0 transition-all duration-300 ${
                  i === step
                    ? "bg-primary/[0.06]"
                    : i < step
                    ? "bg-white/[0.01]"
                    : "opacity-40"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black transition-all ${
                    i < step
                      ? "bg-primary text-white"
                      : i === step
                      ? "bg-primary/20 border border-primary/40 text-primary"
                      : "bg-white/5 border border-white/10 text-zinc-600"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="h-3 w-3" /> : s.number}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white truncate">
                    {s.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {STEPS[step].title}
                </h2>
                <p className="text-[11px] text-zinc-500">
                  {STEPS[step].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <ConnectStep onSuccess={() => setStep(1)} />
                )}
                {step === 1 && (
                  <QueryStep onNext={() => setStep(2)} />
                )}
                {step === 2 && (
                  <ExploreStep onDone={complete} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const shouldShowOnboarding = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_KEY) !== "1";
};
