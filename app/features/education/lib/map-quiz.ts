import { getLearnerCourseQuiz } from "~/api/education/education.server";
import type { PublicCourseQuiz } from "~/features/education/types";

export async function loadCourseQuiz(
  request: Request,
  courseId: string,
): Promise<PublicCourseQuiz | null> {
  const response = await getLearnerCourseQuiz(request, courseId);
  const quiz = response?.data?.quiz;
  if (!quiz || quiz.questions.length === 0) return null;

  return {
    id: courseId,
    courseId,
    passMark: quiz.passMark,
    questions: quiz.questions
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options
          .slice()
          .sort((a, b) => a.position - b.position)
          .map(({ id, label }) => ({ id, label })),
      })),
  };
}
