import { data } from "react-router";
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

  const completedLessonIds =
    progressRes?.data?.completedLessonIds ?? ([] as string[]);

  return withAuthData(auth, {
    course: { ...course, hasQuiz },
    completedLessonIds,
  });
}
