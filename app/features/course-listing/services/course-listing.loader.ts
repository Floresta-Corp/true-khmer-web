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

  const filtered =
    tab === "draft"
      ? raw.filter((course) => displayStatusOf(course) !== "REJECTED")
      : tab === "rejected"
        ? raw.filter((course) => displayStatusOf(course) === "REJECTED")
        : raw;

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
