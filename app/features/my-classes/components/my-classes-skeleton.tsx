import { Skeleton } from "~/components/ui/skeleton";

export function MyClassesSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y divide-[#eef1f5]">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-start gap-4 px-4 py-4 sm:px-5">
          <Skeleton className="h-[54px] w-24 shrink-0 rounded-lg sm:h-[58px] sm:w-[104px]" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-4 w-2/3 max-w-xs" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-1.5 w-full max-w-md rounded-full" />
          </div>
          <Skeleton className="size-9 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
