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
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (data: any) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (access, refresh) => {
        if (access) localStorage.setItem("access_token", access);
        else localStorage.removeItem("access_token");

        if (refresh) localStorage.setItem("refresh_token", refresh);
        else localStorage.removeItem("refresh_token");

        set({ access_token: access, refresh_token: refresh });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/v1/auth/login", credentials);
          const { user, access_token, refresh_token } = response.data;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          localStorage.setItem("user", JSON.stringify(user));

          set({
            user,
            access_token,
            refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });
          return response.data;
        } catch (error: any) {
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
        } catch (error: any) {
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
        } catch (error: any) {
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
        } catch (error: any) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        set({
          user: null,
          access_token: null,
          refresh_token: null,
          isAuthenticated: false,
        });
        window.location.href = "/auth/login";
      },

      checkAuth: async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
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
            access_token: token,
            refresh_token: localStorage.getItem("refresh_token"),
          });
        } catch (error) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
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
