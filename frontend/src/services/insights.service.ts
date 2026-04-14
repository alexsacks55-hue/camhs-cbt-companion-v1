import { api } from "./api";

export interface UsagePeriod {
  app_uses:       number;
  resource_opens: number;
  checkins:       number;
}

export interface ServiceInsights {
  daily:   UsagePeriod;
  weekly:  UsagePeriod;
  monthly: UsagePeriod;
}

export const insightsApi = {
  async get(): Promise<ServiceInsights> {
    const { data } = await api.get<{ data: ServiceInsights }>("/v1/insights");
    return data.data;
  },
} as const;
