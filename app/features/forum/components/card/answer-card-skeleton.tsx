import { Skeleton } from "~/components/ui/skeleton";

interface AnswerCardSkeletonProps {
  className?: string;
}

export default function AnswerCardSkeleton({
  className,
}: AnswerCardSkeletonProps) {
  return (
    <div
      className={`w-134 rounded-3xl border border-[#f3f4f6] bg-white p-6 shadow-none ${className ?? ""}`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-14 rounded" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-11/12 rounded" />
        <Skeleton className="h-3 w-8/12 rounded" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <Skeleton className="h-3 w-32 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-[26.25px] w-[26.25px] rounded-xl" />
          <Skeleton className="h-[26.25px] w-[26.25px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
