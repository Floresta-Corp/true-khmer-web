import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";

interface LaunchpadProjectCardSkeletonProps {
  className?: string;
}

export default function LaunchpadProjectCardSkeleton({
  className,
}: LaunchpadProjectCardSkeletonProps) {
  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        <Skeleton className="size-[31.5px] rounded-full" />
        <Skeleton className="size-[31.5px] rounded-full" />
      </div>
      <Card
        className={`flex h-95 flex-col p-5 rounded-2xl bg-white ${className ?? ""}`}
      >
        <div className="flex items-center justify-between pb-3">
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="flex items-center gap-3.5 pb-6">
          <Skeleton className="size-12.25 rounded-md border" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-8/12 rounded" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Separator className="my-6" />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.75">
            <Skeleton className="size-3.5 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </Card>
    </div>
  );
}
