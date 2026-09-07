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
    if (error instanceof AuthSessionExpiredError) {
      return { ok: false, message: "Sign in to submit your answers." };
    }
    if (error instanceof ProtectedApiError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}
