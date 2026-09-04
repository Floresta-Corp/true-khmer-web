import { data } from "react-router";
import type { Route } from "project-types/course-manage/route/+types/course-manage.$id.students.$userId";
import { getCourseStudent } from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

/**
 * One learner's lesson-by-lesson progress and quiz attempts.
 *
 * Its own resource route so the progress dialog fetches it on open, for one
 * learner at a time — folding it into the roster payload would multiply every
 * course's lesson list by the page size.
 */
export async function courseStudentDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const result = await getCourseStudent(request, params.id, params.userId);
  if (!result?.data) {
    throw data({ message: "Student not found" }, { status: 404 });
  }

  return withAuthData(auth, result.data);
}
