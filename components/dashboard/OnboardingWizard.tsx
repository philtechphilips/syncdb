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
  id: "postgres" | "mysql" | "mssql" | "sqlite";
  label: string;
  icon: string;
  defaultPort: string;
}[] = [
  { id: "postgres", label: "PostgreSQL", icon: "🐘", defaultPort: "5432" },
  { id: "mysql", label: "MySQL", icon: "🐬", defaultPort: "3306" },
  { id: "mssql", label: "SQL Server", icon: "🪟", defaultPort: "1433" },
  { id: "sqlite", label: "SQLite", icon: "🗄️", defaultPort: "" },
];

const SAMPLE_QUERY = [
  [
    { t: "SELECT ", c: "var(--color-syn-kw)" },
    { t: "id, name, email,", c: "var(--color-syn-text)" },
  ],
  [
    { t: "       ", c: "" },
    { t: "created_at", c: "var(--color-syn-text)" },
  ],
  [
    { t: "FROM ", c: "var(--color-syn-kw)" },
    { t: "users", c: "var(--color-syn-text)" },
  ],
  [
    { t: "WHERE ", c: "var(--color-syn-kw)" },
    { t: "status = ", c: "var(--color-syn-text)" },
    { t: "'active'", c: "var(--color-syn-str)" },
  ],
  [
    { t: "ORDER BY ", c: "var(--color-syn-kw)" },
    { t: "created_at ", c: "var(--color-syn-text)" },
    { t: "DESC", c: "var(--color-syn-kw)" },
  ],
  [
    { t: "LIMIT ", c: "var(--color-syn-kw)" },
    { t: "20", c: "var(--color-syn-str)" },
    { t: ";", c: "var(--color-syn-comment)" },
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

  const [selectedDb, setSelectedDb] = useState<
    "postgres" | "mysql" | "mssql" | "sqlite"
  >("postgres");
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

  const handleDbChange = (id: "postgres" | "mysql" | "mssql" | "sqlite") => {
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
    "w-full bg-background border border-line-strong rounded-md px-3 py-2 text-sm text-foreground placeholder:text-subtle outline-none focus:border-primary/60 transition-all";

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
                ? "bg-primary/10 border-primary/40 text-foreground"
                : "bg-ink/2 border-border text-subtle hover:border-line-strong hover:text-foreground"
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
          <label className="block text-[11px] font-medium text-subtle mb-1.5">
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
          <label className="block text-[11px] font-medium text-subtle mb-1.5">
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
          <label className="block text-[11px] font-medium text-subtle mb-1.5">
            Port
          </label>
          <input
            className={inputCls}
            value={form.port}
            onChange={(e) => field("port", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-subtle mb-1.5">
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
          <label className="block text-[11px] font-medium text-subtle mb-1.5">
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
          <label className="block text-[11px] font-medium text-subtle mb-1.5">
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
              ? "bg-ok/10 border border-ok/20 text-ok"
              : "bg-err/10 border border-err/20 text-err"
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
          className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold text-foreground/80 hover:bg-ink/[0.05] hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
          className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_2px_rgb(67_56_202/0.25)]"
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
    <p className="text-sm text-muted-foreground leading-relaxed">
      Your database is connected. Here&apos;s a sample query ready to run — or
      write your own in the editor.
    </p>

    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-background border-b border-border">
        <span className="text-[11px] font-medium text-subtle">SQL</span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-mono text-subtle">
            ready to execute
          </span>
        </div>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed">
        {SAMPLE_QUERY.map((line, li) => (
          <div key={li} className="flex items-start gap-3">
            <span className="text-subtle/70 select-none w-4 text-right shrink-0 text-[11px] mt-0.5">
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
          className="p-3 rounded-xl border border-border bg-ink/2"
        >
          <div className="text-xs font-mono text-accent-fg mb-1">{tip.val}</div>
          <div className="text-[11px] text-subtle font-medium">{tip.label}</div>
        </div>
      ))}
    </div>

    <button
      onClick={onNext}
      className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all shadow-[0_1px_2px_rgb(67_56_202/0.25)]"
    >
      Open Query Editor
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

// ── Step 3: Explore ───────────────────────────────────────────────────────────

const ExploreStep = ({ onDone }: { onDone: () => void }) => (
  <div className="space-y-5">
    <p className="text-sm text-muted-foreground leading-relaxed">
      You&apos;re all set. Here&apos;s everything available in your dashboard.
    </p>

    <div className="grid grid-cols-2 gap-3">
      {FEATURES.map((f) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="p-4 rounded-xl border border-border bg-ink/2 hover:border-primary/20 hover:bg-primary/3 transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Icon className="h-3.5 w-3.5 text-accent-fg" />
            </div>
            <div className="text-sm font-semibold text-foreground mb-1">
              {f.title}
            </div>
            <div className="text-[11px] text-subtle leading-relaxed">
              {f.description}
            </div>
          </div>
        );
      })}
    </div>

    <button
      onClick={onDone}
      className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-all shadow-[0_1px_2px_rgb(67_56_202/0.25)]"
    >
      Enter Dashboard
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

// ── Main Wizard ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: 1,
    title: "Connect your database",
    subtitle: "Add your first connection",
  },
  {
    number: 2,
    title: "Run your first query",
    subtitle: "See results in milliseconds",
  },
  {
    number: 3,
    title: "Explore your data",
    subtitle: "Everything at your fingertips",
  },
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
      `/dashboard/query${selectedCluster ? `?cluster=${selectedCluster.id}` : ""}`,
    );
  };

  const skip = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "1");
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-[2px] flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.07] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Skip */}
        <button
          onClick={skip}
          className="absolute -top-10 right-0 flex items-center gap-1.5 text-xs text-subtle hover:text-muted-foreground transition-colors"
        >
          <X className="h-3 w-3" />
          Skip setup
        </button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="relative rounded-xl border border-border bg-background overflow-hidden"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Step indicator */}
          <div className="flex items-center gap-0 border-b border-border">
            {STEPS.map((s, i) => (
              <div
                key={s.number}
                className={`flex-1 flex items-center gap-2.5 px-5 py-4 border-r border-border last:border-r-0 transition-all duration-300 ${
                  i === step
                    ? "bg-primary/[0.06]"
                    : i < step
                      ? "bg-ink/[0.01]"
                      : "opacity-40"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-medium transition-all ${
                    i < step
                      ? "bg-primary text-white"
                      : i === step
                        ? "bg-primary/20 border border-primary/40 text-accent-fg"
                        : "bg-ink/5 border border-border text-subtle"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="h-3 w-3" /> : s.number}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="text-[11px] font-medium text-foreground truncate">
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
                <Database className="h-4 w-4 text-accent-fg" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {STEPS[step].title}
                </h2>
                <p className="text-[11px] text-subtle">
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
                {step === 0 && <ConnectStep onSuccess={() => setStep(1)} />}
                {step === 1 && <QueryStep onNext={() => setStep(2)} />}
                {step === 2 && <ExploreStep onDone={complete} />}
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
