import type { ActionFunctionArgs } from "react-router";
import { buildCourseQuiz } from "~/features/education/lib/education-fixtures";
import type { QuizAttemptResult } from "~/features/education/types";

export type QuizActionResult =
  | { ok: true; result: QuizAttemptResult }
  | { ok: false; message: string };

/**
 * Grades a final-quiz attempt.
 *
 * Attempts are not persisted — the API has no quiz resource yet — but grading
 * happens here so the correct answers never reach the browser.
 */
export async function educationQuizAction({
  params,
  request,
}: ActionFunctionArgs): Promise<QuizActionResult> {
  const courseId = params.id;
  if (!courseId) {
    return { ok: false, message: "Missing course id." };
  }

  const formData = await request.formData();
  const quiz = buildCourseQuiz(courseId);

  let correctCount = 0;
  for (const question of quiz.questions) {
    const answer = formData.get(`answer:${question.id}`);
    if (typeof answer === "string" && answer === question.correctOptionId) {
      correctCount += 1;
    }
  }

  const totalCount = quiz.questions.length;
  const percent =
    totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return {
    ok: true,
    result: {
      correctCount,
      totalCount,
      percent,
      passed: percent >= quiz.passMark,
    },
  };
}
