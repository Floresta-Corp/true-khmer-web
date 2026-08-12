import { Skeleton } from "~/components/ui/skeleton";

function VolunteerCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-4 w-3/4" />

        <div className="mt-2.5 space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>

          <Skeleton className="mt-1.5 h-1.5 w-full rounded-full" />

          <div className="mt-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function ManageVolunteerCardsSkeleton({
  cards = 6,
}: {
  cards?: number;
}) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading opportunities"
    >
      {Array.from({ length: cards }, (_, index) => (
        <VolunteerCardSkeleton key={index} />
      ))}
    </div>
  );
}
