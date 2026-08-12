import { CheckCircle2, HeartHandshake, Users } from "lucide-react";

import ContentImagePreview from "~/features/admin/components/content-image-preview";
import DeadlineBadge from "~/features/admin/components/deadline-badge";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { cn, resolveImageURL } from "~/lib/utils";
import type { AdminVolunteerPostDetailResponse } from "~/types/api-client";

export default function ManageVolunteerDetailHero({
  opportunity,
}: {
  opportunity: AdminVolunteerPostDetailResponse;
}) {
  const cover = opportunity.coverImageKey
    ? resolveImageURL(opportunity.coverImageKey)
    : null;

  const fillRatio =
    opportunity.capacity > 0
      ? Math.min(opportunity.applicationCount / opportunity.capacity, 1)
      : 0;
  const isOversubscribed =
    opportunity.capacity > 0 &&
    opportunity.applicationCount >= opportunity.capacity;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {cover ? (
        <ContentImagePreview
          src={cover}
          title={opportunity.title}
          className="h-48 w-full sm:h-60"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-300 sm:h-60 dark:bg-slate-800 dark:text-slate-600">
          <HeartHandshake size={40} />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {opportunity.category.name}
          </span>
          <DeadlineBadge deadline={opportunity.applicationDeadline} />
          {opportunity.filled && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">
              <CheckCircle2 size={12} />
              Filled
            </span>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Posted {formatMinutesOrHoursAgo(opportunity.createdAt)}
          </span>
        </div>

        <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
          {opportunity.title}
        </h1>

        <p className="mt-3 text-sm leading-6.5 whitespace-pre-line text-slate-600 dark:text-slate-300">
          {opportunity.overview}
        </p>

        {/* Applications against capacity, the headline moderation signal */}
        <div className="mt-5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Users size={14} />
              Applications received
            </span>
            <span className="text-sm font-bold text-slate-900 tabular-nums dark:text-white">
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
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isOversubscribed ? "bg-amber-500" : "bg-emerald-500",
                )}
                style={{ width: `${Math.max(fillRatio * 100, 2)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
