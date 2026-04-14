/**
 * API request and response contract types.
 * Both frontend and backend import these for consistent shape validation.
 */

import type { PublicUser } from "./database";
import type { UserRole, AgeBand } from "./enums";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface SignUpRequest {
  username: string;
  password: string;
  role: UserRole;
  age_band?: AgeBand;
  consent_given: boolean;
  parental_aware?: boolean;
  manual_type?: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: PublicUser;
  access_token: string;
}

export interface RefreshResponse {
  access_token: string;
}

// ─── Generic API envelope ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── Session Companion ────────────────────────────────────────────────────────

export interface StartSessionResponse {
  session_code: string;
  expires_at: string;
}

export interface JoinSessionRequest {
  session_code: string;
}

export interface JoinSessionResponse {
  session_id: string;
  session_code: string;
  expires_at: string;
}

// ─── Service Insights (aggregated, anonymous) ─────────────────────────────────

export interface ServiceInsightsSummary {
  period: { from: string; to: string };
  top_resources: Array<{ resource_id: string; title: string; view_count: number }>;
  top_categories: Array<{ category: string; view_count: number }>;
  checkin_frequency: Array<{ date: string; count: number }>;
  activity_completions: number;
  session_companion_starts: number;
}
