import { api } from "./api";
import type { DBSleepDiaryEntry, DBWindDownRoutine } from "shared/types/database";

export interface UpsertSleepDiaryPayload {
  entry_date: string;
  bedtime: string;
  wake_time: string;
  sleep_quality: number;
}

export interface UpsertWindDownPayload {
  target_bedtime: string | null;
  activities: string[];
}

export const sleepApi = {
  // ── Sleep diary ──────────────────────────────────────────────────────────────
  async listDiary(days = 60): Promise<DBSleepDiaryEntry[]> {
    const res = await api.get<{ data: DBSleepDiaryEntry[] }>("/v1/sleep/diary", {
      params: { days },
    });
    return res.data.data;
  },

  async upsertDiary(payload: UpsertSleepDiaryPayload): Promise<DBSleepDiaryEntry> {
    const res = await api.post<{ data: DBSleepDiaryEntry }>("/v1/sleep/diary", payload);
    return res.data.data;
  },

  // ── Wind-down routine ────────────────────────────────────────────────────────
  async getWindDown(): Promise<DBWindDownRoutine | null> {
    const res = await api.get<{ data: DBWindDownRoutine | null }>("/v1/sleep/wind-down");
    return res.data.data;
  },

  async upsertWindDown(payload: UpsertWindDownPayload): Promise<DBWindDownRoutine> {
    const res = await api.post<{ data: DBWindDownRoutine }>("/v1/sleep/wind-down", payload);
    return res.data.data;
  },
};
