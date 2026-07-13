import { Skeleton } from "~/components/ui/skeleton";

export function PartnerCardSkeleton() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-blue-600/20 shadow-lg">
      <Skeleton className="h-48 w-full rounded-none" />
    </div>
  );
}
