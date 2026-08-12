import { Eye, MapPin, Rocket, Users } from "lucide-react";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { cn, formatCompactNumber, resolveImageURL } from "~/lib/utils";
import DeadlineBadge from "~/features/admin/components/deadline-badge";
import type { AdminLaunchpadPostListItemResponse } from "~/types/api-client";

const STATUS_STYLES: Record<
  AdminLaunchpadPostListItemResponse["status"],
  string
> = {
  DRAFT:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  LIVE: "",
  IN_PROGRESS:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  COMPLETED:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  CANCELED:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  SUSPENDED:
    "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20",
  DELETED:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
};

interface ManageLaunchpadCardProps {
  project: AdminLaunchpadPostListItemResponse;
  actions?: React.ReactNode;
}

function Meta({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-slate-500 dark:text-slate-400">
      <span className="shrink-0 text-slate-400 dark:text-slate-500">
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </span>
  );
}

export default function ManageLaunchpadCard({
  project,
  actions,
}: ManageLaunchpadCardProps) {
  const cover = project.coverKey ? resolveImageURL(project.coverKey) : null;
  const detailPath = `/tk-admin/manage-launchpad/${project.id}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_28px_-14px_rgb(15_23_42/0.25)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600">
            <Rocket size={32} />
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-slate-950/45 to-transparent"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="max-w-40 truncate rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">
              {project.category?.name ?? "Uncategorized"}
            </span>

            {project.status !== "LIVE" && (
              <span
                className={cn(
                  "shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold ring-1 backdrop-blur ring-inset",
                  STATUS_STYLES[project.status],
                )}
              >
                {project.status.replace("_", " ")}
              </span>
            )}
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
            {actions}
          </div>
        </div>

        <div className="absolute bottom-3 left-3">
          <DeadlineBadge
            deadline={project.deadline}
            className="bg-white/90 backdrop-blur dark:bg-slate-900/90"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3>
          <Link
            to={detailPath}
            className="line-clamp-1 text-[15px] font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
          >
            {/* Stretched hit area: the whole card opens the project */}
            <span className="absolute inset-0 z-0" aria-hidden="true" />
            {project.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-5.5 text-slate-500 dark:text-slate-400">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <Meta icon={<MapPin size={13} />}>
            {project.city?.name ?? "No city"}
          </Meta>
          <Meta icon={<Users size={13} />}>
            {`${project.totalRoles} ${project.totalRoles === 1 ? "role" : "roles"}`}
          </Meta>
          <Meta icon={<Eye size={13} />}>
            {`${formatCompactNumber(project.totalView)} views`}
          </Meta>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <Avatar className="size-6 shrink-0 border border-slate-100 dark:border-slate-800">
            <AvatarImage
              src={resolveImageURL(project.createdBy.avatarKey)}
              alt={project.createdBy.name}
              className="object-cover"
            />
            <AvatarFallback className="text-[10px]">
              {project.createdBy.name.trim().charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate font-semibold text-slate-700 dark:text-slate-200">
            {project.createdBy.name}
          </span>
          <span className="shrink-0 whitespace-nowrap text-slate-400 dark:text-slate-500">
            {formatMinutesOrHoursAgo(project.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
