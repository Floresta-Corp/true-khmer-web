import { Badge } from "~/components/ui/badge";
import type {
  AdminUserManagementTier,
  AdminUserManagementUser,
} from "~/types/api-client";

const statusStyles: Record<AdminUserManagementUser["status"], string> = {
  SIGNUP_REQUIRED:
    "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  ONBOARDING_REQUIRED:
    "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
  ACTIVE:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
  SUSPENDED:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
};

const statusDotColors: Record<AdminUserManagementUser["status"], string> = {
  SIGNUP_REQUIRED: "bg-slate-500",
  ONBOARDING_REQUIRED: "bg-blue-500",
  ACTIVE: "bg-emerald-500",
  SUSPENDED: "bg-amber-500",
};

export function StatusBadge({
  status,
}: {
  status: AdminUserManagementUser["status"] | "active" | "suspended" | "banned";
}) {
  const normalizedStatus =
    status === "active"
      ? "ACTIVE"
      : status === "suspended"
        ? "SUSPENDED"
        : status;
  const style =
    normalizedStatus === "banned"
      ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50"
      : statusStyles[normalizedStatus];
  const dotColor =
    normalizedStatus === "banned"
      ? "bg-rose-500"
      : statusDotColors[normalizedStatus];

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-lg px-2.5 py-1 whitespace-nowrap text-xs font-semibold ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {normalizedStatus
        .toLowerCase()
        .split("_")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ")}
    </Badge>
  );
}

export function UserTierBadge({
  tier,
}: {
  tier: AdminUserManagementTier | null;
}) {
  return (
    <Badge
      variant="outline"
      className="rounded-lg border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400"
    >
      {tier?.name ?? "No tier"}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant="outline"
      className="border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600 capitalize dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
    >
      {role}
    </Badge>
  );
}
