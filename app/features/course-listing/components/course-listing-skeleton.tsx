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

export function CourseListingCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <Skeleton className="aspect-[2/1] w-full rounded-none" />
      <div className="flex flex-col p-4">
        <Skeleton className="mb-2 h-5 w-full" />
        <Skeleton className="mb-2.5 h-5 w-2/3" />
        <Skeleton className="mb-3.5 h-4 w-40" />
        <div className="grid grid-cols-3 gap-3 border-t border-[#E5E7EB] pt-3.5">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    </div>
  );
}
