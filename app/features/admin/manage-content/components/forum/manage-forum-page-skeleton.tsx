import { Skeleton } from "~/components/ui/skeleton";

function ToolbarSkeleton() {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
        {[112, 96, 128, 88, 104].map((width, index) => (
          <Skeleton
            key={index}
            className="h-9 shrink-0 rounded-xl"
            style={{ width }}
          />
        ))}
      </div>

      <div className="grid gap-2 border-t border-slate-100 pt-2 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] dark:border-slate-800">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl lg:w-40" />
        <Skeleton className="h-10 rounded-xl lg:w-44" />
      </div>
    </div>
  );
}

function QuestionRowSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4 p-4">
        <Skeleton className="hidden size-20 shrink-0 rounded-xl sm:block" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>

          <Skeleton className="mt-2.5 h-4 w-3/4" />

          <div className="mt-2 space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          <div className="mt-2.5 flex items-center gap-1.5">
            <Skeleton className="h-4 w-14 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex min-w-0 items-center gap-2">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Skeleton className="h-6 w-12 rounded-lg" />
              <Skeleton className="h-6 w-12 rounded-lg" />
              <Skeleton className="h-6 w-12 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ManageForumRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading questions">
      {Array.from({ length: rows }, (_, index) => (
        <QuestionRowSkeleton key={index} />
      ))}
    </div>
  );
}

export function ManageForumPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="mt-2 h-4 w-80" />
            </div>
            <Skeleton className="h-7 w-40 rounded-full" />
          </div>

          <ToolbarSkeleton />

          <ManageForumRowsSkeleton rows={rows} />
        </div>
      </div>
    </div>
  );
}
