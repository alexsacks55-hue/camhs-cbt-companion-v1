import { useEffect, useState } from "react";
import { sleepApi } from "@/services/sleep.service";
import type { DBSleepDiaryEntry, DBWindDownRoutine } from "shared/types/database";

type Status = "loading" | "success" | "error";

// ── Sleep diary ────────────────────────────────────────────────────────────────

export function useSleepDiary(days = 60) {
  const [entries, setEntries] = useState<DBSleepDiaryEntry[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    sleepApi
      .listDiary(days)
      .then((d) => { if (!cancelled) { setEntries(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [days]);

  async function save(payload: Parameters<typeof sleepApi.upsertDiary>[0]) {
    const entry = await sleepApi.upsertDiary(payload);
    setEntries((prev) => {
      const others = prev.filter((e) => e.entry_date !== entry.entry_date);
      return [entry, ...others].sort((a, b) => b.entry_date.localeCompare(a.entry_date));
    });
    return entry;
  }

  return { entries, status, save };
}

// ── Wind-down routine ──────────────────────────────────────────────────────────

export function useWindDown() {
  const [routine, setRoutine] = useState<DBWindDownRoutine | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    sleepApi
      .getWindDown()
      .then((d) => { if (!cancelled) { setRoutine(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, []);

  async function save(payload: Parameters<typeof sleepApi.upsertWindDown>[0]) {
    const updated = await sleepApi.upsertWindDown(payload);
    setRoutine(updated);
    return updated;
  }

  return { routine, status, save };
}
