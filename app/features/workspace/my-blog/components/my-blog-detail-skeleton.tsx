import { Skeleton } from "~/components/ui/skeleton";

/**
 * Mirrors the compose screen (top bar, editor toolbar, cover, title/meta and
 * body) so opening a blog fades from placeholder to content without the layout
 * jumping around.
 */
export function MyBlogFormSkeleton({
  withCover = true,
}: {
  withCover?: boolean;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading blog"
      className="mx-auto max-w-[1180px] animate-in space-y-8 px-0 pt-0 pb-20 duration-300 fade-in"
    >
      {/* Top bar: back button + status badge, then the action cluster. */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="hidden h-5 w-28 rounded-md sm:block" />
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      {/* Editor toolbar strip. */}
      <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm lg:px-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="size-8 rounded-md" />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1140px] rounded-2xl border border-slate-100 bg-white px-6 pb-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="space-y-10 pt-4">
          {/* Cover image. */}
          {withCover ? (
            <div className="mx-auto max-w-[1120px]">
              <Skeleton className="h-[340px] w-full rounded-[28px] md:h-[420px]" />
            </div>
          ) : null}

          <div className="mx-auto max-w-[760px] space-y-5">
            {/* Title + subtitle. */}
            <div className="space-y-5">
              <Skeleton className="h-11 w-4/5" />
              <Skeleton className="h-7 w-3/5" />
            </div>

            {/* Author, category and tag chips. */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Skeleton className="h-11 w-44 rounded-xl" />
              <Skeleton className="h-11 w-56 rounded-xl" />
              <Skeleton className="h-11 basis-full rounded-xl xl:min-w-[220px] xl:flex-1 xl:basis-auto" />
            </div>

            {/* Body copy. */}
            <div className="space-y-3 pt-4">
              {[
                "w-full",
                "w-11/12",
                "w-full",
                "w-4/5",
                "w-full",
                "w-2/3",
                "w-full",
                "w-3/4",
              ].map((width, index) => (
                <Skeleton key={index} className={`h-4 ${width}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyBlogDetailSkeleton({
  withCover = true,
}: {
  withCover?: boolean;
}) {
  return (
    <div className="min-h-full bg-[#f8fafc] p-6 dark:bg-slate-950">
      <MyBlogFormSkeleton withCover={withCover} />
    </div>
  );
}
