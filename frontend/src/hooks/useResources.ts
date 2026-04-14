import { useEffect, useState } from "react";
import { resourcesApi } from "@/services/resources.service";
import type { ResourceWithVisibility } from "shared/types/database";

type Status = "loading" | "success" | "error";

export function useResourceList(params: { category?: string; section?: string } = {}) {
  const [data, setData] = useState<ResourceWithVisibility[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    resourcesApi
      .list(params)
      .then((d) => { if (!cancelled) { setData(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category, params.section]);

  return { data, status };
}

export function useResource(id: string) {
  const [data, setData] = useState<ResourceWithVisibility | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    resourcesApi
      .get(id)
      .then((d) => { if (!cancelled) { setData(d); setStatus("success"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [id]);

  return { data, status };
}

export function useAdminResourceList(params: {
  category?: string;
  section?: string;
  status?: string;
} = {}) {
  const [data, setData] = useState<ResourceWithVisibility[]>([]);
  const [fetchStatus, setFetchStatus] = useState<Status>("loading");

  function reload() {
    setFetchStatus("loading");
    resourcesApi
      .adminList(params)
      .then((d) => { setData(d); setFetchStatus("success"); })
      .catch(() => setFetchStatus("error"));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category, params.section, params.status]);

  return { data, status: fetchStatus, reload };
}
