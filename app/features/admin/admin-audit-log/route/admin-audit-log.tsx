import AdminAuditLogPage from "../components/pages/admin-audit-log-page";
import { adminAuditLogLoader } from "../services/admin-audit-log.loader";

export function meta() {
  return [{ title: "Admin Audit Log | True Khmer" }];
}

export const loader = adminAuditLogLoader;

export default function AdminAuditLogRoute() {
  return <AdminAuditLogPage />;
}
