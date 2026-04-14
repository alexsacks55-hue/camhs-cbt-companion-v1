/**
 * Frontend type re-exports.
 * Shared database types live in /shared — import them from there.
 * This file holds frontend-only UI state types.
 */

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/** Shape of a role-gated route guard check. */
export interface RouteGuardResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}
