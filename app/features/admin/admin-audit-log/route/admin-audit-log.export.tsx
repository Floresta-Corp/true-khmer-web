import { adminAuditLogExportLoader } from "../services/admin-audit-log-export.loader";

// Resource route: no component, the loader returns the CSV file directly.
export const loader = adminAuditLogExportLoader;
