import { Skeleton } from "~/components/ui/skeleton";

export default function ManagePostCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      {/* badges */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* title + desc */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>

      {/* stats */}
      <div className="flex gap-6 py-2">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-10" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-7 w-14" />
        </div>
      </div>

      {/* button */}
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}
