"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Keyboard,
  CheckCircle2,
  Save,
  Loader2,
  AlertTriangle,
  Laptop,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useClusterStore } from "@/store/useClusterStore";
import { toast } from "sonner";

import { UI_CLASSES } from "@/lib/constants";
import {
  SettingsSection,
  SettingsToggle,
  SettingsLabel,
} from "@/components/ui/SettingsUI";

// ── Local Agent Section ───────────────────────────────────────────────────────

const LocalAgentSection = () => {
  const { clusters, fetchAgentKey, rotateAgentKey, fetchAgentStatus } =
    useClusterStore();
  const localClusters = clusters.filter((c) => c.isLocal);

  const [keys, setKeys] = React.useState<Record<string, string>>({});
  const [statuses, setStatuses] = React.useState<
    Record<string, boolean | null>
  >({});
  const [visible, setVisible] = React.useState<Record<string, boolean>>({});
  const [copied, setCopied] = React.useState<Record<string, boolean>>({});
  const [rotating, setRotating] = React.useState<Record<string, boolean>>({});
  const [confirmRotate, setConfirmRotate] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (localClusters.length === 0) return;
    localClusters.forEach(async (c) => {
      const [keyRes, statusRes] = await Promise.all([
        fetchAgentKey(c.id).catch(() => null),
        fetchAgentStatus(c.id).catch(() => null),
      ]);
      if (keyRes) setKeys((k) => ({ ...k, [c.id]: keyRes.agentKey }));
      if (statusRes)
        setStatuses((s) => ({ ...s, [c.id]: statusRes.connected }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async (clusterId: string) => {
    const key = keys[clusterId];
    if (!key) return;
    await navigator.clipboard.writeText(key);
    setCopied((c) => ({ ...c, [clusterId]: true }));
    setTimeout(() => setCopied((c) => ({ ...c, [clusterId]: false })), 2000);
  };

  const handleRotate = async (clusterId: string) => {
    if (confirmRotate !== clusterId) {
      setConfirmRotate(clusterId);
      setTimeout(() => setConfirmRotate(null), 4000);
      return;
    }
    setConfirmRotate(null);
    setRotating((r) => ({ ...r, [clusterId]: true }));
    try {
      const res = await rotateAgentKey(clusterId);
      setKeys((k) => ({ ...k, [clusterId]: res.agentKey }));
      setVisible((v) => ({ ...v, [clusterId]: true }));
      setStatuses((s) => ({ ...s, [clusterId]: false }));
      toast.success("Agent key rotated", {
        description: "The old key is now invalid. Copy and save the new key.",
      });
    } catch {
      toast.error("Failed to rotate key");
    } finally {
      setRotating((r) => ({ ...r, [clusterId]: false }));
    }
  };

  if (localClusters.length === 0) return null;

  return (
    <SettingsSection
      title="Local Agent"
      description="Manage relay agent keys for local database clusters."
      icon={Laptop}
      delay={0.3}
    >
      <div className="space-y-6">
        {localClusters.map((cluster) => (
          <div key={cluster.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded flex items-center justify-center text-[9px] font-black text-white"
                  style={{
                    borderLeft: `2px solid ${cluster.color || "#444"}`,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                >
                  {cluster.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white">
                  {cluster.name}
                </span>
                <span className="text-[9px] text-zinc-600 uppercase font-bold">
                  {cluster.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${statuses[cluster.id] === true ? "bg-primary" : "bg-zinc-600"}`}
                  title={
                    statuses[cluster.id] === true
                      ? "Agent connected"
                      : "Agent offline"
                  }
                />
                <span className="text-[9px] text-zinc-600 font-bold uppercase">
                  {statuses[cluster.id] === true ? "Connected" : "Offline"}
                </span>
              </div>
            </div>

            {/* Key display */}
            <div className="rounded-xl border border-border/50 bg-black/20 p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Key className="h-3 w-3 text-zinc-600 shrink-0" />
                <code className="flex-1 font-mono text-[10px] text-primary truncate select-all">
                  {keys[cluster.id] ? (
                    visible[cluster.id] ? (
                      keys[cluster.id]
                    ) : (
                      "••••••••-••••-••••-••••-••••••••••••"
                    )
                  ) : (
                    <span className="text-zinc-600">Loading...</span>
                  )}
                </code>
                <button
                  onClick={() =>
                    setVisible((v) => ({ ...v, [cluster.id]: !v[cluster.id] }))
                  }
                  className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors"
                  title={visible[cluster.id] ? "Hide" : "Reveal"}
                >
                  {visible[cluster.id] ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleCopy(cluster.id)}
                  className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors"
                  title="Copy key"
                >
                  {copied[cluster.id] ? (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <p className="text-[9px] text-zinc-600 font-mono">
                  npx synqdb-agent{" "}
                  {visible[cluster.id] && keys[cluster.id]
                    ? keys[cluster.id]
                    : "<key>"}
                </p>
                <button
                  onClick={() => handleRotate(cluster.id)}
                  disabled={rotating[cluster.id]}
                  className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider transition-all px-2.5 py-1 rounded-lg ${
                    confirmRotate === cluster.id
                      ? "text-red-400 border border-red-500/30 bg-red-500/10"
                      : "text-zinc-600 hover:text-red-400 border border-transparent hover:border-red-500/20"
                  }`}
                >
                  {rotating[cluster.id] ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  {confirmRotate === cluster.id
                    ? "Click again to confirm"
                    : "Rotate Key"}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/2">
          <AlertTriangle className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-[9px] text-zinc-600 leading-relaxed">
            Rotating a key immediately disconnects any running agent. You must
            restart the agent with the new key. Old keys are permanently
            invalidated.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
};

export default function ProjectSettingsPage() {
  const { user, updateSettings, isLoading } = useAuthStore();
  const [settings, setSettings] = useState({
    aiModel: "gpt-4o",
    aiContextEnabled: true,
    aiVerbosity: "balanced",
    destructiveActionLock: true,
    productionConfirmations: true,
    editorFontSize: 13,
    safetyLimit: 500,
    autoSaveQueries: true,
    monacoTheme: "synq-dark",
    bracketPairColorization: true,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setSettings((prev) => ({ ...prev, ...user.settings }));
    }
  }, [user?.settings]);

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      setIsSaved(true);
      toast.success("Settings updated");
      setTimeout(() => setIsSaved(false), 2000);
    } catch {
      // Toast shown by store
    }
  };

  const update = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-serif text-white tracking-tight">
              Project Settings
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5 font-medium leading-relaxed">
              Global configurations for your workspace, safety, and AI
              assistance.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,237,100,0.2)]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaved ? "Saved" : "Apply Changes"}
          </button>
        </div>

        <div className="space-y-6">
          {/* AI Settings */}
          <SettingsSection
            title="AI Intelligence"
            description="Control how AI generates and explains your SQL queries."
            icon={Zap}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <SettingsLabel>AI Service Provider</SettingsLabel>
                  <select
                    className={UI_CLASSES.select}
                    value={settings.aiModel}
                    onChange={(e) => update("aiModel", e.target.value)}
                  >
                    <option value="gpt-4o">OpenAI GPT-4o</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <SettingsLabel>Response Style</SettingsLabel>
                  <select
                    className={UI_CLASSES.select}
                    value={settings.aiVerbosity}
                    onChange={(e) => update("aiVerbosity", e.target.value)}
                  >
                    <option value="concise">Concise & Direct</option>
                    <option value="balanced">Balanced Explanation</option>
                    <option value="educational">Deep Technical Detail</option>
                  </select>
                </div>
              </div>
              <SettingsToggle
                label="Automatic Contextual Learning"
                description="Include schema metadata in all AI prompts for highly accurate SQL generation."
                enabled={settings.aiContextEnabled}
                onChange={(v) => update("aiContextEnabled", v)}
              />
            </div>
          </SettingsSection>

          {/* Safety & Governance */}
          <SettingsSection
            title="Safety & Governance"
            description="Prevent accidental data loss and enforce production best practices."
            icon={Shield}
            delay={0.1}
          >
            <div className="space-y-6">
              <SettingsToggle
                label="Destructive Action Lock"
                description="Disable direct execution of DROP and TRUNCATE commands in the SQL terminal."
                enabled={settings.destructiveActionLock}
                onChange={(v) => update("destructiveActionLock", v)}
              />
              <div className="h-px bg-white/5"></div>
              <SettingsToggle
                label="Enhanced Production Confirmation"
                description="Require a secondary confirmation dialog for all write operations on Production clusters."
                enabled={settings.productionConfirmations}
                onChange={(v) => update("productionConfirmations", v)}
              />
              <div className="h-px bg-white/5"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-zinc-300">
                    Safety Result Limit
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">
                    Protect memory by capping maximum ad-hoc query results.
                  </p>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    className={`${UI_CLASSES.input} text-center font-bold`}
                    value={settings.safetyLimit}
                    onChange={(e) =>
                      update("safetyLimit", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Interface & Editor */}
          <SettingsSection
            title="Interface & Editor"
            description="Personalize your terminal experience and monaco editor settings."
            icon={Keyboard}
            delay={0.2}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <SettingsLabel>Editor Font Size (PX)</SettingsLabel>
                  <input
                    type="number"
                    className={UI_CLASSES.input}
                    value={settings.editorFontSize}
                    onChange={(e) =>
                      update("editorFontSize", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <SettingsLabel>Monaco Theme</SettingsLabel>
                  <select
                    className={UI_CLASSES.select}
                    value={settings.monacoTheme}
                    onChange={(e) => update("monacoTheme", e.target.value)}
                  >
                    <option value="synq-dark">Synq Dark (Pro)</option>
                    <option value="monokai">Monokai Legend</option>
                    <option value="github-dark">GitHub Dark</option>
                  </select>
                </div>
              </div>
              <SettingsToggle
                label="Auto-Save Cloud History"
                description="Sync all executed queries to your project history automatically."
                enabled={settings.autoSaveQueries}
                onChange={(v) => update("autoSaveQueries", v)}
              />
              <div className="h-px bg-white/5"></div>
              <SettingsToggle
                label="Bracket Pair Colorization"
                description="Highlight matching brackets to navigate complex SQL statements faster."
                enabled={settings.bracketPairColorization}
                onChange={(v) => update("bracketPairColorization", v)}
              />
            </div>
          </SettingsSection>

          <LocalAgentSection />

          {/* Bottom Alert */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-500">
                Workspace Impact
              </h4>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Changes to AI context and safety limits will affect all future
                query executions. Destructive locks apply to both the SQL Editor
                and the Table Explorer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
