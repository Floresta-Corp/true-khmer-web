import { Skeleton } from "~/components/ui/skeleton";

interface EventCardSkeletonProps {
  className?: string;
}

/**
 * Placeholder that mirrors {@link EventListCard} while the events list loads.
 */
export function EventCardSkeleton({ className }: EventCardSkeletonProps) {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white ${className ?? ""}`}
    >
      <div className="relative h-37.5 shrink-0">
        <Skeleton className="absolute inset-0 size-full rounded-none" />
        <Skeleton className="absolute top-2.5 left-2.5 h-5.5 w-20 rounded-full" />
        <Skeleton className="absolute top-2.5 right-2.5 size-7.5 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-4.5">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="size-[13px] shrink-0 rounded-full" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>

        <div className="mb-2 space-y-1.5">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/5 rounded" />
        </div>

        <div className="mb-3.5 flex-1 space-y-1.5">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2.5 border-t border-[#E5E7EB] pt-3.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <Skeleton className="size-[13px] shrink-0 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <Skeleton className="h-3.5 w-10 rounded" />
        </div>
      </div>
    </article>
  );
}
