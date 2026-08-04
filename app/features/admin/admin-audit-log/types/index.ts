import type {
  AdminAuditLogEntry,
  AdminAuditLogMember,
} from "~/types/api-client";

export type AdminAuditLogCategoryFilter =
  | "all"
  | AdminAuditLogEntry["category"];

export type AdminAuditLogFilters = {
  page: number;
  limit: number;
  category: AdminAuditLogCategoryFilter;
  adminId?: string;
  search?: string;
  from?: string;
  to?: string;
};

export type AdminAuditLogPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminAuditLogLoaderData = {
  entries: AdminAuditLogEntry[];
  members: AdminAuditLogMember[];
  pagination: AdminAuditLogPagination;
  filters: AdminAuditLogFilters;
};
