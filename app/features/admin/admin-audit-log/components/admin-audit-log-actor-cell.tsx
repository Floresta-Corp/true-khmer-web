import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AdminTableCell } from "~/features/admin/components/admin-table";
import { resolveImageURL } from "~/lib/utils";
import type { AdminAuditActor } from "~/types/api-client";

export function formatActorRole(role: string) {
  return role
    .trim()
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function AdminAuditLogActorCell({ admin }: { admin: AdminAuditActor }) {
  const displayName = admin.name || "Unknown user";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <AdminTableCell className="min-w-0">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          {admin.avatarKey ? (
            <AvatarImage
              src={resolveImageURL(admin.avatarKey)}
              alt={displayName}
            />
          ) : null}
          <AvatarFallback className="bg-indigo-900 text-xs font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {displayName}
            {admin.removedAt ? (
              <span className="ml-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                (removed)
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {formatActorRole(admin.role)}
          </p>
        </div>
      </div>
    </AdminTableCell>
  );
}
