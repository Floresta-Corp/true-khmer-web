import { Skeleton } from "~/components/ui/skeleton";

function AnswerCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-10 rounded-lg" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
      </div>
    </article>
  );
}

export function ManageForumAnswersSkeleton({
  answers = 3,
}: {
  answers?: number;
}) {
  return (
    <div
      className="space-y-3 pb-6"
      aria-busy="true"
      aria-label="Loading answers"
    >
      {Array.from({ length: answers }, (_, index) => (
        <AnswerCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ManageForumDetailSkeleton({
  answers = 3,
}: {
  answers?: number;
}) {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-5 w-52" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-16" />
              </div>

              <Skeleton className="mt-3 h-7 w-4/5" />

              <div className="mt-4 space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-10/12" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-14 rounded-md" />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </article>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-10 w-44 rounded-lg" />
          </div>

          <ManageForumAnswersSkeleton answers={answers} />
        </div>
      </div>
    </div>
  );
}
