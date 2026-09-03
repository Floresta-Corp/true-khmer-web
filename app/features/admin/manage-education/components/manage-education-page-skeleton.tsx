import { Skeleton } from "~/components/ui/skeleton";

function FiltersSkeleton() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <Skeleton className="h-[52px] w-full rounded-xl sm:w-96" />
      <Skeleton className="h-11 w-full rounded-xl sm:w-60 md:w-72" />
    </div>
  );
}

export function ManageEducationRowSkeleton() {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white p-4 dark:bg-slate-900">
      <Skeleton className="size-16 w-24 shrink-0 rounded-lg" />
      <div className="w-64 min-w-0 shrink-0 space-y-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="min-w-0 flex-1" />
      <Skeleton className="hidden h-14 w-96 lg:block" />
      <div className="min-w-0 flex-1" />
      <Skeleton className="h-9 w-24 shrink-0 rounded-lg" />
    </div>
  );
}

export function ManageEducationRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="Loading courses"
    >
      {Array.from({ length: rows }, (_, index) => (
        <ManageEducationRowSkeleton key={index} />
      ))}
    </div>
  );
}

export function ManageEducationPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-6xl space-y-5">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-80" />
          </div>

          <FiltersSkeleton />

          <ManageEducationRowsSkeleton rows={rows} />
        </div>
      </div>
    </div>
  );
}
