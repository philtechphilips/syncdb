import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "./errorUtils";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Don't show the global error toast for this request. */
    _skipToast?: boolean;
    _retry?: boolean;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not defined in environment variables.");
}

// The refresh token is an httpOnly cookie set by the API, so requests must
// include credentials; the access token lives only in memory.
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Single in-flight refresh promise — prevents concurrent 401s from each
// triggering their own refresh.
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require("@/store/useAuthStore");
    try {
      const res = await axios.post(
        `${API_URL}/v1/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const { access_token, user } = res.data;
      useAuthStore.getState().setSession(access_token, user);
      return access_token as string;
    } catch {
      useAuthStore.getState().logout();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── Request interceptor — attach access token ─────────────────────────────────
api.interceptors.request.use((config) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
      // refreshAccessToken already called logout — just reject quietly
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 && !originalRequest?._skipToast) {
      toast.error(getErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

export default api;
