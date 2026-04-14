import { useEffect, useState } from "react";
import { patternsApi, type PatternResult } from "@/services/patterns.service";

type Status = "loading" | "success" | "error";

export function usePatterns() {
  const [data, setData] = useState<PatternResult[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    patternsApi
      .get()
      .then((d) => { if (!cancelled) { setData(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, []);

  return { data, status, triggered: data.filter((p) => p.triggered) };
}
