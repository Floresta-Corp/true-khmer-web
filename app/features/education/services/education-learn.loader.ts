import { data, replace } from "react-router";
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

  const unlockedLessonIds =
    progress?.unlockedLessonIds ??
    lessons.filter((lesson) => !lesson.isLocked).map((lesson) => lesson.id);

  const requested = new URL(request.url).searchParams.get("lesson");
  const unlocked = new Set(unlockedLessonIds);

  if (requested && !unlocked.has(requested)) {
    const resume =
      progress?.nextLessonId ??
      lessons.find((lesson) => unlocked.has(lesson.id))?.id;

    throw replace(
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
    resumePoints: progress?.resumePoints ?? [],
    lastLessonId: progress?.lastLessonId ?? null,
  });
}
