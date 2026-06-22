import { Skeleton } from "~/components/ui/skeleton";

export default function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 lg:p-6 border"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          {/* Title */}
          <Skeleton className="h-5 w-3/4 mb-2" />
          {/* Body */}
          <Skeleton className="h-3.5 w-full mb-1.5" />
          <Skeleton className="h-3.5 w-5/6 mb-4" />
          {/* Tags */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-14 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
