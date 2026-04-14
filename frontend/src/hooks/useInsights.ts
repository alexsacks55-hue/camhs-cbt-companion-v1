import { useEffect, useState } from "react";
import { insightsApi, type ServiceInsights } from "@/services/insights.service";

type Status = "loading" | "success" | "error";

export function useInsights() {
  const [data, setData] = useState<ServiceInsights | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    insightsApi
      .get()
      .then((d) => { if (!cancelled) { setData(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, []);

  return { data, status };
}
