import { Skeleton } from "~/components/ui/skeleton";

export function PublicBlogFeaturedSkeleton() {
  return (
    <div
      aria-hidden
      className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-90 md:h-105 lg:h-120 xl:h-130 dark:bg-slate-900"
    >
      <Skeleton className="absolute inset-0 size-full rounded-xl" />

      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-180 px-6 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 xl:max-w-190 xl:px-12 xl:pb-12">
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          <div className="mt-4 space-y-3">
            <Skeleton className="h-9 w-11/12 rounded-lg sm:h-11 md:h-12 lg:h-14" />
            <Skeleton className="h-9 w-7/12 rounded-lg sm:h-11 md:h-12 lg:h-14" />
          </div>

          <div className="mt-5 flex items-center gap-3 sm:mt-6">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicBlogCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e2e8f0]/80 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-950"
    >
      <div className="relative shrink-0 overflow-hidden rounded-t-xl">
        <Skeleton className="h-64 w-full rounded-none" />
        <Skeleton className="absolute top-4 left-4 h-6 w-24 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-3.5 w-20 rounded" />
        </div>

        <div className="mt-2 space-y-2">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-4/5 rounded" />
        </div>

        <div className="mt-3 space-y-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function PublicBlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading blog posts"
      className="mt-8 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <PublicBlogCardSkeleton key={`blog-card-skeleton-${index}`} />
      ))}
    </div>
  );
}
