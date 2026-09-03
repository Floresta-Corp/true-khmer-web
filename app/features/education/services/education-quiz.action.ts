import type { ActionFunctionArgs } from "react-router";
import { gradeCourseQuizAttempt } from "~/api/education/education.server";
import { readQuizAnswers } from "~/features/education/lib/quiz-answers";
import type { QuizAttemptResult } from "~/features/education/types";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";

export type QuizActionResult =
  | { ok: true; result: QuizAttemptResult }
  | { ok: false; message: string };

/**
 * Sends a final-quiz attempt to be marked.
 *
 * The API grades it: the answer key lives there and nowhere else, so neither
 * the browser nor this server ever holds it. Attempts are not persisted —
 * there is no attempt resource yet — so the result is shown and not stored.
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

  try {
    const response = await gradeCourseQuizAttempt(
      request,
      courseId,
      readQuizAnswers(formData),
    );

    const { correctCount, totalCount, percent, passed } = response.data.result;
    return { ok: true, result: { correctCount, totalCount, percent, passed } };
  } catch (error) {
    // Marking is signed-in only, so that it stays attributable once attempts
    // are worth recording. The quiz itself is readable without a session, so
    // this is a reachable state rather than an impossible one.
    if (error instanceof AuthSessionExpiredError) {
      return { ok: false, message: "Sign in to submit your answers." };
    }
    if (error instanceof ProtectedApiError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}
