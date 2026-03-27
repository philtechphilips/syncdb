"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all";

const Section = ({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    }}
    className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden"
  >
    <div className="flex items-start gap-3 px-6 py-5 border-b border-white/5">
      <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </motion.div>
);

// ── Profile Section ───────────────────────────────────────────────────────────

const ProfileSection = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [avatar, setAvatar] = useState(user?.profile_picture ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: fullName,
        profile_picture: avatar || undefined,
      });
      setSaved(true);
      toast.success("Profile updated");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // error shown via toast from api.ts
    }
  };

  return (
    <Section
      title="Profile"
      description="Update your display name and avatar"
      icon={User}
    >
      <div className="space-y-4">
        {/* Avatar preview */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {avatar && (avatar.startsWith("http") || avatar.startsWith("/")) ? (
              <img
                src={avatar}
                alt={fullName || "Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-tr from-primary/40 to-primary/10 flex items-center justify-center text-sm font-black text-white">
                {fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "??"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
              Avatar URL
            </label>
            <input
              className={inputCls}
              placeholder="https://..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
              Full Name
            </label>
            <input
              className={inputCls}
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
              Email
            </label>
            <input
              className={`${inputCls} opacity-50 cursor-not-allowed`}
              value={user?.email ?? ""}
              disabled
              title="Email cannot be changed"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </Section>
  );
};

// ── Password Section ──────────────────────────────────────────────────────────

const PasswordSection = () => {
  const { changePassword, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [show, setShow] = useState({ current: false, next: false });
  const [error, setError] = useState<string | null>(null);

  const field = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (form.new_password !== form.confirm_password) {
      setError("New passwords do not match.");
      return;
    }
    if (form.new_password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    try {
      await changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setForm({ current_password: "", new_password: "", confirm_password: "" });
      toast.success("Password updated successfully");
    } catch {
      // api.ts shows toast
    }
  };

  return (
    <Section
      title="Change Password"
      description="Use a strong password of at least 8 characters"
      icon={Lock}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              className={`${inputCls} pr-10`}
              placeholder="••••••••"
              value={form.current_password}
              onChange={(e) => field("current_password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {show.current ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={show.next ? "text" : "password"}
                className={`${inputCls} pr-10`}
                placeholder="••••••••"
                value={form.new_password}
                onChange={(e) => field("new_password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {show.next ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              className={inputCls}
              placeholder="••••••••"
              value={form.confirm_password}
              onChange={(e) => field("confirm_password", e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Strength indicator */}
        {form.new_password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[8, 12, 16].map((len, i) => (
                <div
                  key={len}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    form.new_password.length >= len
                      ? i === 0
                        ? "bg-red-500"
                        : i === 1
                          ? "bg-yellow-500"
                          : "bg-emerald-500"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-zinc-600">
              {form.new_password.length < 8
                ? "Too short"
                : form.new_password.length < 12
                  ? "Weak"
                  : form.new_password.length < 16
                    ? "Good"
                    : "Strong"}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !form.current_password ||
              !form.new_password ||
              !form.confirm_password
            }
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            Update Password
          </button>
        </div>
      </div>
    </Section>
  );
};

// ── Danger Zone ───────────────────────────────────────────────────────────────

const DangerSection = () => {
  const { logout } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-red-500/10">
        <h2 className="text-sm font-bold text-white">Session</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Manage your active session
        </p>
      </div>
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Sign out</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              End your current session on this device
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 hover:border-red-500/50 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-zinc-500 mt-1">{user?.email}</p>
        </div>

        <ProfileSection />
        <PasswordSection />
        <DangerSection />
      </div>
    </div>
  );
}
