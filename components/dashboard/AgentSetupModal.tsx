"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface AgentSetupModalProps {
  onDone: () => void;
}

const STEPS = [
  { cmd: "npm install -g synqdb-agent", label: "Install" },
  { cmd: "synqdb-agent login", label: "Authenticate" },
  {
    cmd: "synqdb-agent add my-db postgres://user@localhost:5432/mydb",
    label:
      "Save a connection (asks for the password, which stays on your machine)",
  },
  { cmd: "synqdb-agent", label: "Start" },
];

const AgentSetupModal = ({ onDone }: AgentSetupModalProps) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-xl bg-background p-10 shadow-3xl border border-primary/20 overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-bg-200 border border-border flex items-center justify-center">
              <Terminal className="h-6 w-6 text-subtle" />
            </div>
            <div>
              <h2 className="text-xl text-foreground tracking-tight font-semibold">
                Start the Local Agent
              </h2>
              <p className="text-[11px] text-subtle">
                Your cluster has been created
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <span className="text-[11px] font-medium text-subtle ml-1">
              Run these commands on your machine
            </span>

            <div className="rounded-xl border border-border bg-bg-200 p-4 space-y-3">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-full bg-bg-200 border border-border text-[11px] font-medium text-muted-foreground flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <code className="flex-1 font-mono text-xs text-accent-fg">
                    {step.cmd}
                  </code>
                  <button
                    onClick={() => handleCopy(step.cmd, i)}
                    className="shrink-0 text-subtle hover:text-foreground transition-colors"
                    title={`Copy ${step.label} command`}
                  >
                    {copiedIdx === i ? (
                      <Check className="h-3.5 w-3.5 text-subtle" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-subtle px-1 leading-relaxed">
              <code className="font-mono">synqdb-agent login</code> opens your
              browser — log in and click{" "}
              <strong className="text-muted-foreground">Authorize</strong>. No
              keys to copy or paste.
            </p>
          </div>

          {/* Done button */}
          <button
            onClick={onDone}
            className="w-full rounded-md bg-primary px-8 py-2 text-xs font-medium text-white transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSetupModal;
