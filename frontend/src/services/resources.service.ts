import { api } from "./api";
import type { ResourceWithVisibility } from "shared/types/database";

interface ListParams {
  category?: string;
  section?: string;
}

interface AdminListParams extends ListParams {
  status?: string;
}

interface CreateResourcePayload {
  title: string;
  description: string;
  category: string;
  section: string;
  status: string;
  export_type: string;
  journey_step?: string | null;
  content_type: string;
  file_url?: string | null;
  typical_session?: number | null;
  sort_order: number;
  visibility: string[];
}

export const resourcesApi = {
  // User-facing
  async list(params: ListParams = {}): Promise<ResourceWithVisibility[]> {
    const res = await api.get<{ data: ResourceWithVisibility[] }>("/v1/resources", {
      params,
    });
    return res.data.data;
  },

  async get(id: string): Promise<ResourceWithVisibility> {
    const res = await api.get<{ data: ResourceWithVisibility }>(`/v1/resources/${id}`);
    return res.data.data;
  },

  // Admin
  async adminList(params: AdminListParams = {}): Promise<ResourceWithVisibility[]> {
    const res = await api.get<{ data: ResourceWithVisibility[] }>("/v1/resources/admin/all", {
      params,
    });
    return res.data.data;
  },

  async adminGet(id: string): Promise<ResourceWithVisibility> {
    const res = await api.get<{ data: ResourceWithVisibility }>(`/v1/resources/admin/${id}`);
    return res.data.data;
  },

  async create(payload: CreateResourcePayload): Promise<ResourceWithVisibility> {
    const res = await api.post<{ data: ResourceWithVisibility }>("/v1/resources/admin", payload);
    return res.data.data;
  },

  async update(id: string, payload: Partial<CreateResourcePayload>): Promise<ResourceWithVisibility> {
    const res = await api.patch<{ data: ResourceWithVisibility }>(
      `/v1/resources/admin/${id}`,
      payload
    );
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/v1/resources/admin/${id}`);
  },

  async reorder(items: Array<{ id: string; sort_order: number }>): Promise<void> {
    await api.patch("/v1/resources/admin/reorder", { items });
  },

  /** Fire-and-forget analytics event from the frontend. */
  trackView(resourceId: string, category: string): void {
    api
      .post("/v1/resources/events", {
        event_type: "resource_viewed",
        resource_id: resourceId,
        category,
      })
      .catch(() => {
        // Silent — analytics must never break UX
      });
  },

  trackExport(resourceId: string, category: string): void {
    api
      .post("/v1/resources/events", {
        event_type: "resource_exported",
        resource_id: resourceId,
        category,
      })
      .catch(() => {});
  },
};
