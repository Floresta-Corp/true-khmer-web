import type {
  AdminAuditLogEntry,
  AdminAuditLogMember,
  AdminAuditLogPagination,
} from "~/types/api-client";

export type { AdminAuditLogPagination };

export type AdminAuditLogCategoryFilter =
  | "all"
  | AdminAuditLogEntry["category"];

export type AdminAuditLogFilters = {
  cursor?: string;
  limit: number;
  category: AdminAuditLogCategoryFilter;
  adminId?: string;
  search?: string;
  from?: string;
  to?: string;
};

export type AdminAuditLogLoaderData = {
  entries: AdminAuditLogEntry[];
  members: AdminAuditLogMember[];
  pagination: AdminAuditLogPagination;
  filters: AdminAuditLogFilters;
};
