import { data, redirect } from "react-router";
import type { Route as EducationQuizRoute } from "project-types/education/route/+types/education.quiz.$id";
import { getCourseProgress } from "~/api/education/education.server";
import { loadCourseQuiz } from "~/features/education/lib/map-quiz";
import { loadCourseDetail } from "./education-detail.loader";

export async function educationQuizLoader({
  request,
  params,
}: EducationQuizRoute.LoaderArgs) {
  const [course, progressRes] = await Promise.all([
    loadCourseDetail(request, params.id),
    getCourseProgress(request, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  /**
   * The quiz waits for the lessons.
   *
   * The API refuses to mark an attempt before then, so arriving here early
   * would only mean filling the paper in and being turned away at the end.
   * Sent to the lesson they are on instead — `nextLessonId` is the API's
   * answer, so this agrees with the learner screen.
   *
   * Progress that could not be read is not treated as incomplete: that would
   * lock a finished learner out of their own quiz over a failed request.
   */
  const progress = progressRes?.data;
  if (progress && progress.lessonCount > 0 && !progress.isComplete) {
    throw redirect(
      progress.nextLessonId
        ? `/education/${params.id}/learn?lesson=${progress.nextLessonId}`
        : `/education/${params.id}/learn`,
    );
  }

  const quiz = await loadCourseQuiz(request, course.id);

  if (!quiz) {
    throw data(
      { message: "This course has no quiz available." },
      { status: 404 },
    );
  }

  return { course, quiz };
}
