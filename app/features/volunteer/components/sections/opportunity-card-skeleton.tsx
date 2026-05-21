import { motion } from "motion/react";
import { Skeleton } from "~/components/ui/skeleton";

interface OpportunityCardSkeletonProps {
  className?: string;
}

export default function OpportunityCardSkeleton({
  className,
}: OpportunityCardSkeletonProps) {
  return (
    <motion.article
      className={`flex h-full flex-col overflow-hidden rounded-[14px] border border-[#f3f4f6] bg-white p-px shadow-[0px_10px_30px_-15px_rgba(0,0,0,0.05)] ${className ?? ""}`}
    >
      <div className="relative h-39.25 w-full overflow-hidden p-3.5">
        <Skeleton className="absolute inset-0 size-full rounded-[10px]" />
        <Skeleton className="relative ml-auto mt-20 h-5.5 w-20 rounded-xl" />
      </div>

      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <Skeleton className="h-4.25 w-3/4 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-8/12 rounded" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <div className="grid grid-cols-3 gap-1.75">
            <div className="flex items-center gap-[5.25px]">
              <Skeleton className="size-[13.5px] rounded-full" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
            <div className="flex items-center gap-[5.25px]">
              <Skeleton className="size-[13.5px] rounded-full" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
            <div className="flex items-center gap-[5.25px]">
              <Skeleton className="size-[13.5px] rounded-full" />
              <Skeleton className="h-3 w-10 rounded" />
            </div>
          </div>

          <div className="flex flex-col gap-1.75">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16 rounded uppercase" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
            <Skeleton className="h-[5.25px] w-full rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2.5 w-16 rounded uppercase" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>
    </motion.article>
  );
}
