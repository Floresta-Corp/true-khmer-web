import type { QuizAttemptAnswer } from "~/api/education/education.server";

/**
 * How a quiz attempt travels from the browser to the route action.
 *
 * The runner names one field per answered question and the action reads them
 * back, so both halves of that wire format live here rather than as a string
 * literal repeated in a component and a service — which is how the two drift.
 */
const ANSWER_FIELD_PREFIX = "answer:";

export function quizAnswerField(questionId: string) {
  return `${ANSWER_FIELD_PREFIX}${questionId}`;
}

/**
 * The answers a submitted quiz form carries, in the shape the API grades.
 *
 * A question the learner skipped has no field at all and is simply absent —
 * the API marks it as unanswered rather than rejecting the attempt.
 */
export function readQuizAnswers(formData: FormData): QuizAttemptAnswer[] {
  const answers: QuizAttemptAnswer[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(ANSWER_FIELD_PREFIX) || typeof value !== "string") {
      continue;
    }

    const questionId = key.slice(ANSWER_FIELD_PREFIX.length);
    if (questionId && value) answers.push({ questionId, optionId: value });
  }

  return answers;
}
