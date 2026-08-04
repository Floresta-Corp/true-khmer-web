import { z } from "zod";
import { redirect } from "react-router";
import type { Route } from "project-types/admin/admin-audit-log/route/+types/admin-audit-log";

import {
  getAdminAuditLog,
  getAdminAuditLogMembers,
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
import type { AdminAuditLogFilters } from "../types";
export type { AdminAuditLogFilters, AdminAuditLogLoaderData } from "../types";

const urlSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
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

export async function adminAuditLogLoader({ request }: Route.LoaderArgs) {
  const auth = await requireSuperAdmin(
    request,
    "The audit log is restricted to Super Admins.",
  );
  const { accessToken } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const filters: AdminAuditLogFilters = urlSchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );

  try {
    const [logResult, membersResult] = await Promise.all([
      getAdminAuditLog(request, accessToken, {
        page: filters.page,
        limit: filters.limit,
        category:
          filters.category === ADMIN_AUDIT_LOG_ALL_FILTER
            ? undefined
            : filters.category,
        adminId: filters.adminId,
        search: filters.search,
        from: filters.from,
        to: filters.to,
      }),
      getAdminAuditLogMembers(request, accessToken),
    ]);

    const { entries, total, page, limit, totalPages } = logResult.data;

    return withAuthData(auth, {
      entries,
      members: membersResult.data.members,
      pagination: { total, page, limit, totalPages },
      filters,
    });
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 401) {
      throw redirect("/tk-admin/login");
    }
    throw err;
  }
}
