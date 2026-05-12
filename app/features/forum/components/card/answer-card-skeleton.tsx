import { Skeleton } from "~/components/ui/skeleton";

interface AnswerCardSkeletonProps {
  className?: string;
}

export default function AnswerCardSkeleton({
  className,
}: AnswerCardSkeletonProps) {
  return (
    <div
      className={`flex w-full flex-col gap-4 rounded-3xl border border-[#f3f4f6] bg-white p-6 shadow-none ${className ?? ""}`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-xl" />
          <Skeleton className="h-7 w-7 rounded-xl" />
          <Skeleton className="h-7 w-7 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2 pb-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-8/12 rounded" />
      </div>

      <div className="border-t border-[#abadaf1a]" />

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>

          <Skeleton className="h-4 w-16 rounded" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>

        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  );
}
