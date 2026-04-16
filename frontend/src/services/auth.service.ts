import { api } from "./api";
import type { AuthUser } from "@/app/AuthContext";

interface LoginResult {
  user: AuthUser;
  accessToken: string;
}

interface RefreshResult {
  user: AuthUser;
  accessToken: string;
}

interface RegisterPayload {
  username: string;
  password: string;
  role: string;
  age_band?: string;
  consent_given: boolean;
  parental_aware?: boolean;
  manual_type?: string;
}

export const authApi = {
  async login(username: string, password: string): Promise<LoginResult> {
    const res = await api.post<{ data: { user: AuthUser; access_token: string } }>(
      "/v1/auth/login",
      { username, password }
    );
    // Store token for subsequent requests
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.access_token}`;
    return { user: res.data.data.user, accessToken: res.data.data.access_token };
  },

  async register(payload: RegisterPayload): Promise<LoginResult> {
    const res = await api.post<{ data: { user: AuthUser; access_token: string } }>(
      "/v1/auth/register",
      payload
    );
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.access_token}`;
    return { user: res.data.data.user, accessToken: res.data.data.access_token };
  },

  async refresh(): Promise<RefreshResult> {
    // refresh_token is sent automatically via HTTP-only cookie
    const res = await api.post<{ data: { access_token: string } }>("/v1/auth/refresh");
    const newToken = res.data.data.access_token;
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    // Fetch the current user profile
    const meRes = await api.get<{ data: { user: AuthUser } }>("/v1/auth/me");
    return { user: meRes.data.data.user, accessToken: newToken };
  },

  async logout(): Promise<void> {
    await api.post("/v1/auth/logout");
    delete api.defaults.headers.common["Authorization"];
  },

  async changePassword(current_password: string, new_password: string): Promise<void> {
    await api.patch("/v1/auth/password", { current_password, new_password });
  },
};
