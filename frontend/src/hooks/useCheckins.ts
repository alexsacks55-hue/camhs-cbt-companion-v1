import { useEffect, useState } from "react";
import { checkinsApi } from "@/services/checkins.service";
import type { DBMoodCheckin } from "shared/types/database";

type Status = "loading" | "success" | "error";

/** Fetches the most recent N check-ins for the logged-in user. */
export function useRecentCheckins(limit = 7) {
  const [data, setData] = useState<DBMoodCheckin[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    checkinsApi
      .list(limit)
      .then((d) => { if (!cancelled) { setData(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [limit]);

  return { data, status };
}

/** Returns whether the user has checked in today and the check-in itself if they have. */
export function useTodayCheckin() {
  const [data, setData] = useState<DBMoodCheckin | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    checkinsApi
      .today()
      .then((d) => { if (!cancelled) { setData(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, []);

  return { data, checkedInToday: data !== null, status };
}
