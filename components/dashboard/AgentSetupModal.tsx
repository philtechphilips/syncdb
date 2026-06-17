"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface AgentSetupModalProps {
  onDone: () => void;
}

const STEPS = [
  { cmd: "npm install -g synqdb-agent", label: "Install" },
  { cmd: "synqdb-agent login", label: "Authenticate" },
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-[2rem] bg-background p-10 shadow-3xl border border-primary/20 overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full blur-[80px] bg-primary/10 pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Terminal className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white tracking-tight">
                Start the Local Agent
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                Your cluster has been created
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Run these commands on your machine
            </span>

            <div className="rounded-xl border border-border/50 bg-black/40 p-4 space-y-3">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <code className="flex-1 font-mono text-xs text-primary">
                    {step.cmd}
                  </code>
                  <button
                    onClick={() => handleCopy(step.cmd, i)}
                    className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors"
                    title={`Copy ${step.label} command`}
                  >
                    {copiedIdx === i ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-zinc-600 font-medium px-1 leading-relaxed">
              <code className="font-mono">synqdb-agent login</code> opens your
              browser — log in and click{" "}
              <strong className="text-zinc-400">Authorize</strong>. No keys to
              copy or paste.
            </p>
          </div>

          {/* Done button */}
          <button
            onClick={onDone}
            className="w-full rounded-xl bg-primary px-8 py-4 text-xs font-black text-primary-foreground uppercase tracking-widest shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:shadow-[0_0_40px_rgba(0,237,100,0.5)] transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSetupModal;
