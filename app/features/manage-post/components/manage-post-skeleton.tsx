import { Skeleton } from "~/components/ui/skeleton";

export default function ManagePostCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between px-1 pt-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <Skeleton className="aspect-[2.15/1] w-full rounded-2xl" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="mx-auto h-10 w-12" />
          <Skeleton className="mx-auto h-10 w-12" />
          <Skeleton className="mx-auto h-10 w-16" />
        </div>
        <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
      </div>

      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
