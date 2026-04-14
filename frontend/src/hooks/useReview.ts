import { useEffect, useState } from "react";
import { reviewApi, type WeeklyReview } from "@/services/review.service";

type Status = "loading" | "success" | "error";

export function useWeeklyReview() {
  const [data, setData] = useState<WeeklyReview | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    reviewApi
      .get()
      .then((d) => { if (!cancelled) { setData(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, []);

  return { data, status };
}
