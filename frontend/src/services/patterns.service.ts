import { api } from "./api";

export type PatternType = "low_mood" | "high_anxiety" | "distress_emotions";

export interface PatternResult {
  type:      PatternType;
  triggered: boolean;
  count:     number;
}

export const patternsApi = {
  async get(): Promise<PatternResult[]> {
    const { data } = await api.get<{ data: PatternResult[] }>("/v1/patterns");
    return data.data;
  },
} as const;
