import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not defined in environment variables.");
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Import lazily to avoid circular dependency; read from in-memory store only
    const { useAuthStore } = require("@/store/useAuthStore");
    const token = useAuthStore.getState().access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

import { toast } from "sonner";
import { getErrorMessage } from "./errorUtils";

// Add a response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { useAuthStore } = require("@/store/useAuthStore");
      const refreshToken =
        useAuthStore.getState().refresh_token ??
        (typeof window !== "undefined" ? sessionStorage.getItem("rt") : null);

      if (!refreshToken) {
        console.error("No refresh token available, forcing logout");
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        if (access_token) {
          const nextRefresh = newRefreshToken ?? refreshToken;
          if (nextRefresh && typeof window !== "undefined") {
            sessionStorage.setItem("rt", nextRefresh);
          }
          useAuthStore
            .getState()
            .setTokens(access_token, nextRefresh);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        handleLogout("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }

    // Show toast for other critical errors
    if (error.response?.status !== 401 && !error.config?._skipToast) {
      toast.error(getErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

// Helper to handle forced logout
function handleLogout(message?: string) {
  if (typeof window !== "undefined") {
    if (message) toast.error(message);
    const { useAuthStore } = require("@/store/useAuthStore");
    useAuthStore.getState().logout();
  }
}

export default api;
