import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "./errorUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not defined in environment variables.");
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Single in-flight refresh promise — prevents concurrent 401s from each
// triggering their own refresh and racing each other to invalidate the token.
let refreshPromise: Promise<string | null> | null = null;

async function attemptRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const { useAuthStore } = require("@/store/useAuthStore");
      const refreshToken = useAuthStore.getState().getRefreshToken();
      if (!refreshToken) return null;

      const res = await axios.post(`${API_URL}/v1/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefresh } = res.data;
      useAuthStore
        .getState()
        .setTokens(access_token, newRefresh ?? refreshToken);
      return access_token as string;
    } catch {
      const { useAuthStore } = require("@/store/useAuthStore");
      useAuthStore.getState().logout();
      return null;
    } finally {
      // Clear so the next expiry triggers a fresh refresh
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── Request interceptor — attach access token ─────────────────────────────────
api.interceptors.request.use((config) => {
  const { useAuthStore } = require("@/store/useAuthStore");
  const token = useAuthStore.getState().access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — handle 401, show toasts ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await attemptRefresh();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // attemptRefresh already called logout — just reject quietly
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 && !originalRequest._skipToast) {
      toast.error(getErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

export default api;
