import axios from "axios";
import { API_BASE_URL } from "@/config/constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach JWT from memory ──────────────────────────────
api.interceptors.request.use((config) => {
  return config;
});

// ── Response interceptor — silent token refresh on 401 ───────────────────────
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh calls or already-retried requests
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");
    if (isRefreshCall || originalRequest?._retried) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Try to silently refresh the token
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await api.post<{ data: { access_token: string } }>(
            "/v1/auth/refresh"
          );
          const newToken = res.data.data.access_token;
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          pendingRequests.forEach((cb) => cb(newToken));
          pendingRequests = [];
        } catch {
          // Refresh failed — session is truly expired, redirect to sign-in
          pendingRequests = [];
          window.location.href = "/auth/sign-in";
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue this request until refresh completes
      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          originalRequest._retried = true;
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
