import type { Route } from "project-types/course-listing/route/+types/course-listing";
import {
  getCourseStats,
  listMyCourses,
} from "~/api/education/education.server";
import {
  reportsLearners,
  toLearnerStats,
} from "~/features/course-listing/lib/course-stats";
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

  const filtered =
    tab === "draft"
      ? raw.filter((course) => displayStatusOf(course) !== "REJECTED")
      : tab === "rejected"
        ? raw.filter((course) => displayStatusOf(course) === "REJECTED")
        : raw;

  /* The listing endpoint carries no engagement figures, so the strip's numbers
     come from each course's own stats call. Issued together rather than in
     sequence: a page is at most PAGE_SIZE courses and only the ones that can
     have learners are asked about, so this costs one round trip of latency
     rather than twelve. A batched endpoint is the fix if the page grows. */
  const courses: CourseWithStats[] = await Promise.all(
    filtered.map(async (course) => {
      if (!reportsLearners(course)) return { ...course, stats: null };

      const stats = await getCourseStats(request, course.id);
      return { ...course, stats: toLearnerStats(stats?.data?.stats) };
    }),
  );

  const pagination: MyCoursesPagination | null =
    result?.data?.pagination ?? null;

  return withAuthData(auth, {
    courses,
    pagination,
    tab,
    search,
  });
}
