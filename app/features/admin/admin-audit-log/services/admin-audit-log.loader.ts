import { z } from "zod";
import { redirect } from "react-router";
import type { Route } from "project-types/admin/admin-audit-log/route/+types/admin-audit-log";

import {
  getAdminAuditLog,
  getAdminAuditLogMembers,
  type AdminAuditLogParams,
} from "~/api/admin/admin-audit-log/admin-audit-log.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import {
  ADMIN_AUDIT_LOG_ALL_FILTER,
  ADMIN_AUDIT_LOG_CATEGORIES,
  ADMIN_AUDIT_LOG_DEFAULT_LIMIT,
  ADMIN_AUDIT_LOG_MAX_LIMIT,
  ADMIN_AUDIT_LOG_SEARCH_MAX_LENGTH,
} from "../constants";
import type { AdminAuditLogFilters, AdminAuditLogLoaderData } from "../types";
export type { AdminAuditLogFilters, AdminAuditLogLoaderData } from "../types";

const urlSchema = z.object({
  cursor: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .catch(ADMIN_AUDIT_LOG_DEFAULT_LIMIT)
    .transform((value) => Math.min(value, ADMIN_AUDIT_LOG_MAX_LIMIT)),
  category: z
    .enum(ADMIN_AUDIT_LOG_CATEGORIES)
    .catch(ADMIN_AUDIT_LOG_ALL_FILTER),
  adminId: z.string().uuid().optional().catch(undefined),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim().slice(0, ADMIN_AUDIT_LOG_SEARCH_MAX_LENGTH);
      return trimmed || undefined;
    }),
  // Drop malformed ranges instead of forwarding them: the API rejects anything
  // that is not a YYYY-MM-DD date, which would surface as a 400 to the admin.
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
});

export function parseAdminAuditLogFilters(
  request: Request,
): AdminAuditLogFilters {
  const url = new URL(request.url);
  return urlSchema.parse(Object.fromEntries(url.searchParams.entries()));
}

export function toAdminAuditLogParams(
  filters: AdminAuditLogFilters,
): AdminAuditLogParams {
  return {
    cursor: filters.cursor,
    limit: filters.limit,
    category:
      filters.category === ADMIN_AUDIT_LOG_ALL_FILTER
        ? undefined
        : filters.category,
    adminId: filters.adminId,
    search: filters.search,
    from: filters.from,
    to: filters.to,
  };
}

export async function adminAuditLogLoader({ request }: Route.LoaderArgs) {
  const auth = await requireSuperAdmin(
    request,
    "The audit log is restricted to Super Admins.",
  );
  const { accessToken } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const filters = parseAdminAuditLogFilters(request);

  try {
    const [logResult, membersResult] = await Promise.all([
      getAdminAuditLog(request, accessToken, toAdminAuditLogParams(filters)),
      getAdminAuditLogMembers(request, accessToken),
    ]);

    return withAuthData(auth, {
      entries: logResult.data.entries,
      members: membersResult.data.members,
      pagination: logResult.data.pagination,
      filters,
    } satisfies AdminAuditLogLoaderData);
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 401) {
      throw redirect("/tk-admin/login");
    }
    throw err;
  }
}
