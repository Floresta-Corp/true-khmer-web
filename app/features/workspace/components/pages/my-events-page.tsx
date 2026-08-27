import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router";
import { motion } from "motion/react";
import { CalendarPlus, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import SpacePagination from "~/components/space-pagination";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import MyEventCard from "../card/my-event-card";
import MyEventCardSkeleton from "../card/my-event-card-skeleton";
import MyEventsFilters from "../card/my-events-filter";
import type { loader } from "../../route/my-events";
import {
  MyEventFilterSchema,
  MyEventFormatFilterSchema,
  type MyEvent,
  type MyEventFilter,
  type MyEventFormatFilter,
} from "~/features/workspace/types/my-events";

const CREATE_EVENT_PATH = "/my-events/create";

function readFilter(value: string | null): MyEventFilter {
  const result = MyEventFilterSchema.safeParse(value);
  return result.success ? result.data : "all";
}

function readFormat(value: string | null): MyEventFormatFilter {
  const result = MyEventFormatFilterSchema.safeParse(value);
  return result.success ? result.data : "all";
}

export default function MyEventsPage() {
  const { events, pagination } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const [filter, setFilter] = useState<MyEventFilter>(() =>
    readFilter(searchParams.get("filter")),
  );
  const [format, setFormat] = useState<MyEventFormatFilter>(() =>
    readFormat(searchParams.get("format")),
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/my-events";

  const isLastPage = pagination ? !pagination.hasNextPage : true;

  useEffect(() => {
    setFilter(readFilter(searchParams.get("filter")));
    setFormat(readFormat(searchParams.get("format")));
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

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

  const handleFormatChange = (value: MyEventFormatFilter) => {
    setFormat(value);
    updateParam("format", value);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateParam("search", value);
  };

  return (
    <WorkSpacePageLayout
      title="My Events"
      subtitle="Create, monitor and manage every event you organize."
      action={
        <Button
          onClick={() => navigate(CREATE_EVENT_PATH)}
          className="shadow-brand-blue/20 w-full cursor-pointer gap-2 rounded-xl bg-blue-600 p-6 text-[14px] font-semibold whitespace-nowrap text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-95 sm:w-auto"
        >
          <Plus size={18} strokeWidth={2.5} />
          New Event
        </Button>
      }
    >
      <div className="-mt-5 mb-5 max-w-none">
        <MyEventsFilters
          filter={filter}
          format={format}
          searchInput={searchInput}
          onFilterChange={handleFilterChange}
          onFormatChange={handleFormatChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <MyEventCardSkeleton key={i} />
          ))
        ) : (
          <>
            {events.map((event: MyEvent, index: number) => (
              <MyEventCard key={event.id} event={event} index={index} />
            ))}

            {isLastPage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={CREATE_EVENT_PATH}
                  className="group flex h-full min-h-55 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-none p-5 outline-2 outline-gray-200 transition-all outline-dashed hover:bg-gray-50 hover:outline-blue-400"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors group-hover:border-blue-400 group-hover:text-blue-500">
                    <CalendarPlus size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-gray-500 transition-colors group-hover:text-blue-600">
                      New Event
                    </p>
                    <p className="text-[12px] text-gray-400">
                      Start with the basics, finish in Plumpi
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className="mt-10 pb-10">
        <SpacePagination
          total={pagination?.total ?? events.length}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.limit ?? 6}
          itemLabel="events"
        />
      </div>
    </WorkSpacePageLayout>
  );
}
