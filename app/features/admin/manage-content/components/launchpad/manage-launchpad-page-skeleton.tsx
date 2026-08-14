import { Skeleton } from "~/components/ui/skeleton";

function ToolbarSkeleton() {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
        {[128, 104, 120, 96, 112].map((width, index) => (
          <Skeleton
            key={index}
            className="h-9 shrink-0 rounded-xl"
            style={{ width }}
          />
        ))}
      </div>

      <div className="grid gap-2 border-t border-slate-100 pt-2 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] dark:border-slate-800">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl lg:w-40" />
        <Skeleton className="h-10 rounded-xl lg:w-40" />
        <Skeleton className="h-10 rounded-xl lg:w-44" />
      </div>
    </div>
  );
}

function LaunchpadCardSkeleton() {
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
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-12 shrink-0" />
        </div>
      </div>
    </article>
  );
}

export function ManageLaunchpadCardsSkeleton({
  cards = 6,
}: {
  cards?: number;
}) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading projects"
    >
      {Array.from({ length: cards }, (_, index) => (
        <LaunchpadCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ManageLaunchpadPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="mt-2 h-4 w-80" />
            </div>
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>

          <ToolbarSkeleton />

          <ManageLaunchpadCardsSkeleton cards={cards} />
        </div>
      </div>
    </div>
  );
}
