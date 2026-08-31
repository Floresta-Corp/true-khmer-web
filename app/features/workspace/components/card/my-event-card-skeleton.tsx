import { Skeleton } from "~/components/ui/skeleton";

export default function MyEventCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(26,26,46,0.06),0_8px_24px_rgba(26,26,46,0.04)]">
      <Skeleton className="h-32.5 w-full rounded-none" />

      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="mb-2.5 h-4 w-3/4" />

        <div className="mb-3 flex flex-col gap-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="mt-auto flex justify-between gap-2 border-t border-[#E5E7EB] pt-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-3.5 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
