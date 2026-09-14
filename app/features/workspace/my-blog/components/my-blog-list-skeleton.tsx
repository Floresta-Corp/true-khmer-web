import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";

export function MyBlogCardsSkeleton({ count = 4 }: { count?: number }) {
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

export function MyBlogListSkeleton() {
  return (
    <WorkSpacePageLayout
      title="Khmer Voices"
      subtitle="Write your story and submit it for review"
      action={<Skeleton className="h-12 w-40 rounded-xl" />}
    >
      <div className="mb-6">
        <Skeleton className="h-22 w-full rounded-2xl" />
      </div>
      <MyBlogCardsSkeleton />
    </WorkSpacePageLayout>
  );
}
