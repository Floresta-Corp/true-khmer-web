import type { Route } from "project-types/course-listing/route/+types/course-listing";
import { listMyCourses } from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { buildLearnerStats } from "~/features/course-listing/lib/course-stats-fixtures";
import { filterFixtures } from "~/features/course-listing/lib/my-courses-fixtures";
import {
  CourseTabSchema,
  displayStatusOf,
  TAB_STATUS,
  type CourseWithStats,
  type MyCoursesPagination,
} from "~/features/course-listing/types";

const PAGE_SIZE = 12;

export async function courseListingLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const url = new URL(request.url);
  const tab = CourseTabSchema.catch("all").parse(
    url.searchParams.get("tab") ?? "all",
  );
  const search = url.searchParams.get("search")?.trim() ?? "";
  const cursor = url.searchParams.get("cursor") ?? undefined;

  const result = await listMyCourses(request, {
    search: search || undefined,
    status: TAB_STATUS[tab],
    cursor,
    limit: PAGE_SIZE,
  });

  const raw = result?.data?.courses ?? [];

  // Draft and Rejected both ask the API for DRAFT, so split them here. Note
  // this filters a page the API has already sliced, which can leave a page
  // short; it resolves itself once the API can filter on rejection directly.
  const filtered =
    tab === "draft"
      ? raw.filter((course) => displayStatusOf(course) !== "REJECTED")
      : tab === "rejected"
        ? raw.filter((course) => displayStatusOf(course) === "REJECTED")
        : raw;

  const courses: CourseWithStats[] = filtered.map((course) => ({
    ...course,
    // Only a published course has learners to report on.
    stats: course.status === "PUBLISHED" ? buildLearnerStats(course) : null,
  }));

  const pagination: MyCoursesPagination | null =
    result?.data?.pagination ?? null;

  // Nothing on the API yet: fall back to placeholders so the screen can be
  // reviewed against the design. Real courses always win, and this only
  // triggers on the first page so "load more" cannot mix the two.
  if (raw.length === 0 && !cursor) {
    const placeholders = filterFixtures(tab, search);
    return withAuthData(auth, {
      courses: placeholders,
      pagination: null,
      tab,
      search,
      usingPlaceholders: true as const,
    });
  }

  return withAuthData(auth, {
    courses,
    pagination,
    tab,
    search,
    usingPlaceholders: false as const,
  });
}
