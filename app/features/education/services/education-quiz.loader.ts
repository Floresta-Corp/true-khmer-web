import { data } from "react-router";
import type { Route as EducationQuizRoute } from "project-types/education/route/+types/education.quiz.$id";
import { buildCourseQuiz } from "~/features/education/lib/education-fixtures";
import type { PublicCourseQuiz } from "~/features/education/types";
import { loadCourseDetail } from "./education-detail.loader";

export async function educationQuizLoader({
  request,
  params,
}: EducationQuizRoute.LoaderArgs) {
  const course = await loadCourseDetail(request, params.id);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const { questions, ...rest } = buildCourseQuiz(course.id);

  // Correct answers stay on the server; `education-quiz.action` grades the
  // submission.
  const quiz: PublicCourseQuiz = {
    ...rest,
    questions: questions.map(
      ({ correctOptionId: _omit, ...question }) => question,
    ),
  };

  return { course, quiz };
}
