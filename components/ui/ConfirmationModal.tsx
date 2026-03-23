"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info, X } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";

const ConfirmationModal = () => {
  const {
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    type,
    isAlert,
    confirmValue,
    close,
  } = useModalStore();
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) setInputValue("");
  }, [isOpen]);

  if (!isOpen) return null;

  const Icon =
    type === "danger" ? AlertCircle : type === "warning" ? AlertCircle : Info;
  const colorClass =
    type === "danger"
      ? "text-red-500 bg-red-500/10 border-red-500/20"
      : type === "warning"
        ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
        : "text-primary bg-primary/10 border-primary/20";

  const buttonClass =
    type === "danger"
      ? "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:bg-red-500/30 disabled:text-red-300 disabled:shadow-none disabled:cursor-not-allowed"
      : type === "warning"
        ? "bg-amber-500 text-white hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:bg-amber-500/30 disabled:text-amber-300 disabled:shadow-none disabled:cursor-not-allowed"
        : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(0,237,100,0.3)] disabled:bg-primary/30 disabled:text-primary-foreground/50 disabled:shadow-none disabled:cursor-not-allowed";

  const handleConfirm = async () => {
    if (confirmValue && inputValue !== confirmValue) return;
    if (onConfirm) await onConfirm();
    close();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    close();
  };

  const isConfirmDisabled = !!confirmValue && inputValue !== confirmValue;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#0b1215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col items-center text-center">
              <div
                className={`h-16 w-16 rounded-2xl ${colorClass} border flex items-center justify-center mb-6`}
              >
                <Icon className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-sm font-bold text-zinc-500 leading-relaxed mb-6">
                {message}
              </p>

              {confirmValue && (
                <div className="w-full mb-8 space-y-3">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left px-1">
                    Type{" "}
                    <span className="text-white font-mono bg-white/5 py-0.5 px-1.5 rounded border border-white/5 select-all">
                      {confirmValue}
                    </span>{" "}
                    to confirm
                  </p>
                  <input
                    type="text"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Type ${confirmValue}...`}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all text-center tracking-widest"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 w-full">
                {!isAlert && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.03] text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all font-sans"
                  >
                    {cancelLabel}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`flex-1 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all font-sans ${buttonClass}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
