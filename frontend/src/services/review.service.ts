import { api } from "./api";

export interface MoodTrendPoint {
  date:    string;
  mood:    number;
  anxiety: number;
}

export interface WeeklyReview {
  period_start:         string;
  period_end:           string;
  checkins_completed:   number;
  activities_completed: number;
  top_emotions:         string[];
  top_strategies:       string[];
  context_areas:        string[];
  mood_trend:           MoodTrendPoint[];
}

export const reviewApi = {
  async get(): Promise<WeeklyReview> {
    const { data } = await api.get<{ data: WeeklyReview }>("/v1/review");
    return data.data;
  },
} as const;
