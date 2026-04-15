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
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    // Don't retry refresh calls or already-retried requests
    if (isRefreshCall || originalRequest?._retried) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (!isRefreshing) {
        // No refresh in progress — start one
        isRefreshing = true;
        try {
          const res = await api.post<{ data: { access_token: string } }>(
            "/v1/auth/refresh"
          );
          const newToken = res.data.data.access_token;
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          // Resolve any queued requests that were waiting
          pendingRequests.forEach((cb) => cb(newToken));
          pendingRequests = [];
          isRefreshing = false;

          // Retry the original request with the new token
          originalRequest._retried = true;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          // Refresh failed — truly expired, redirect to sign-in
          pendingRequests = [];
          isRefreshing = false;
          window.location.href = "/auth/sign-in";
          return Promise.reject(error);
        }
      } else {
        // Refresh already in progress — queue this request
        return new Promise((resolve) => {
          pendingRequests.push((token: string) => {
            originalRequest._retried = true;
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);
