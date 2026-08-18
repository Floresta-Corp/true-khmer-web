import type { AdminAuditLogEntry } from "~/types/api-client";
import type { AdminAuditLogCategoryFilter } from "./types";

/** Sentinel used by both the toolbar selects and the loader to mean "no filter". */
export const ADMIN_AUDIT_LOG_ALL_FILTER = "all";

/** Category values the API returns, in the order the toolbar lists them. */
export const ADMIN_AUDIT_LOG_CATEGORY_VALUES = [
  "TEAM",
  "CONTENT",
  "USERS",
  "SYSTEM",
] as const satisfies readonly AdminAuditLogEntry["category"][];

/** Single source of truth for category copy, shared by the badge and the toolbar. */
export const ADMIN_AUDIT_LOG_CATEGORY_LABELS: Record<
  AdminAuditLogEntry["category"],
  string
> = {
  TEAM: "Team",
  CONTENT: "Content",
  USERS: "Users",
  SYSTEM: "System",
};

/** Accepted `category` query values, used to build the loader's zod enum. */
export const ADMIN_AUDIT_LOG_CATEGORIES = [
  ADMIN_AUDIT_LOG_ALL_FILTER,
  ...ADMIN_AUDIT_LOG_CATEGORY_VALUES,
] as const satisfies readonly AdminAuditLogCategoryFilter[];

export const ADMIN_AUDIT_LOG_DEFAULT_LIMIT = 20;
export const ADMIN_AUDIT_LOG_MAX_LIMIT = 100;

/**
 * Upper bound on rows in a CSV export. The API is cursor-paginated, so an
 * unfiltered export would otherwise page forever on a large log.
 */
export const ADMIN_AUDIT_LOG_EXPORT_MAX_ROWS = 5000;

/** Server-side cap on the audit-log `search` query param (see the OpenAPI contract). */
export const ADMIN_AUDIT_LOG_SEARCH_MAX_LENGTH = 100;
