import { Skeleton } from "~/components/ui/skeleton";

export function UserManagementDetailSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-3 w-52 rounded" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col items-center">
                <Skeleton className="size-24 rounded-2xl" />
                <Skeleton className="mt-5 h-6 w-40 rounded" />
                <Skeleton className="mt-3 h-4 w-52 rounded" />
                <Skeleton className="mt-2 h-4 w-32 rounded" />
                <Skeleton className="mt-5 h-7 w-20 rounded-lg" />
              </div>
              <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-full rounded" />
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="h-4 w-36 rounded" />
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="mt-4 h-9 w-28 rounded" />
                  <Skeleton className="mt-3 h-3 w-32 rounded" />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="h-5 w-36 rounded" />
              <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 py-4">
                    <Skeleton className="size-9 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48 rounded" />
                      <Skeleton className="h-3 w-28 rounded" />
                    </div>
                    <Skeleton className="h-7 w-16 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
