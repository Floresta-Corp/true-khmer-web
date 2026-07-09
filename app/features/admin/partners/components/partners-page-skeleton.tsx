import { Skeleton } from "~/components/ui/skeleton";
import { PartnersTableSkeleton } from "./partners-table";

export function PartnersPageSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-350 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
            <Skeleton className="h-10 w-72 rounded-lg" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
          <PartnersTableSkeleton />
        </div>
      </div>
    </main>
  );
}

export function PartnerDetailSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
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
            <Skeleton className="size-20 rounded-lg" />
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
