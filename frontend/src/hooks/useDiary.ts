import { useCallback, useEffect, useState } from "react";
import { diaryApi, type DiaryEntry, type UpsertDiaryPayload } from "@/services/diary.service";

type Status = "loading" | "success" | "error";

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    diaryApi
      .list(60)
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => { cancelled = true; };
  }, []);

  const save = useCallback(async (payload: UpsertDiaryPayload): Promise<DiaryEntry> => {
    const saved = await diaryApi.upsert(payload);
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.entry_date === saved.entry_date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    return saved;
  }, []);

  return { entries, status, save };
}
