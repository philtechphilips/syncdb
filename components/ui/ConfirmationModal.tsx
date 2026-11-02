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

  // Clear the typed confirmation when the modal closes.
  const [wasOpen, setWasOpen] = React.useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setInputValue("");
  }

  if (!isOpen) return null;

  const Icon =
    type === "danger" ? AlertCircle : type === "warning" ? AlertCircle : Info;
  const colorClass =
    type === "danger"
      ? "text-err bg-err/10 border-err/20"
      : type === "warning"
        ? "text-warn bg-warn/10 border-warn/20"
        : "text-accent-fg bg-primary/10 border-primary/20";

  const buttonClass =
    type === "danger"
      ? "bg-err text-white hover:bg-err/90 disabled:bg-err/30 disabled:text-err disabled:shadow-none disabled:cursor-not-allowed"
      : type === "warning"
        ? "bg-warn text-white hover:bg-warn/90 disabled:bg-warn/30 disabled:text-warn disabled:shadow-none disabled:cursor-not-allowed"
        : "bg-primary text-white hover:bg-primary/90 disabled:bg-primary/30 disabled:text-primary-foreground/50 disabled:shadow-none disabled:cursor-not-allowed";

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
            className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col items-center text-center">
              <div
                className={`h-16 w-16 rounded-xl ${colorClass} border flex items-center justify-center mb-6`}
              >
                <Icon className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-sm text-subtle leading-relaxed mb-6">
                {message}
              </p>

              {confirmValue && (
                <div className="w-full mb-8 space-y-3">
                  <p className="text-[11px] text-subtle text-left px-1">
                    Type{" "}
                    <span className="text-foreground font-mono bg-ink/5 py-0.5 px-1.5 rounded border border-border select-all">
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
                    className="w-full bg-background border border-line-strong rounded-md px-4 py-2 text-sm text-foreground placeholder:text-subtle/70 outline-none focus:border-err/50 transition-all text-center"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 w-full">
                {!isAlert && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 rounded-md border border-border bg-ink/[0.03] text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-ink/10 transition-all font-sans"
                  >
                    {cancelLabel}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`flex-1 px-6 py-3 rounded-md text-[11px] font-medium transition-all font-sans ${buttonClass}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-ink/5 text-subtle hover:text-foreground transition-all"
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
