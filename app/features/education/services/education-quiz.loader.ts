import { data } from "react-router";
import type { Route as EducationQuizRoute } from "project-types/education/route/+types/education.quiz.$id";
import { loadCourseQuiz } from "~/features/education/lib/map-quiz";
import { loadCourseDetail } from "./education-detail.loader";

export async function educationQuizLoader({
  request,
  params,
}: EducationQuizRoute.LoaderArgs) {
  const course = await loadCourseDetail(request, params.id);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
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
