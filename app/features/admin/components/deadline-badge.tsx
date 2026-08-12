import { CalendarClock } from "lucide-react";

import { cn } from "~/lib/utils";

const DAY_MS = 86_400_000;
/** Inside this window a project is flagged as closing, not simply open. */
const CLOSING_SOON_DAYS = 7;

export type DeadlineState = {
  label: string;
  tone: "open" | "closing" | "expired" | "none";
  daysLeft: number | null;
};

/**
 * Launchpad projects and volunteer opportunities carry no moderation status the
 * list endpoints expose, so the deadline is the signal worth surfacing: it tells
 * a moderator whether a listing is still recruiting before they act on it.
 */
export function resolveDeadlineState(deadline: string | null): DeadlineState {
  if (!deadline) {
    return { label: "No deadline", tone: "none", daysLeft: null };
  }

  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return { label: "No deadline", tone: "none", daysLeft: null };
  }

  // Compare whole days so a deadline "today" doesn't read as expired at 09:00.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);

  const daysLeft = Math.round(
    (parsed.getTime() - startOfToday.getTime()) / DAY_MS,
  );

  if (daysLeft < 0) {
    return { label: "Closed", tone: "expired", daysLeft };
  }
  if (daysLeft === 0) {
    return { label: "Closes today", tone: "closing", daysLeft };
  }
  if (daysLeft <= CLOSING_SOON_DAYS) {
    return {
      label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
      tone: "closing",
      daysLeft,
    };
  }

  return { label: "Open", tone: "open", daysLeft };
}

const TONE_STYLES: Record<DeadlineState["tone"], string> = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  closing:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  expired:
    "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
  none: "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
};

export default function DeadlineBadge({
  deadline,
  className,
}: {
  deadline: string | null;
  className?: string;
}) {
  const state = resolveDeadlineState(deadline);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ring-1 ring-inset",
        TONE_STYLES[state.tone],
        className,
      )}
    >
      <CalendarClock size={12} />
      {state.label}
    </span>
  );
}
