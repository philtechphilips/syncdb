import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errorUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_KEY = "rt"; // refresh token — sessionStorage only

const saveRefreshToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(SESSION_KEY, token);
  else sessionStorage.removeItem(SESSION_KEY);
};

const loadRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY);
};

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
  updateProfile: (data: { full_name?: string; profile_picture?: string }) => Promise<void>;
  changePassword: (data: { current_password: string; new_password: string }) => Promise<void>;
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
        if (refresh) saveRefreshToken(refresh);
        set({ access_token: access, refresh_token: refresh });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/v1/auth/login", credentials);
          const { user, access_token, refresh_token } = response.data;
          saveRefreshToken(refresh_token);

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
        saveRefreshToken(null);
        set({
          user: null,
          access_token: null,
          refresh_token: null,
          isAuthenticated: false,
        });
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/auth/login"
        ) {
          window.location.href = "/auth/login";
        }
      },

      checkAuth: async () => {
        let { access_token } = get();

        // On page reload the in-memory access token is gone — try a silent refresh
        if (!access_token) {
          const storedRefresh = loadRefreshToken();
          if (!storedRefresh) {
            set({ isAuthenticated: false, isLoading: false });
            return;
          }
          try {
            const res = await axios.post(`${API_URL}/v1/auth/refresh`, {
              refresh_token: storedRefresh,
            });
            const { access_token: newAccess, refresh_token: newRefresh } = res.data;
            saveRefreshToken(newRefresh ?? storedRefresh);
            set({ access_token: newAccess, refresh_token: newRefresh ?? storedRefresh });
            access_token = newAccess;
          } catch {
            saveRefreshToken(null);
            set({ isAuthenticated: false, isLoading: false });
            return;
          }
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
          saveRefreshToken(null);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            access_token: null,
            refresh_token: null,
          });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch("/v1/auth/profile", data);
          set({ user: { ...get().user!, ...response.data }, isLoading: false });
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
