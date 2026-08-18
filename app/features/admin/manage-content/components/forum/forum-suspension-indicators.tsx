import { Badge } from "~/components/ui/badge";

export function SuspendedBadge() {
  return (
    <Badge
      variant="secondary"
      className="pointer-events-none shrink-0 bg-orange-50 px-1.5 py-0 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
    >
      SUSPENDED
    </Badge>
  );
}

export function SuspendedNotice({ reason }: { reason: string | null }) {
  return (
    <p className="mt-2 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
      On moderation hold{reason ? ` — ${reason}` : " — no reason given"}
    </p>
  );
}
