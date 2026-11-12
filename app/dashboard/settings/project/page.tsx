"use client";

import React, { useState } from "react";
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
  Terminal,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

import { UI_CLASSES } from "@/lib/constants";
import {
  SettingsSection,
  SettingsToggle,
  SettingsLabel,
} from "@/components/ui/SettingsUI";

// ── Local Agent Section ───────────────────────────────────────────────────────

const LocalAgentSection = () => {
  const { rotateAgentKey, fetchAgentStatus } = useAuthStore();

  const [connected, setConnected] = React.useState<boolean>(false);
  const [rotating, setRotating] = React.useState(false);
  const [confirmRotate, setConfirmRotate] = React.useState(false);

  React.useEffect(() => {
    fetchAgentStatus()
      .then((r) => setConnected(r.connected))
      .catch(() => null);
  }, []);

  const handleRotate = async () => {
    if (!confirmRotate) {
      setConfirmRotate(true);
      setTimeout(() => setConfirmRotate(false), 4000);
      return;
    }
    setConfirmRotate(false);
    setRotating(true);
    try {
      await rotateAgentKey();
      setConnected(false);
      toast.success("Agent key rotated", {
        description:
          "The old key is now invalid. Run `npx synqdb-agent login` to re-authenticate.",
      });
    } catch {
      toast.error("Failed to rotate key");
    } finally {
      setRotating(false);
    }
  };

  return (
    <SettingsSection
      title="Local Agent"
      description="Connect your local databases to SynqDB via the agent CLI."
      icon={Laptop}
      delay={0.3}
    >
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-primary" : "bg-ink/20"}`}
          />
          <span className="text-[11px] text-subtle font-medium">
            {connected ? "Agent Connected" : "Agent Offline"}
          </span>
        </div>

        {/* Install & login steps */}
        <div className="rounded-xl border border-border bg-bg-200 p-3 space-y-3">
          <p className="text-[11px] text-subtle">Quick Start</p>

          <div className="space-y-2">
            {[
              {
                step: "1",
                label: "Install",
                cmd: "npm install -g synqdb-agent",
              },
              { step: "2", label: "Login", cmd: "synqdb-agent login" },
              { step: "3", label: "Run", cmd: "synqdb-agent" },
            ].map(({ step, label, cmd }) => (
              <div key={step} className="flex items-center gap-3">
                <span className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-medium text-accent-fg flex items-center justify-center shrink-0">
                  {step}
                </span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[11px] text-subtle font-medium w-8 shrink-0">
                    {label}
                  </span>
                  <code className="font-mono text-[11px] text-accent-fg truncate">
                    {cmd}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-subtle leading-relaxed pt-1 border-t border-border">
            <Terminal className="h-2.5 w-2.5 inline mr-1 -mt-px" />
            <code>synqdb-agent login</code> opens your browser — log in and
            click Authorize. No keys to copy.
          </p>
        </div>

        {/* Rotate key */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-[11px] text-muted-foreground">Revoke Access</p>
            <p className="text-[11px] text-subtle mt-0.5">
              Rotates the underlying key and disconnects any running agents.
            </p>
          </div>
          <button
            onClick={handleRotate}
            disabled={rotating}
            className={`flex items-center gap-1.5 text-[11px] font-medium transition-all px-2.5 py-1 rounded-lg ${
              confirmRotate
                ? "text-err border border-err/30 bg-err/10"
                : "text-subtle hover:text-err border border-transparent hover:border-err/20"
            }`}
          >
            {rotating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {confirmRotate ? "Click again to confirm" : "Rotate Key"}
          </button>
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
    monacoTheme: "auto",
    bracketPairColorization: true,
  });
  const [isSaved, setIsSaved] = useState(false);

  // Pick up saved settings when they arrive (adjusting state during render
  // instead of in an effect avoids an extra render pass).
  const [loadedFrom, setLoadedFrom] = useState<
    Record<string, unknown> | undefined
  >(undefined);
  if (user?.settings !== loadedFrom) {
    setLoadedFrom(user?.settings);
    if (user?.settings) setSettings((prev) => ({ ...prev, ...user.settings }));
  }

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

  const update = (key: string, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl text-foreground tracking-tight font-semibold">
              Project Settings
            </h1>
            <p className="text-sm text-subtle mt-1.5 leading-relaxed">
              Global configurations for your workspace, safety, and AI
              assistance.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-2.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="h-px bg-ink/5"></div>
              <SettingsToggle
                label="Enhanced Production Confirmation"
                description="Require a secondary confirmation dialog for all write operations on Production clusters."
                enabled={settings.productionConfirmations}
                onChange={(v) => update("productionConfirmations", v)}
              />
              <div className="h-px bg-ink/5"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-foreground/80">
                    Safety Result Limit
                  </p>
                  <p className="text-[11px] text-subtle mt-0.5">
                    Protect memory by capping maximum ad-hoc query results.
                  </p>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    className={`${UI_CLASSES.input} text-center font-semibold`}
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
                    value={
                      settings.monacoTheme === "synq-dark"
                        ? "auto"
                        : settings.monacoTheme
                    }
                    onChange={(e) => update("monacoTheme", e.target.value)}
                  >
                    <option value="auto">Match app theme</option>
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
              <div className="h-px bg-ink/5"></div>
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
          <div className="p-4 rounded-xl bg-warn/10 border border-warn/20 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
            <AlertTriangle className="h-5 w-5 text-warn shrink-0" />
            <div className="flex-1">
              <h4 className="text-[11px] font-medium text-warn">
                Workspace Impact
              </h4>
              <p className="text-[11px] text-subtle mt-1 leading-relaxed">
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
