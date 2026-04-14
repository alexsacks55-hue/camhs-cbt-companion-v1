import { api } from "./api";
import type { DBMoodCheckin } from "shared/types/database";

export interface CreateCheckinPayload {
  mood_rating:       number;
  anxiety_rating:    number;
  emotions:          string[];
  contexts:          string[];
  coping_strategies: string[];
}

export const checkinsApi = {
  async create(payload: CreateCheckinPayload): Promise<DBMoodCheckin> {
    const { data } = await api.post<{ data: DBMoodCheckin }>("/v1/checkins", payload);
    return data.data;
  },

  async list(limit?: number): Promise<DBMoodCheckin[]> {
    const { data } = await api.get<{ data: DBMoodCheckin[] }>("/v1/checkins", {
      params: limit ? { limit } : undefined,
    });
    return data.data;
  },

  /** Returns today's check-in or null if the user hasn't checked in yet today. */
  async today(): Promise<DBMoodCheckin | null> {
    const { data } = await api.get<{ data: DBMoodCheckin | null }>("/v1/checkins/today");
    return data.data;
  },
} as const;
