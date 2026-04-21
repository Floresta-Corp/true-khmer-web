import { Skeleton } from "~/components/ui/skeleton";

interface QuestionCardSkeletonProps {
  className?: string;
}

export default function QuestionCardSkeleton({
  className,
}: QuestionCardSkeletonProps) {
  return (
    <article
      className={`w-full rounded-2xl bg-white p-6 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)] ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 text-sm">
          <Skeleton className="size-6 rounded-full" />
          <div className="min-w-0">
            <Skeleton className="mb-1 h-4 w-32 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>

      <Skeleton className="mt-3 h-6 w-3/4 rounded" />
      <Skeleton className="mt-3 h-4 w-full rounded" />

      <div className="mt-3 flex flex-wrap gap-2">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-4 w-14 rounded" />
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>

      <div className="mt-4 flex items-center gap-5">
        <Skeleton className="h-7 w-24 rounded-xl" />
        <Skeleton className="h-5 w-28 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
      </div>
    </article>
  );
}
