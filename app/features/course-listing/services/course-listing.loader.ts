import type { Route } from "project-types/course-listing/route/+types/course-listing";
import { listMyCourses } from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
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

  // The design shows Total learners / Completed / In progress / Not started
  // per published course. The API has no enrolment or progress resource —
  // `courses/mine` returns `CourseResponse`, which carries no learner counts —
  // so the block is left out rather than filled with invented figures. Wire
  // this up when an enrolment endpoint exists.
  const courses: CourseWithStats[] = filtered.map((course) => ({
    ...course,
    stats: null,
  }));

  const pagination: MyCoursesPagination | null =
    result?.data?.pagination ?? null;

  return withAuthData(auth, {
    courses,
    pagination,
    tab,
    search,
  });
}
