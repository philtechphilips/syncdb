import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errorUtils";

// Refresh token lives in localStorage so it survives new tabs and browser
// restarts. Access token stays in-memory only — never written to storage.
const RT_KEY = "synqdb_rt";

const saveRefreshToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(RT_KEY, token);
  else localStorage.removeItem(RT_KEY);
};

export const loadRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(RT_KEY);
};

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile_picture?: string;
  settings?: Record<string, any>;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Called by api.ts refresher — must not import api to avoid circular dep
  getRefreshToken: () => string | null;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User | null) => void;

  login: (credentials: Record<string, unknown>) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
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
  updateSettings: (settings: Record<string, any>) => Promise<void>;

  fetchAgentKey: () => Promise<{ agentKey: string }>;
  rotateAgentKey: () => Promise<{ agentKey: string }>;
  fetchAgentStatus: () => Promise<{ connected: boolean }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      access_token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      getRefreshToken: () => loadRefreshToken(),

      setTokens: (access, refresh) => {
        saveRefreshToken(refresh);
        set({ access_token: access });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // ── Auth flows ──────────────────────────────────────────────────────────

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/v1/auth/login", credentials);
          const { user, access_token, refresh_token } = res.data;
          saveRefreshToken(refresh_token);
          set({ user, access_token, isAuthenticated: true, isLoading: false });
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
        saveRefreshToken(null);
        set({
          user: null,
          access_token: null,
          isAuthenticated: false,
          error: null,
        });
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.location.href = "/auth/login";
        }
      },

      // checkAuth — called once on dashboard mount.
      // 1. If we already have an access_token in-memory, verify it via /status.
      // 2. If not (page reload / new tab), try a silent refresh from localStorage RT.
      // 3. If refresh also fails, log out.
      // Returns true if authenticated, false otherwise.
      checkAuth: async () => {
        set({ isLoading: true });

        let { access_token } = get();

        if (!access_token) {
          const rt = loadRefreshToken();
          if (!rt) {
            set({ isAuthenticated: false, isLoading: false });
            return false;
          }
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${API_URL}/v1/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: rt }),
            });
            if (!res.ok) throw new Error("refresh failed");
            const data = await res.json();
            saveRefreshToken(data.refresh_token ?? rt);
            set({ access_token: data.access_token });
            access_token = data.access_token;
          } catch {
            saveRefreshToken(null);
            set({
              isAuthenticated: false,
              isLoading: false,
              access_token: null,
            });
            return false;
          }
        }

        try {
          const res = await api.get("/v1/auth/status");
          set({ user: res.data, isAuthenticated: true, isLoading: false });
          return true;
        } catch {
          saveRefreshToken(null);
          set({
            user: null,
            access_token: null,
            isAuthenticated: false,
            isLoading: false,
          });
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
        const res = await api.get("/v1/auth/agent-key", {
          _skipToast: true,
        } as any);
        return res.data;
      },

      rotateAgentKey: async () => {
        const res = await api.post("/v1/auth/rotate-agent-key", {}, {
          _skipToast: true,
        } as any);
        return res.data;
      },

      fetchAgentStatus: async () => {
        const res = await api.get("/v1/auth/agent-status", {
          _skipToast: true,
        } as any);
        return res.data;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      // Only persist the user profile — tokens are handled separately
      // (access_token in-memory, refresh_token in localStorage via saveRefreshToken)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
