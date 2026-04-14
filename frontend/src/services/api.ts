import axios from "axios";
import { API_BASE_URL } from "@/config/constants";

/**
 * Axios instance for all API calls to the backend.
 * Auth token is injected via request interceptor once auth is built (Phase 3).
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach JWT from memory (not localStorage) ──────────
api.interceptors.request.use((config) => {
  // Token injection added in Phase 3 (auth).
  return config;
});

// ── Response interceptor — handle 401 gracefully ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 from the refresh endpoint — that call is expected to
    // fail when the user has no session, and AuthContext handles it gracefully.
    const isRefreshCall = error.config?.url?.includes("/auth/refresh");
    if (error.response?.status === 401 && !isRefreshCall) {
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);
