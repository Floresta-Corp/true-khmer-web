import { Clock, Eye, HeartHandshake, MapPin } from "lucide-react";
import { Link } from "react-router";

import { formatMinutesOrHoursAgo } from "~/lib/time";
import { cn, formatCompactNumber, resolveImageURL } from "~/lib/utils";
import DeadlineBadge from "~/features/admin/components/deadline-badge";
import type { AdminVolunteerPostListItemResponse } from "~/types/api-client";

type Opportunity = AdminVolunteerPostListItemResponse;

const STATUS_STYLES: Record<Opportunity["status"], string> = {
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

interface ManageVolunteerCardProps {
  opportunity: Opportunity;
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

export default function ManageVolunteerCard({
  opportunity,
  actions,
}: ManageVolunteerCardProps) {
  const cover = opportunity.coverImageKey
    ? resolveImageURL(opportunity.coverImageKey)
    : null;
  const detailPath = `/tk-admin/manage-volunteer/${opportunity.id}`;

  const fillRatio =
    opportunity.capacity > 0
      ? Math.min(opportunity.applicationCount / opportunity.capacity, 1)
      : 0;
  const isOversubscribed =
    opportunity.capacity > 0 &&
    opportunity.applicationCount >= opportunity.capacity;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_28px_-14px_rgb(15_23_42/0.25)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600">
            <HeartHandshake size={32} />
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-slate-950/45 to-transparent"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="max-w-40 truncate rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">
              {opportunity.category.name}
            </span>

            {opportunity.status !== "LIVE" && (
              <span
                className={cn(
                  "shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold ring-1 backdrop-blur ring-inset",
                  STATUS_STYLES[opportunity.status],
                )}
              >
                {opportunity.status.replace("_", " ")}
              </span>
            )}
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
            {actions}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <DeadlineBadge
            deadline={opportunity.applicationDeadline}
            className="bg-white/90 backdrop-blur dark:bg-slate-900/90"
          />
          {opportunity.filled && (
            <span className="inline-flex items-center rounded-lg bg-slate-900/85 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
              Filled
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3>
          <Link
            to={detailPath}
            className="line-clamp-1 text-[15px] font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
          >
            <span className="absolute inset-0 z-0" aria-hidden="true" />
            {opportunity.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-5.5 text-slate-500 dark:text-slate-400">
          {opportunity.overview}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <Meta icon={<MapPin size={13} />}>{opportunity.location.name}</Meta>
          {opportunity.commitmentLabel && (
            <Meta icon={<Clock size={13} />}>
              {opportunity.commitmentLabel}
            </Meta>
          )}
          <Meta icon={<Eye size={13} />}>
            {`${formatCompactNumber(opportunity.totalView)} views`}
          </Meta>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-slate-400 dark:text-slate-500">
              Applications
            </span>
            <span className="font-semibold text-slate-700 tabular-nums dark:text-slate-200">
              {opportunity.applicationCount}
              {opportunity.capacity > 0 && (
                <span className="font-medium text-slate-400 dark:text-slate-500">
                  {" / "}
                  {opportunity.capacity}
                </span>
              )}
            </span>
          </div>

          {opportunity.capacity > 0 && (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isOversubscribed ? "bg-amber-500" : "bg-emerald-500",
                )}
                style={{ width: `${Math.max(fillRatio * 100, 2)}%` }}
              />
            </div>
          )}

          <p className="mt-2 border-t border-slate-100 pt-2.5 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            Posted {formatMinutesOrHoursAgo(opportunity.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
