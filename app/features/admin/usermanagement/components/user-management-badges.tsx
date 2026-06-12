import type { UserStatus, UserTier } from "../types";

const statusStyles: Record<UserStatus, string> = {
  active:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
  suspended:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
  banned:
    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
};

const statusDotColors: Record<UserStatus, string> = {
  active: "bg-emerald-500",
  suspended: "bg-amber-500",
  banned: "bg-rose-500",
};

const roleStyles: Record<"user" | "partner", string> = {
  user: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  partner:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
};

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border capitalize ${statusStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[status]}`} />
      {status}
    </span>
  );
}

export function UserTierBadge({ tier }: { tier: UserTier }) {
  return (
    <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
      Tier {tier}
    </span>
  );
}

export function RoleBadge({ role }: { role: "user" | "partner" }) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border capitalize ${roleStyles[role]}`}
    >
      {role}
    </span>
  );
}
