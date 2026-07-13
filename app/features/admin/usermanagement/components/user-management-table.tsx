import { format } from "date-fns";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import {
  AdminHeaderCell,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderRow,
  AdminTableRow,
} from "~/features/admin/components/admin-table";
import { resolveImageURL } from "~/lib/utils";
import type { AdminUserManagementUser } from "~/types/api-client";

import { UserManagementActionsMenu } from "./user-management-actions-menu";
import { StatusBadge, UserTierBadge } from "./user-management-badges";

export function UserTable({ users }: { users: AdminUserManagementUser[] }) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <AdminTable className="min-w-180 table-fixed">
        <AdminTableHead>
          <AdminTableHeaderRow>
            <AdminHeaderCell label="User" className="w-[24%]" />
            <AdminHeaderCell label="Tier" align="center" className="w-[16%]" />
            <AdminHeaderCell
              label="Points"
              align="center"
              className="w-[14%]"
            />
            <AdminHeaderCell
              label="Status"
              align="center"
              className="w-[20%]"
            />
            <AdminHeaderCell
              label="Last active"
              align="center"
              className="w-[18%]"
            />
            <AdminHeaderCell
              label="Actions"
              align="center"
              className="w-[8%]"
            />
          </AdminTableHeaderRow>
        </AdminTableHead>
        <AdminTableBody>
          {users.map((user) => (
            <AdminTableRow key={user.id}>
              <UserCell user={user} />
              <AdminTableCell align="center">
                <UserTierBadge tier={user.tier} />
              </AdminTableCell>
              <AdminTableCell
                className="text-sm font-semibold text-slate-800 tabular-nums dark:text-slate-100"
                align="center"
              >
                {user.totalPoints.toLocaleString()}
              </AdminTableCell>
              <AdminTableCell align="center">
                <StatusBadge status={user.status} />
              </AdminTableCell>
              <AdminTableCell
                className="text-sm text-slate-500 dark:text-slate-400"
                align="center"
              >
                {formatLastActive(user.lastActive)}
              </AdminTableCell>
              <AdminTableCell align="center">
                <UserManagementActionsMenu user={user} />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

export function UserManagementTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="min-h-0 flex-1 overflow-auto" aria-label="Loading users">
      <AdminTable className="min-w-180 table-fixed">
        <AdminTableHead>
          <AdminTableHeaderRow>
            <AdminHeaderCell label="User" className="w-[24%]" />
            <AdminHeaderCell label="Tier" align="center" className="w-[16%]" />
            <AdminHeaderCell
              label="Points"
              align="center"
              className="w-[14%]"
            />
            <AdminHeaderCell
              label="Status"
              align="center"
              className="w-[20%]"
            />
            <AdminHeaderCell
              label="Last active"
              align="center"
              className="w-[18%]"
            />
            <AdminHeaderCell
              label="Actions"
              align="center"
              className="w-[8%]"
            />
          </AdminTableHeaderRow>
        </AdminTableHead>
        <AdminTableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <AdminTableRow className="h-18" key={index}>
              <AdminTableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 max-w-full rounded" />
                    <Skeleton className="h-3 w-40 max-w-full rounded" />
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell align="center">
                <Skeleton className="mx-auto h-6 w-20 rounded-lg" />
              </AdminTableCell>
              <AdminTableCell align="center">
                <Skeleton className="mx-auto h-4 w-10 rounded" />
              </AdminTableCell>
              <AdminTableCell align="center">
                <Skeleton className="mx-auto h-7 w-24 rounded-lg" />
              </AdminTableCell>
              <AdminTableCell align="center">
                <Skeleton className="mx-auto h-4 w-20 rounded" />
              </AdminTableCell>
              <AdminTableCell align="center">
                <Skeleton className="mx-auto size-8 rounded-lg" />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
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
    <AdminTableCell className="min-w-0">
      <Link
        to={`/tk-admin/user/${user.id}`}
        className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        <Avatar size="lg">
          {user.avatarKey ? (
            <AvatarImage
              src={resolveImageURL(user.avatarKey)}
              alt={displayName}
            />
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
    </AdminTableCell>
  );
}

function formatLastActive(lastActive: string | null) {
  if (!lastActive) return "Never";

  const date = new Date(lastActive);
  return Number.isNaN(date.getTime()) ? lastActive : format(date, "d MMM yyyy");
}
