import { Badge } from "~/components/ui/badge";

export function ReportTypeBadge({ typeName }: { typeName: string | null }) {
  return (
    <Badge
      variant="outline"
      className="rounded-lg border bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
    >
      {typeName ?? "N/A"}
    </Badge>
  );
}
