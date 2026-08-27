import { Skeleton } from "~/components/ui/skeleton";

export default function MyEventCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3 p-1">
        <Skeleton className="size-9 rounded-xl" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="ml-auto size-8 rounded-lg" />
      </div>

      <Skeleton className="mt-5 aspect-[2.55/1] w-full rounded-2xl" />

      <div className="mt-5 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3.5 w-32" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-5 w-10" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-5 h-10 w-full rounded-xl" />
    </div>
  );
}
