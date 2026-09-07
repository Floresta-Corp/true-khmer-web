import { getLearnerCourseQuiz } from "~/api/education/education.server";
import type { PublicCourseQuiz } from "~/features/education/types";
import { shuffle } from "~/lib/utils";

export async function loadCourseQuiz(
  request: Request,
  courseId: string,
): Promise<PublicCourseQuiz | null> {
  const response = await getLearnerCourseQuiz(request, courseId);
  const quiz = response?.data?.quiz;
  if (!quiz || quiz.questions.length === 0) return null;

  // Questions and their options are randomized on every load so each attempt
  // presents a different order.
  return {
    id: courseId,
    courseId,
    passMark: quiz.passMark,
    questions: shuffle(quiz.questions).map((question) => ({
      id: question.id,
      question: question.question,
      options: shuffle(question.options).map(({ id, label }) => ({
        id,
        label,
      })),
    })),
  };
}
