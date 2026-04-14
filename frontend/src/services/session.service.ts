import { api } from "./api";

export interface SessionActivity {
  id:            string;
  session_id:    string;
  activity_type: string;
  activity_data: Record<string, unknown>;
  created_at:    string;
}

export interface Session {
  id:              string;
  session_code:    string;
  practitioner_id: string;
  started_at:      string;
  expires_at:      string;
  last_active_at:  string;
  ended_at:        string | null;
  is_active:       boolean;
  activities:      SessionActivity[];
}

export interface MoodSnapshotData {
  mood_rating:    number;
  anxiety_rating: number;
  emotions:       string[];
}

export const sessionApi = {
  async start(): Promise<{ session_code: string; id: string; expires_at: string }> {
    const { data } = await api.post<{ data: { session_code: string; id: string; expires_at: string } }>("/v1/session-companion/start");
    return data.data;
  },

  async get(code: string): Promise<Session> {
    const { data } = await api.get<{ data: Session }>(`/v1/session-companion/${code}`);
    return data.data;
  },

  async addMoodSnapshot(code: string, snapshot: MoodSnapshotData): Promise<SessionActivity> {
    const { data } = await api.post<{ data: SessionActivity }>(
      `/v1/session-companion/${code}/activities`,
      { activity_type: "mood_snapshot", activity_data: snapshot }
    );
    return data.data;
  },

  async end(code: string): Promise<void> {
    await api.post(`/v1/session-companion/${code}/end`);
  },
} as const;
