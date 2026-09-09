import { Suspense, useEffect, useState } from "react";
import {
  Await,
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { CalendarDays, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import SpacePagination from "~/components/space-pagination";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import MyEventCard from "../card/my-event-card";
import MyEventsGridSkeleton from "../card/my-events-grid-skeleton";
import MyEventsFilters from "../card/my-events-filter";
import type { loader } from "../../route/my-events";
import { PLUMPI_HANDOFF_INTENT } from "~/features/workspace/lib/plumpi-handoff";
import { usePlumpiHandoff } from "~/lib/plumpi/use-plumpi-handoff";
import {
  MyEventFilterSchema,
  type MyEvent,
  type MyEventFilter,
} from "~/features/workspace/types/my-events";

const CREATE_EVENT_PATH = "/my-events/create";
const MY_EVENTS_PATH = "/my-events";

function readFilter(value: string | null): MyEventFilter {
  const result = MyEventFilterSchema.safeParse(value);
  return result.success ? result.data : "all";
}

export default function MyEventsPage() {
  const { content, hasLiveEvents } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { start, pendingKey: openingEventId } = usePlumpiHandoff({
    popupBlockedMessage: "Allow pop-ups to open this event in Plumpi.",
  });

  const [filter, setFilter] = useState<MyEventFilter>(() =>
    readFilter(searchParams.get("filter")),
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === MY_EVENTS_PATH;

  useEffect(() => {
    setFilter(readFilter(searchParams.get("filter")));
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  // The listing is streamed, so a load failure is only known once its promise
  // settles; a later page of events supersedes the toast of the previous one.
  useEffect(() => {
    let isCurrent = true;
    content
      .then(({ loadError }) => {
        if (isCurrent && loadError) toast.error(loadError);
      })
      .catch(() => {});
    return () => {
      isCurrent = false;
    };
  }, [content]);

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  };

  const handleFilterChange = (value: MyEventFilter) => {
    setFilter(value);
    updateParam("filter", value);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateParam("search", value);
  };

  const handleOpenEvent = (event: MyEvent) => {
    if (!event.organizationId) {
      toast.error("This event is not linked to a Plumpi organization yet.");
      return;
    }

    start(
      {
        intent: PLUMPI_HANDOFF_INTENT,
        eventId: event.id,
        organizationId: event.organizationId,
      },
      { action: MY_EVENTS_PATH, key: event.id },
    );
  };

  return (
    <WorkSpacePageLayout
      title="Events"
      subtitle="Manage all your events in one place"
      action={
        <Button
          asChild
          className="h-12 w-full rounded-xl bg-[#305CCD] px-6 text-[15px] font-bold text-white sm:w-auto [a]:hover:bg-[#2A51B8]"
        >
          <Link to={CREATE_EVENT_PATH}>
            <Plus size={18} strokeWidth={2.5} aria-hidden />
            Create event
          </Link>
        </Button>
      }
    >
      <div className="-mt-5 mb-6">
        <MyEventsFilters
          filter={filter}
          searchInput={searchInput}
          hasLiveEvents={hasLiveEvents}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-1 flex-col">
        {/* The grid is the only part that needs Plumpi, so it is the only part
            that falls back to a skeleton: on the first paint through
            `<Suspense>`, and on filter/search/page changes through the
            navigation state. */}
        {isLoading ? (
          <MyEventsGridSkeleton />
        ) : (
          <Suspense fallback={<MyEventsGridSkeleton />}>
            <Await
              resolve={content}
              errorElement={
                <div className="flex min-h-105 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
                  <CalendarDays size={42} className="mb-1.5 text-[#E5E7EB]" />
                  <div className="text-[16px] font-bold text-[#1A1A2E]">
                    Unable to load your events.
                  </div>
                  <p className="m-0 text-[14px] text-[#9A9AB0]">
                    Please refresh the page to try again.
                  </p>
                </div>
              }
            >
              {({ events, pagination }) => (
                <>
                  {events.length === 0 ? (
                    <div className="flex min-h-105 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
                      <CalendarDays
                        size={42}
                        className="mb-1.5 text-[#E5E7EB]"
                      />
                      <div className="text-[16px] font-bold text-[#1A1A2E]">
                        No events yet.
                      </div>
                      <p className="m-0 text-[14px] text-[#9A9AB0]">
                        Events you create will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {events.map((event: MyEvent, index: number) => (
                        <MyEventCard
                          key={event.id}
                          event={event}
                          index={index}
                          isOpening={openingEventId === event.id}
                          onOpen={handleOpenEvent}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pushed to the bottom of the page so it keeps a fixed spot
                      instead of riding up under a short grid. */}
                  {events.length > 0 && (
                    <div className="mt-auto pt-10">
                      <SpacePagination
                        total={pagination?.total ?? events.length}
                        totalPages={pagination?.totalPages}
                        pageSize={pagination?.limit ?? 8}
                        itemLabel="events"
                      />
                    </div>
                  )}
                </>
              )}
            </Await>
          </Suspense>
        )}
      </div>
    </WorkSpacePageLayout>
  );
}
