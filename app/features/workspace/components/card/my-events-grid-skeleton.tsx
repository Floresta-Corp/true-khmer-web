import MyEventCardSkeleton from "./my-event-card-skeleton";

/** Matches the loader page size, so the placeholder grid fills like a real page. */
const PLACEHOLDER_COUNT = 8;

/**
 * Placeholder for the listing body: the card grid plus the pagination row,
 * laid out with the exact classes `MyEventsPage` uses for the loaded state so
 * nothing moves when the events arrive.
 */
export default function MyEventsGridSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <MyEventCardSkeleton key={index} />
        ))}
      </div>

      <div className="mt-auto pt-10">
        <div aria-hidden className="flex items-center justify-between">
          <p className="text-sm">
            <span className="inline-block w-40 max-w-full animate-pulse rounded bg-[#EDEFF3] align-middle text-transparent select-none">
              &nbsp;
            </span>
          </p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-8 animate-pulse rounded-md bg-[#EDEFF3]"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
