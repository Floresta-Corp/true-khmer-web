import { Skeleton } from "~/components/ui/skeleton";

export type EventDetailTab = "attend" | "details" | "programs" | "exhibitors";

const TABS_WITH_SIDEBAR: ReadonlySet<EventDetailTab> = new Set([
  "attend",
  "details",
]);

function PanelHeading({ subWidth = "w-72" }: { subWidth?: string }) {
  return (
    <>
      <Skeleton className="mb-2.5 h-7 w-56" />
      <Skeleton className={`mb-6 h-4 ${subWidth}`} />
    </>
  );
}

function AttendSkeleton() {
  return (
    <div>
      <PanelHeading />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-[14px] border border-[#E5E7EB] p-4 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,auto)] sm:gap-5 sm:p-5"
          >
            <Skeleton className="size-16 shrink-0 rounded-[10px] sm:size-19" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:gap-2.5">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-7 w-48" />
      <div className="mb-8 space-y-3">
        {["w-full", "w-full", "w-11/12", "w-3/4"].map((width, index) => (
          <Skeleton key={index} className={`h-4 ${width}`} />
        ))}
      </div>
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="aspect-16/10 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function ProgramsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-6 h-7 w-40" />
      <div className="mb-7 flex gap-2 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-32 shrink-0 rounded-lg" />
        ))}
      </div>
      <div className="divide-y divide-[#E5E7EB]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid gap-4 py-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-7"
          >
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2.5">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExhibitorsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-2.5 h-7 w-44" />
      <Skeleton className="h-4 w-80" />
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 flex-1 rounded-[10px]" />
        <Skeleton className="h-11 w-full rounded-[10px] sm:w-48" />
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[14px] border border-[#E5E7EB] p-5"
          >
            <Skeleton className="mb-4 size-14 rounded-[10px]" />
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-3 h-4 w-1/2" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[14px] border border-[#E5E7EB] p-5">
        <Skeleton className="mb-5 h-6 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="size-10 shrink-0 rounded-[10px]" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[14px] border border-[#E5E7EB] p-5">
        <Skeleton className="mb-4 h-6 w-28" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

const TAB_BODY: Record<EventDetailTab, () => React.ReactElement> = {
  attend: AttendSkeleton,
  details: DetailsSkeleton,
  programs: ProgramsSkeleton,
  exhibitors: ExhibitorsSkeleton,
};

export function EventDetailTabSkeleton({ tab }: { tab: EventDetailTab }) {
  const Body = TAB_BODY[tab];

  if (!TABS_WITH_SIDEBAR.has(tab)) {
    return (
      <div aria-hidden>
        <Body />
      </div>
    );
  }

  return (
    <div
      className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
      aria-hidden
    >
      <div className="min-w-0">
        <Body />
      </div>
      <SidebarSkeleton />
    </div>
  );
}
