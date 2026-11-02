import { create } from "zustand";
import { persist } from "zustand/middleware";
import api, { refreshAccessToken } from "@/lib/api";
import { getErrorMessage } from "@/lib/errorUtils";

// The refresh token is an httpOnly cookie owned by the API; JavaScript can
// never read it. The access token stays in memory only.
const LEGACY_RT_KEY = "synqdb_rt";
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem(LEGACY_RT_KEY); // tokens from older versions
  } catch {
    // storage unavailable
  }
}

/** A connection saved on the agent (`synqdb-agent add`); never includes secrets. */
export interface AgentConnectionInfo {
  name: string;
  type: string;
  database: string | null;
}

/** Project settings saved on the account (all optional). */
export interface UserSettings {
  aiModel?: string;
  aiContextEnabled?: boolean;
  aiVerbosity?: string;
  destructiveActionLock?: boolean;
  productionConfirmations?: boolean;
  editorFontSize?: number;
  safetyLimit?: number;
  autoSaveQueries?: boolean;
  monacoTheme?: string;
  bracketPairColorization?: boolean;
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile_picture?: string;
  settings?: UserSettings;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  /** Called after a refresh: stores the new access token (and user). */
  setSession: (access: string, user?: User | null) => void;
  setUser: (user: User | null) => void;

  login: (credentials: Record<string, unknown>) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  /** Clears local state and ends the session on the server. */
  logout: () => void;
  checkAuth: () => Promise<boolean>;

  forgotPassword: (email: string) => Promise<Record<string, unknown>>;
  resetPassword: (
    data: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
  updateProfile: (data: {
    full_name?: string;
    profile_picture?: string;
  }) => Promise<void>;
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;

  fetchAgentKey: () => Promise<{ agentKey: string }>;
  rotateAgentKey: () => Promise<{ agentKey: string }>;
  fetchAgentStatus: () => Promise<{
    connected: boolean;
    version: string | null;
    connections: AgentConnectionInfo[];
  }>;
  clearError: () => void;
}

// ── Proactive token refresh ────────────────────────────────────────────────────
// Schedules a silent refresh ~60s before the access token expires so the user
// is never mid-session when the token dies. Clears itself on logout.

let proactiveRefreshTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleProactiveRefresh(accessToken: string) {
  if (proactiveRefreshTimer) clearTimeout(proactiveRefreshTimer);

  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const expiresInMs = payload.exp * 1000 - Date.now();
    const refreshInMs = Math.max(expiresInMs - 60_000, 0); // 60s before expiry
    proactiveRefreshTimer = setTimeout(() => {
      void refreshAccessToken();
    }, refreshInMs);
  } catch {
    // Malformed token — interceptor handles it on next request
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      access_token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setSession: (access, user) => {
        set({
          access_token: access,
          isAuthenticated: true,
          ...(user ? { user } : {}),
        });
        scheduleProactiveRefresh(access);
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // ── Auth flows ──────────────────────────────────────────────────────────

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/v1/auth/login", credentials);
          const { user, access_token } = res.data;
          set({ user, access_token, isAuthenticated: true, isLoading: false });
          scheduleProactiveRefresh(access_token);
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/v1/auth/register", data);
          set({ isLoading: false });
          return res.data;
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      logout: () => {
        if (proactiveRefreshTimer) {
          clearTimeout(proactiveRefreshTimer);
          proactiveRefreshTimer = null;
        }
        const wasSignedIn = !!get().access_token || get().isAuthenticated;
        set({
          user: null,
          access_token: null,
          isAuthenticated: false,
          error: null,
        });
        if (wasSignedIn) {
          // Ends the server session and clears the httpOnly cookie.
          void api
            .post("/v1/auth/logout", {}, { _skipToast: true })
            .catch(() => {});
        }
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.location.href = "/auth/login";
        }
      },

      // checkAuth — called on dashboard mount and after OAuth.
      // No in-memory token → exchange the refresh cookie for one.
      checkAuth: async () => {
        set({ isLoading: true });
        const { access_token } = get();
        if (access_token) {
          set({ isAuthenticated: true, isLoading: false });
          scheduleProactiveRefresh(access_token);
          return true;
        }
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: "{}",
            },
          );
          if (!res.ok) throw new Error("refresh failed");
          const data = await res.json();
          set({
            access_token: data.access_token,
            user: data.user ?? get().user,
            isAuthenticated: true,
            isLoading: false,
          });
          scheduleProactiveRefresh(data.access_token);
          return true;
        } catch {
          set({ isAuthenticated: false, isLoading: false, access_token: null });
          return false;
        }
      },

      // ── Profile ─────────────────────────────────────────────────────────────

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/v1/auth/forgot-password", { email });
          set({ isLoading: false });
          return res.data;
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/v1/auth/reset-password", data);
          set({ isLoading: false });
          return res.data;
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.patch("/v1/auth/profile", data);
          set({ user: { ...get().user!, ...res.data }, isLoading: false });
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      changePassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await api.patch("/v1/auth/password", data);
          set({ isLoading: false });
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      updateSettings: async (settings) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.patch("/v1/auth/profile", { settings });
          set({
            user: { ...get().user!, settings: res.data.settings },
            isLoading: false,
          });
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      // ── Agent ───────────────────────────────────────────────────────────────

      fetchAgentKey: async () => {
        const res = await api.get("/v1/auth/agent-key", { _skipToast: true });
        return res.data;
      },

      rotateAgentKey: async () => {
        const res = await api.post(
          "/v1/auth/rotate-agent-key",
          {},
          { _skipToast: true },
        );
        return res.data;
      },

      fetchAgentStatus: async () => {
        const res = await api.get("/v1/auth/agent-status", {
          _skipToast: true,
        });
        return res.data;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      // Only persist the user profile — the access token stays in memory and
      // the refresh token is an httpOnly cookie.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
