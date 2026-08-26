import { Skeleton } from "~/components/ui/skeleton";

export default function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-xl border bg-white p-4 sm:rounded-2xl sm:p-5 lg:p-6"
        >
          {/* Header */}
          <div className="mb-4 flex items-center gap-2.5">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          {/* Title */}
          <Skeleton className="mb-2 h-5 w-3/4" />
          {/* Body */}
          <Skeleton className="mb-1.5 h-3.5 w-full" />
          <Skeleton className="mb-4 h-3.5 w-5/6" />
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
