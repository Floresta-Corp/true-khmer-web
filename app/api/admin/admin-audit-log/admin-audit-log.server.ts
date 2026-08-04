import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  AdminAuditLogEntry,
  AdminAuditLogListResponse,
  AdminAuditLogMembersResponse,
} from "~/types/api-client";

export interface AdminAuditLogParams {
  page?: number;
  limit?: number;
  /** Omit to query every category — the API has no "all" value. */
  category?: AdminAuditLogEntry["category"];
  adminId?: string;
  search?: string;
  from?: string | null;
  to?: string | null;
}

export async function getAdminAuditLog(
  request: Request,
  accessToken: string,
  params: AdminAuditLogParams,
) {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.category) queryParams.set("category", params.category);
  if (params.adminId) queryParams.set("adminId", params.adminId);
  if (params.search) queryParams.set("search", params.search);
  if (params.from) queryParams.set("from", params.from);
  if (params.to) queryParams.set("to", params.to);

  const qs = queryParams.toString();

  const result = await apiRequestWithAccessToken<AdminAuditLogListResponse>(
    request,
    accessToken,
    `/admin/audit-log${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );
  return { data: result };
}

export async function getAdminAuditLogMembers(
  request: Request,
  accessToken: string,
) {
  const result = await apiRequestWithAccessToken<AdminAuditLogMembersResponse>(
    request,
    accessToken,
    "/admin/audit-log/members",
    { method: "GET" },
  );
  return { data: result };
}
