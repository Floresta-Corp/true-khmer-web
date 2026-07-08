export function NotificationsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 border-b border-slate-100 px-4 py-4 sm:px-5 dark:border-slate-800"
        >
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </>
  );
}
