import { Skeleton } from "~/components/ui/skeleton";

export function RegistrationsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      <div className="hidden border-b border-slate-100 bg-slate-50 px-5 py-4 lg:block dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="h-4 w-40" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 px-4 py-4"
        >
          <Skeleton className="h-4 w-40" />
          <Skeleton className="hidden h-4 w-48 sm:block" />
          <Skeleton className="hidden h-4 w-28 md:block" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="hidden h-4 w-24 lg:block" />
        </div>
      ))}
    </div>
  );
}

export function RegistrationsPageSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-350">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
        <Skeleton className="mt-6 mb-8 h-14 w-full rounded-xl" />
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <RegistrationsTableSkeleton />
        </div>
      </div>
    </main>
  );
}

export function RegistrationDetailSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Skeleton className="h-4 w-64" />
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <Skeleton className="size-12 rounded-lg" />
            <Skeleton className="h-6 w-56" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="size-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
