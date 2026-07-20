import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function BlogCategoriesSkeleton() {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-xl sm:w-48" />
      ))}
    </div>
  );
}

export function BlogPostsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="h-full min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="flex h-full min-w-0 flex-col gap-5 md:flex-row">
            <Skeleton className="aspect-video h-auto w-full shrink-0 rounded-xl md:aspect-auto md:h-52 md:w-56 xl:w-44 2xl:w-52" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="mb-3 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="mt-2 h-6 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <Skeleton className="mt-4 h-4 w-40" />
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogListPageSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 dark:bg-[#020617]">
      <div className="mx-auto w-full max-w-[1400px] space-y-6 lg:space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <Skeleton className="h-10 w-full shrink-0 rounded-lg sm:w-36" />
        </header>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="p-4 sm:p-6">
            <section className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:mb-6 sm:p-5 lg:p-6 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <div className="min-w-0 space-y-2 lg:flex-1">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                </div>
                <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:max-w-lg lg:flex-1">
                  <Skeleton className="h-10 min-w-0 flex-1 rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg sm:w-40" />
                </div>
              </div>

              <BlogCategoriesSkeleton />
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-10 min-w-0 flex-1 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg sm:w-32" />
            </div>
          </div>
        </Card>

        <BlogPostsGridSkeleton />
      </div>
    </main>
  );
}
