import { api } from "./api";
import type { DBActivityCompletion } from "shared/types/database";

export interface RecordActivityPayload {
  resource_id:        string;
  before_rating?:     number | null;
  after_rating?:      number | null;
  reflection_choices?: string[];
}

export const activitiesApi = {
  async record(payload: RecordActivityPayload): Promise<DBActivityCompletion> {
    const { data } = await api.post<{ data: DBActivityCompletion }>("/v1/activities", payload);
    return data.data;
  },
} as const;
