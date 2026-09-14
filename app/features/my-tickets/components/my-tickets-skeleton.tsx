import { Skeleton } from "~/components/ui/skeleton";

export default function MyTicketsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex h-full min-h-45 w-full flex-col overflow-hidden rounded-2xl bg-[#f1f1f1] sm:flex-row"
        >
          <div className="w-full shrink-0 self-center p-3 sm:w-44">
            <Skeleton className="aspect-[16/9] h-full w-full rounded-xl bg-[#e5e5e5] sm:aspect-square" />
          </div>

          <div className="relative flex flex-col items-center">
            <div className="absolute top-0 -left-3 h-6 w-6 rounded-full bg-white shadow-inner sm:-top-3 sm:left-1/2 sm:-translate-x-1/2" />
            <div className="mt-3 w-full border-b border-dashed border-[#e5e5e5] sm:mt-0 sm:h-full sm:border-r" />
            <div className="absolute -right-6 h-6 w-6 -translate-x-1/2 rounded-full bg-white shadow-inner sm:-bottom-3 sm:left-1/2" />
          </div>

          <div className="flex grow flex-col justify-between p-5">
            <div className="space-y-2">
              <Skeleton className="h-3 w-40 bg-[#e5e5e5]" />
              <Skeleton className="h-5 w-3/4 bg-[#e5e5e5]" />
              <Skeleton className="h-3.5 w-1/2 bg-[#e5e5e5]" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-7 w-20 rounded-xl bg-[#e5e5e5]" />
              <Skeleton className="h-3 w-28 bg-[#e5e5e5]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
