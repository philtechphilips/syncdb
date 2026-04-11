"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, AlertTriangle } from "lucide-react";

interface AgentSetupModalProps {
  agentKey: string;
  onDone: () => void;
}

const AgentSetupModal = ({ agentKey, onDone }: AgentSetupModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(agentKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                Local Agent Setup
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                Your cluster has been created
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
            <AlertTriangle className="h-4 w-4 text-white shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-300 font-bold leading-relaxed">
              This agent key will{" "}
              <span className="underline">not be shown again</span>. Copy it now
              and keep it safe. Anyone with this key can access your local
              database through the relay.
            </p>
          </div>

          {/* Agent Key */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Your Agent Key
            </span>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-xs text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 break-all select-all">
                {agentKey}
              </code>
              <button
                onClick={handleCopy}
                className="h-11 w-11 shrink-0 rounded-xl border border-border/50 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Install instructions */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
              Start the agent on your machine
            </span>
            <div className="rounded-xl border border-border/50 bg-black/40 p-4 font-mono text-xs text-zinc-300 space-y-1">
              <p>
                <span className="text-zinc-600"># one-time install</span>
              </p>
              <p>npm install -g synqdb-agent</p>
              <p className="pt-1">
                <span className="text-zinc-600">
                  # or run without installing
                </span>
              </p>
              <p>npx synqdb-agent {agentKey}</p>
            </div>
            <p className="text-[9px] text-zinc-600 font-medium px-1">
              The agent connects outbound to SynqDB — no firewall changes or
              port forwarding required.
            </p>
          </div>

          {/* Done button */}
          <button
            onClick={onDone}
            className="w-full rounded-xl bg-primary px-8 py-4 text-xs font-black text-primary-foreground uppercase tracking-widest shadow-[0_0_20px_rgba(0,237,100,0.3)] hover:shadow-[0_0_40px_rgba(0,237,100,0.5)] transition-all active:scale-95"
          >
            Done — I&apos;ve Saved the Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSetupModal;
