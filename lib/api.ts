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
    const token = localStorage.getItem("access_token");
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

      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refresh_token")
          : null;

      if (!refreshToken) {
        console.error("No refresh token available, forcing logout");
        handleLogout();
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh access token...");
        const response = await axios.post(`${API_URL}/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        if (access_token) {
          localStorage.setItem("access_token", access_token);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    // Prevent infinite redirect loops if already on login page
    if (window.location.pathname !== "/auth/login") {
      window.location.href = "/auth/login";
    }
  }
}

export default api;
