import type { Moderator } from "~/types/api-client";

type ModeratorStatus = Moderator["status"];

const styles: Record<ModeratorStatus, string> = {
  PENDING:
    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
  ACTIVE:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
};

const ModeratorStatusBadge = ({ status }: { status: ModeratorStatus }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-bold tracking-widest uppercase ${styles[status]}`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`}
    />
    {status}
  </span>
);

export { ModeratorStatusBadge };
