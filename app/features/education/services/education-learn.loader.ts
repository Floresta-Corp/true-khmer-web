import { data, redirect } from "react-router";
import type { Route as EducationLearnRoute } from "project-types/education/route/+types/education.learn.$id";
import { getCourseProgress } from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { loadCourseDetail, loadCourseHasQuiz } from "./education-detail.loader";

export async function educationLearnLoader({
  request,
  params,
}: EducationLearnRoute.LoaderArgs) {
  const auth = await requireUser(request);

  const [course, hasQuiz, progressRes] = await Promise.all([
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

  const progress = progressRes?.data;
  const completedLessonIds = progress?.completedLessonIds ?? [];

  const lessons = course.curriculum.flatMap((section) => section.lessons);

  /* The API resolves what is open, so the screen and the endpoints agree on
     one answer. The fallback matters only when progress could not be read: the
     course's own `isLocked` flags came from the same rule on the same request. */
  const unlockedLessonIds =
    progress?.unlockedLessonIds ??
    lessons.filter((lesson) => !lesson.isLocked).map((lesson) => lesson.id);

  /**
   * Sends a learner asking for a locked lesson to the one they are on.
   *
   * A locked lesson arrives with its media withheld, so following the link
   * would only show an empty player; better to land them where the course
   * actually is. Their own frontier, and not simply the first lesson, so
   * someone returning to a half-finished course resumes it.
   */
  const requested = new URL(request.url).searchParams.get("lesson");
  const unlocked = new Set(unlockedLessonIds);

  if (requested && !unlocked.has(requested)) {
    const resume =
      progress?.nextLessonId ??
      lessons.find((lesson) => unlocked.has(lesson.id))?.id;

    throw redirect(
      resume
        ? `/education/${params.id}/learn?lesson=${resume}`
        : `/education/${params.id}/learn`,
    );
  }

  return withAuthData(auth, {
    course: { ...course, hasQuiz },
    completedLessonIds,
    unlockedLessonIds,
    nextLessonId: progress?.nextLessonId ?? null,
    isCourseComplete: progress?.isComplete ?? false,
    /* Where each part-finished lesson was left, so a player opens there
       rather than at the beginning. */
    resumePoints: progress?.resumePoints ?? [],
    /* The lesson to land on when the address bar names none — where they
       were, which is not always the frontier. */
    lastLessonId: progress?.lastLessonId ?? null,
  });
}
