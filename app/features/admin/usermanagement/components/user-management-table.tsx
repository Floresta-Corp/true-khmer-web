import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import type { AdminUserManagementUser } from "~/types/api-client";

import { StatusBadge, UserTierBadge } from "./user-management-badges";

export function UserTable({ users }: { users: AdminUserManagementUser[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-180 table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/30">
            <HeaderCell label="User" className="w-[24%]" />
            <HeaderCell label="Tier" align="center" className="w-[16%]" />
            <HeaderCell label="Points" align="center" className="w-[14%]" />
            <HeaderCell label="Status" align="center" className="w-[20%]" />
            <HeaderCell
              label="Last active"
              align="center"
              className="w-[18%]"
            />
            <HeaderCell label="Actions" align="center" className="w-[8%]" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
            >
              <UserCell user={user} />
              <td className="px-5 py-4 text-center">
                <UserTierBadge tier={user.tier} />
              </td>
              <td className="px-5 py-4 text-center text-sm font-semibold text-slate-800 tabular-nums dark:text-slate-100">
                {user.totalPoints.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-center">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-5 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                {formatLastActive(user.lastActive)}
              </td>
              <td className="px-5 py-4 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-slate-400"
                >
                  <Link
                    to={`/tk-admin/user/${user.id}`}
                    aria-label={`View ${user.displayName || user.name}`}
                  >
                    <MoreHorizontal />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserManagementTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto" aria-label="Loading users">
      <table className="w-full min-w-180 table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/30">
            <HeaderCell label="User" className="w-[24%]" />
            <HeaderCell label="Tier" align="center" className="w-[16%]" />
            <HeaderCell label="Points" align="center" className="w-[14%]" />
            <HeaderCell label="Status" align="center" className="w-[20%]" />
            <HeaderCell
              label="Last active"
              align="center"
              className="w-[18%]"
            />
            <HeaderCell label="Actions" align="center" className="w-[8%]" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: rows }).map((_, index) => (
            <tr className="h-18" key={index}>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 max-w-full rounded" />
                    <Skeleton className="h-3 w-40 max-w-full rounded" />
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-center">
                <Skeleton className="mx-auto h-6 w-20 rounded-lg" />
              </td>
              <td className="px-5 py-4 text-center">
                <Skeleton className="mx-auto h-4 w-10 rounded" />
              </td>
              <td className="px-5 py-4 text-center">
                <Skeleton className="mx-auto h-7 w-24 rounded-lg" />
              </td>
              <td className="px-5 py-4 text-center">
                <Skeleton className="mx-auto h-4 w-20 rounded" />
              </td>
              <td className="px-5 py-4 text-center">
                <Skeleton className="mx-auto size-8 rounded-lg" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HeaderCell({
  label,
  align = "left",
  className,
}: {
  label: string;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400 ${
        align === "right"
          ? "text-right"
          : align === "center"
            ? "text-center"
            : "text-left"
      } ${className ?? ""}`}
    >
      {label}
    </th>
  );
}

function UserCell({ user }: { user: AdminUserManagementUser }) {
  const displayName = user.displayName || user.name;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <td className="min-w-0 px-5 py-4">
      <Link
        to={`/tk-admin/user/${user.id}`}
        className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        <Avatar size="lg">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={displayName} />
          ) : null}
          <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {displayName}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
        </div>
      </Link>
    </td>
  );
}

function formatLastActive(lastActive: string | null) {
  if (!lastActive) return "Never";

  const date = new Date(lastActive);
  return Number.isNaN(date.getTime()) ? lastActive : format(date, "d MMM yyyy");
}
