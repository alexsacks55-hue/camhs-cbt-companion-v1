import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { UserRole, AgeBand } from "shared/types/enums";
import { authApi } from "@/services/auth.service";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  age_band: AgeBand | null;
  consent_given: boolean;
  parental_aware: boolean;
  /** CBT programme: "anxiety" | "low_mood" | "behavioural_challenges" | "sleep" | null */
  manual_type: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

interface AuthContextValue extends AuthState {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setTokenAndUser: (token: string, user: AuthUser) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    status: "loading",
  });

  // Silent token refresh on mount (tries to exchange refresh cookie for new access token)
  const hasInitialised = useRef(false);
  useEffect(() => {
    if (hasInitialised.current) return;
    hasInitialised.current = true;

    authApi
      .refresh()
      .then(({ accessToken, user }) => {
        setState({ user, accessToken, status: "authenticated" });
      })
      .catch(() => {
        setState({ user: null, accessToken: null, status: "unauthenticated" });
      });
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const { user, accessToken } = await authApi.login(username, password);
    setState({ user, accessToken, status: "authenticated" });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setState({ user: null, accessToken: null, status: "unauthenticated" });
    }
  }, []);

  const setTokenAndUser = useCallback((accessToken: string, user: AuthUser) => {
    setState({ user, accessToken, status: "authenticated" });
  }, []);

  const value = useMemo(
    () => ({ ...state, signIn, signOut, setTokenAndUser }),
    [state, signIn, signOut, setTokenAndUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
