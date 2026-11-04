import { Skeleton } from "~/components/ui/skeleton";

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
      className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <PublicBlogCardSkeleton key={`blog-card-skeleton-${index}`} />
      ))}
    </div>
  );
}
