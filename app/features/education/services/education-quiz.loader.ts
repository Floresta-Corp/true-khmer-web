import { data } from "react-router";
import type { Route as EducationQuizRoute } from "project-types/education/route/+types/education.quiz.$id";
import { loadCourseQuiz } from "~/features/education/lib/map-quiz";
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

  const saved = await loadCourseQuiz(request, course.id);

  if (!saved) {
    throw data(
      { message: "This course has no quiz available." },
      { status: 404 },
    );
  }

  const { questions, ...rest } = saved;

  // Correct answers stay on the server; `education-quiz.action` grades the
  // submission.
  const quiz: PublicCourseQuiz = {
    ...rest,
    questions: questions.map(({ correctOptionId: _omit, ...question }) => ({
      ...question,
    })),
  };

  return { course, quiz };
}
