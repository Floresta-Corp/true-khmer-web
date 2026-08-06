import { Badge } from "~/components/ui/badge";
import type { AdminAuditLogEntry } from "~/types/api-client";
import { ADMIN_AUDIT_LOG_CATEGORY_LABELS } from "../constants";

type Category = AdminAuditLogEntry["category"];

export function AdminAuditLogCategoryBadge({
  category,
}: {
  category: Category;
}) {
  return (
    <Badge
      variant="outline"
      className="rounded-lg border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    >
      {ADMIN_AUDIT_LOG_CATEGORY_LABELS[category] ?? category}
    </Badge>
  );
}
