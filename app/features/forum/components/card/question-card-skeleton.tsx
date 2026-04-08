import { Skeleton } from "~/components/ui/skeleton";

interface QuestionCardSkeletonProps {
  className?: string;
}

export default function QuestionCardSkeleton({
  className,
}: QuestionCardSkeletonProps) {
  return (
    <div
      className={`w-134 rounded-2xl border border-[#f1f5f9] bg-white p-4 sm:p-6 ${className ?? ""}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2 sm:mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="hidden h-3 w-20 rounded sm:block" />
        </div>
      </div>

      <Skeleton className="mb-2 h-5 w-4/5 rounded" />
      <Skeleton className="mb-4 h-4 w-full rounded" />

      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>

      <div className="my-4 border-t border-[#f9fafb]" />

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="flex min-w-0 flex-col gap-1">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-18 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-18 rounded-lg" />
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-px rounded-none" />
          <Skeleton className="h-6 w-6 rounded-lg" />
          <Skeleton className="h-6 w-6 rounded-lg" />
          <Skeleton className="h-6 w-6 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
