import { api } from "./api";

export interface DiaryActivity {
  name:   string;
  helped: boolean;
}

export interface DiaryEntry {
  id:          string;
  user_id:     string;
  entry_date:  string; // "YYYY-MM-DD"
  mood_rating: number;
  activities:  DiaryActivity[];
  created_at:  string;
  updated_at:  string;
}

export interface UpsertDiaryPayload {
  entry_date:  string;
  mood_rating: number;
  activities:  DiaryActivity[];
}

export const diaryApi = {
  async list(days = 60): Promise<DiaryEntry[]> {
    const { data } = await api.get<{ data: DiaryEntry[] }>(`/v1/diary?days=${days}`);
    return data.data;
  },

  async upsert(payload: UpsertDiaryPayload): Promise<DiaryEntry> {
    const { data } = await api.post<{ data: DiaryEntry }>("/v1/diary", payload);
    return data.data;
  },
} as const;
