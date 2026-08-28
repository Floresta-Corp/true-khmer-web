import { Skeleton } from "~/components/ui/skeleton";

export function CourseListingSkeleton() {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white p-4">
      <Skeleton className="size-16 w-24 shrink-0 rounded-lg" />
      <div className="w-64 min-w-0 shrink-0 space-y-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="min-w-0 flex-1" />
      <Skeleton className="hidden h-14 w-96 lg:block" />
      <div className="min-w-0 flex-1" />
      <Skeleton className="size-9 shrink-0 rounded-lg" />
    </div>
  );
}
