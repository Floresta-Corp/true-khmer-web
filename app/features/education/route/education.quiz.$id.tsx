import CourseQuizPage from "../components/pages/course-quiz-page";
import { educationQuizAction } from "../services/education-quiz.action";
import { educationQuizLoader } from "../services/education-quiz.loader";
import type { Route } from "./+types/education.quiz.$id";

export const loader = educationQuizLoader;
export const action = educationQuizAction;

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `Final quiz · ${data?.course.title ?? "Course"}` }];
}

export default CourseQuizPage;
