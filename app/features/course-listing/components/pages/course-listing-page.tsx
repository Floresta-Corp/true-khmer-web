import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import { debounce } from "~/lib/utils";
import { CourseListingCard } from "../course-listing-card";
import { CourseListingRow } from "../course-listing-row";
import { CourseListingFilters } from "../course-listing-filters";
import {
  CourseListingCardSkeleton,
  CourseListingSkeleton,
} from "../course-listing-skeleton";
import type { loader } from "../../route/course-listing";
import {
  CourseViewSchema,
  type CourseTab,
  type CourseView,
  type CourseWithStats,
} from "~/features/course-listing/types";

/** Whether a pending navigation moves anything other than `?view=`. */
function loaderParamsChanged(current: URLSearchParams, nextSearch: string) {
  const strip = (params: URLSearchParams) => {
    const copy = new URLSearchParams(params);
    copy.delete("view");
    copy.sort();
    return copy.toString();
  };
  return strip(current) !== strip(new URLSearchParams(nextSearch));
}

export default function CourseListingPage() {
  const { courses, pagination, tab, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const fetcher = useFetcher<typeof loader>();

  const [searchInput, setSearchInput] = useState(search);

  /* The layout lives in the URL alongside `tab` and `search`, so a shared link
     opens in the same view. The route's `shouldRevalidate` skips the loader
     when only `view` moves, so the toggle costs no refetch. */
  const view: CourseView = CourseViewSchema.catch("list").parse(
    searchParams.get("view") ?? "list",
  );
  const isGrid = view === "grid";

  const [extraCourses, setExtraCourses] = useState<CourseWithStats[]>([]);
  const [cursor, setCursor] = useState(pagination?.nextCursor ?? null);
  const [hasMore, setHasMore] = useState(pagination?.hasMore ?? false);
  const lastAppended = useRef<unknown>(null);

  /* A view toggle navigates without revalidating, so it must not raise the
     skeletons — only a change to a param the loader reads counts as loading. */
  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/course-listing" &&
    loaderParamsChanged(searchParams, navigation.location.search);

  useEffect(() => {
    setExtraCourses([]);
    setCursor(pagination?.nextCursor ?? null);
    setHasMore(pagination?.hasMore ?? false);
    lastAppended.current = null;
  }, [courses, pagination]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (lastAppended.current === fetcher.data) return;
    lastAppended.current = fetcher.data;

    setExtraCourses((current) => [...current, ...fetcher.data!.courses]);
    setCursor(fetcher.data.pagination?.nextCursor ?? null);
    setHasMore(fetcher.data.pagination?.hasMore ?? false);
  }, [fetcher.state, fetcher.data]);

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          }
          next.delete("cursor");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        updateParams({ search: value || null });
      }, 300),
    [updateParams],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const loadMore = () => {
    if (!cursor) return;
    const next = new URLSearchParams(searchParams);
    next.set("cursor", cursor);
    fetcher.load(`/course-listing?${next.toString()}`);
  };

  const visible = [...courses, ...extraCourses];

  return (
    <WorkSpacePageLayout
      title="Course Listing"
      subtitle="Create and manage the courses you teach."
      action={
        <Button
          asChild
          className="h-12 rounded-xl bg-[#305CCD] px-6 text-[15px] font-bold text-white [a]:hover:bg-[#2A51B8]"
        >
          <Link to="/education/create">
            <Plus size={18} strokeWidth={2.5} aria-hidden />
            Create course
          </Link>
        </Button>
      }
    >
      <div className="-mt-5 mb-5 max-w-none">
        <CourseListingFilters
          tab={tab}
          searchInput={searchInput}
          view={view}
          onTabChange={(next: CourseTab) =>
            updateParams({ tab: next === "all" ? null : next })
          }
          onSearchChange={(value) => {
            setSearchInput(value);
            debouncedSearch(value);
          }}
          onViewChange={(next: CourseView) =>
            updateParams({ view: next === "list" ? null : next })
          }
        />
      </div>

      <div
        className={
          isGrid
            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col gap-4"
        }
      >
        {isLoading
          ? Array.from({ length: isGrid ? 8 : 5 }).map((_, index) =>
              isGrid ? (
                <CourseListingCardSkeleton key={index} />
              ) : (
                <CourseListingSkeleton key={index} />
              ),
            )
          : visible.map((course, index) =>
              isGrid ? (
                <CourseListingCard
                  key={course.id}
                  course={course}
                  index={index}
                />
              ) : (
                <CourseListingRow
                  key={course.id}
                  course={course}
                  index={index}
                />
              ),
            )}
      </div>

      {!isLoading && visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <BookOpen size={22} aria-hidden />
          </div>
          <p className="text-[15px] font-bold text-gray-700">
            {search || tab !== "all"
              ? "No courses match this filter"
              : "You have not created a course yet"}
          </p>
          <p className="mt-1 text-[13px] text-gray-500">
            {search || tab !== "all"
              ? "Try a different search or status."
              : "Your courses will show up here once you create one."}
          </p>
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="mt-8 flex justify-center pb-10">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-6 font-bold"
            onClick={loadMore}
            disabled={fetcher.state !== "idle"}
          >
            {fetcher.state === "idle" ? "Load more" : "Loading…"}
          </Button>
        </div>
      )}
    </WorkSpacePageLayout>
  );
}
