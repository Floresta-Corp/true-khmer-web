import type { Route } from "project-types/course-manage/route/+types/course-manage.$id.students";
import {
  listCourseStudents,
  type CourseStudentStatus,
} from "~/api/education/education.server";
import { STUDENT_PAGE_SIZE } from "~/features/course-manage/types";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

function isStudentStatus(value: string | null): value is CourseStudentStatus {
  return (
    value === "completed" || value === "in-progress" || value === "not-started"
  );
}

/**
 * One page of a course's roster, for the Students tab's fetcher.
 *
 * A resource route of its own rather than a branch inside the course loader:
 * paging must not also refetch the course, its curriculum, its stats and its
 * reviews, and a single loader returning two different shapes would make
 * `useLoaderData` a union for every other consumer.
 */
export async function courseStudentsLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const page = Number(url.searchParams.get("page") ?? "1");

  const roster = await listCourseStudents(request, params.id, {
    status: isStudentStatus(status) ? status : undefined,
    search: url.searchParams.get("search") ?? undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: STUDENT_PAGE_SIZE,
  });

  return withAuthData(auth, roster?.data ?? null);
}
