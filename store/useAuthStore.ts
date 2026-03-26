import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errorUtils";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile_picture?: string;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setTokens: (access: string | null, refresh: string | null) => void;
  login: (
    credentials: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
  register: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  forgotPassword: (email: string) => Promise<Record<string, unknown>>;
  resetPassword: (
    data: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (access, refresh) => {
        set({ access_token: access, refresh_token: refresh });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/v1/auth/login", credentials);
          const { user, access_token, refresh_token } = response.data;

          set({
            user,
            access_token,
            refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data;
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/v1/auth/register", data);
          set({ isLoading: false });
          return response.data;
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/v1/auth/forgot-password", {
            email,
          });
          set({ isLoading: false });
          return response.data;
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/v1/auth/reset-password", data);
          set({ isLoading: false });
          return response.data;
        } catch (error: unknown) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          access_token: null,
          refresh_token: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }
      },

      checkAuth: async () => {
        // Tokens are in-memory only; if there's no access_token in state the session is gone
        const { access_token } = get();
        if (!access_token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.get("/v1/auth/status");
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            access_token: null,
            refresh_token: null,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
