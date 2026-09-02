import { data } from "react-router";
import type { Route as EducationLearnRoute } from "project-types/education/route/+types/education.learn.$id";
import { getCourseProgress } from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { loadCourseDetail, loadCourseHasQuiz } from "./education-detail.loader";

/**
 * The course the learning screen plays.
 *
 * Signed in only. Watching is the one part of the Education Center that
 * records per-learner state, and progress is keyed to a user id — letting a
 * signed-out viewer watch would silently record nothing. The course detail
 * page stays public so a course can still be browsed before signing in.
 *
 * Which lesson is open comes from `?lesson=` and is resolved in the component,
 * so moving between lessons costs no round trip — see `shouldRevalidate` on
 * the route.
 */
export async function educationLearnLoader({
  request,
  params,
}: EducationLearnRoute.LoaderArgs) {
  const auth = await requireUser(request);

  const [course, hasQuiz, progressRes] = await Promise.all([
    // The "Posted by" block draws the instructor's photo and contact tiles,
    // so this screen needs that fetch too. It costs one extra wave on entry
    // only — `shouldRevalidate` keeps lesson changes off the network.
    loadCourseDetail(request, params.id, { withInstructorContact: true }),
    loadCourseHasQuiz(request, params.id),
    getCourseProgress(request, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  if (course.curriculum.every((section) => section.lessons.length === 0)) {
    throw data({ message: "This course has no lessons yet" }, { status: 404 });
  }

  // Which lessons this learner has already watched, so returning to a course
  // resumes rather than restarting at zero.
  const completedLessonIds =
    progressRes?.data?.completedLessonIds ?? ([] as string[]);

  return withAuthData(auth, {
    course: { ...course, hasQuiz },
    completedLessonIds,
  });
}
