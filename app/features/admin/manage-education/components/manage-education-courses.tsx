import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { useFetcher, useSearchParams } from "react-router";

import { Button } from "~/components/ui/button";
import type { CourseCreator } from "~/api/admin/education-center/education-center.server";
import type { CourseResponse } from "~/types/api-client";
import { useCourseReview } from "../hooks/use-course-review";
import type {
  AdminCoursePage,
  manageEducationLoader,
} from "../services/manage-education.loader";
import ApproveCourseDialog from "./approve-course-dialog";
import CoursePublicationDialog from "./course-publication-dialog";
import ManageEducationRow from "./manage-education-row";
import RejectCourseDialog from "./reject-course-dialog";

const LIMIT = 12;

export const BASE_PATH = "/tk-admin/manage-education";

export const FILTER_KEYS = ["search", "status", "sortBy", "createdBy"] as const;

export const filterKeyOf = (params: URLSearchParams) =>
  FILTER_KEYS.map((key) => params.get(key) || "").join("|");

interface ManageEducationCoursesProps {
  firstPage: AdminCoursePage;
  categoryNames: Map<string, string>;
  hasFilters: boolean;
}

export default function ManageEducationCourses({
  firstPage,
  categoryNames,
  hasFilters,
}: ManageEducationCoursesProps) {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof manageEducationLoader>();

  const [extraPages, setExtraPages] = useState<CourseResponse[]>([]);
  const [extraCreators, setExtraCreators] = useState<
    Record<string, CourseCreator>
  >({});
  const [extraCursor, setExtraCursor] = useState<string | null | undefined>();
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  const { decidedStatuses, approve, reject, publish, unpublish, isReviewing } =
    useCourseReview();

  const buildQuery = useCallback(
    (cursor: string) => {
      const params = new URLSearchParams();
      for (const key of FILTER_KEYS) {
        const value = searchParams.get(key);
        if (value) params.set(key, value);
      }
      params.set("limit", String(LIMIT));
      params.set("cursor", cursor);

      return `${BASE_PATH}?${params.toString()}`;
    },
    [searchParams],
  );

  useEffect(() => {
    const pending = fetcher.data?.data;
    if (!pending) return;

    let cancelled = false;
    void Promise.resolve(pending)
      .then((nextPage) => {
        if (cancelled) return;

        setExtraPages((prev) => {
          const seen = new Set([
            ...firstPage.courses.map((course) => course.id),
            ...prev.map((course) => course.id),
          ]);
          const fresh = nextPage.courses.filter(
            (course) => !seen.has(course.id),
          );
          return [...prev, ...fresh];
        });
        setExtraCreators((prev) => ({ ...prev, ...nextPage.creators }));
        setExtraCursor(nextPage.pagination.nextCursor);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadMoreFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher.data?.data, firstPage.courses]);

  const courses = useMemo(() => {
    const seen = new Set(firstPage.courses.map((course) => course.id));
    const merged = [
      ...firstPage.courses,
      ...extraPages.filter((course) => !seen.has(course.id)),
    ];

    if (decidedStatuses.size === 0) return merged;
    return merged.map((course) => {
      const decided = decidedStatuses.get(course.id);
      return decided ? { ...course, status: decided } : course;
    });
  }, [firstPage.courses, extraPages, decidedStatuses]);

  const creators = useMemo(
    () => ({ ...firstPage.creators, ...extraCreators }),
    [firstPage.creators, extraCreators],
  );

  const cursor =
    extraCursor === undefined ? firstPage.pagination.nextCursor : extraCursor;
  const hasMore = Boolean(cursor);
  const isLoadingMore = fetcher.state === "loading";

  const handleLoadMore = useCallback(() => {
    if (!cursor || isLoadingMore) return;

    setLoadMoreFailed(false);
    fetcher.load(buildQuery(cursor));
  }, [cursor, isLoadingMore, fetcher.load, buildQuery]);

  const actionsFor = (course: CourseResponse) => {
    if (course.status === "PENDING") {
      return (
        <>
          <ApproveCourseDialog
            courseId={course.id}
            courseTitle={course.title}
            onConfirm={approve}
            disabled={isReviewing}
          />
          <RejectCourseDialog
            courseId={course.id}
            courseTitle={course.title}
            onConfirm={reject}
            disabled={isReviewing}
          />
        </>
      );
    }

    if (course.status === "PUBLISHED" || course.status === "UNPUBLISHED") {
      return (
        <CoursePublicationDialog
          courseId={course.id}
          courseTitle={course.title}
          published={course.status === "PUBLISHED"}
          onPublish={publish}
          onUnpublish={unpublish}
          disabled={isReviewing}
        />
      );
    }

    return null;
  };

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-slate-800 dark:text-slate-500">
          <BookOpen size={22} aria-hidden />
        </div>
        <p className="text-[15px] font-bold text-gray-700 dark:text-slate-200">
          {hasFilters
            ? "No courses match this filter"
            : "Nothing waiting for review"}
        </p>
        <p className="mt-1 text-[13px] text-gray-500 dark:text-slate-400">
          {hasFilters
            ? "Try a different search or status."
            : "Courses submitted for review by their creators will show up here."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {courses.map((course, index) => (
          <ManageEducationRow
            key={course.id}
            course={course}
            index={index}
            categoryName={categoryNames.get(course.categoryId) ?? null}
            creator={creators[course.createdBy] ?? null}
            actions={actionsFor(course)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex flex-col items-center gap-2 pb-10">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-6 font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading…" : "Load more"}
          </Button>

          {loadMoreFailed && !isLoadingMore && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Couldn’t load more courses. Try again.
            </p>
          )}
        </div>
      )}
    </>
  );
}
