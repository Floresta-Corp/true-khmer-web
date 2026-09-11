import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function BlogCategoriesSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-full rounded-lg sm:w-64" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </Card>
  );
}

export function BlogCategoriesPageSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 dark:bg-[#020617]">
      <div className="max-w-full space-y-6 lg:space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-11 w-full" />
        </div>
        <BlogCategoriesSkeleton />
      </div>
    </main>
  );
}

export function BlogPostsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="h-full min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="flex h-full min-w-0 flex-col gap-4 md:flex-row md:items-stretch">
            <Skeleton className="aspect-video w-full shrink-0 self-stretch rounded-xl md:aspect-auto md:h-auto md:min-h-44 md:w-56 xl:w-44 2xl:w-52" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="mb-2.5 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="mt-2 h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <Skeleton className="mt-3 h-4 w-40" />
              <div className="mt-4 flex flex-wrap gap-2">
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
        <div className="space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-11 w-full" />
        </div>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="p-4 sm:p-6">
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
