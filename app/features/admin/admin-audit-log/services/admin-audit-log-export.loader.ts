import { redirect, type LoaderFunctionArgs } from "react-router";

import { getAdminAuditLog } from "~/api/admin/admin-audit-log/admin-audit-log.server";
import { CSV_BOM, csvContentDisposition, toCsv } from "~/lib/csv";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthResponse } from "~/lib/server/auth-response.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import type { AdminAuditLogEntry } from "~/types/api-client";
import {
  ADMIN_AUDIT_LOG_CATEGORY_LABELS,
  ADMIN_AUDIT_LOG_EXPORT_MAX_ROWS,
  ADMIN_AUDIT_LOG_MAX_LIMIT,
} from "../constants";
import {
  parseAdminAuditLogFilters,
  toAdminAuditLogParams,
} from "./admin-audit-log.loader";
import { formatDateTime } from "~/lib/time";

const CSV_HEADER = [
  "Timestamp",
  "Admin Name",
  "Admin Email",
  "Admin Role",
  "Category",
  "Action",
  "Summary",
  "IP Address",
];

function toCsvRow(entry: AdminAuditLogEntry) {
  return [
    formatDateTime(entry.createdAt),
    entry.actor.name,
    entry.actor.email,
    entry.actor.role,
    ADMIN_AUDIT_LOG_CATEGORY_LABELS[entry.category] ?? entry.category,
    entry.action,
    entry.summary,
    entry.ipAddress,
  ];
}

export async function adminAuditLogExportLoader({
  request,
}: LoaderFunctionArgs) {
  const auth = await requireSuperAdmin(
    request,
    "The audit log is restricted to Super Admins.",
  );
  const { accessToken } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }
  const filters = parseAdminAuditLogFilters(request);
  const params = toAdminAuditLogParams({
    ...filters,
    cursor: undefined,
    limit: ADMIN_AUDIT_LOG_MAX_LIMIT,
  });

  const entries: AdminAuditLogEntry[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | undefined;
  const maxPages =
    Math.ceil(ADMIN_AUDIT_LOG_EXPORT_MAX_ROWS / ADMIN_AUDIT_LOG_MAX_LIMIT) + 1;

  try {
    for (let page = 0; page < maxPages; page += 1) {
      if (entries.length >= ADMIN_AUDIT_LOG_EXPORT_MAX_ROWS) break;

      const { data } = await getAdminAuditLog(request, accessToken, {
        ...params,
        cursor,
      });

      entries.push(...data.entries);

      const { hasMore, nextCursor } = data.pagination;
      if (!hasMore || !nextCursor || data.entries.length === 0) break;
      if (seenCursors.has(nextCursor)) break;

      seenCursors.add(nextCursor);
      cursor = nextCursor;
    }
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 401) {
      throw redirect("/tk-admin/login");
    }
    throw err;
  }

  const rows = entries.slice(0, ADMIN_AUDIT_LOG_EXPORT_MAX_ROWS);
  const csv = CSV_BOM + toCsv([CSV_HEADER, ...rows.map(toCsvRow)]) + "\r\n";
  const filename = `Admin audit log-${new Date().toISOString().slice(0, 10)}.csv`;

  return withAuthResponse(auth, csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": csvContentDisposition(filename),
      "Cache-Control": "no-store",
    },
  });
}
