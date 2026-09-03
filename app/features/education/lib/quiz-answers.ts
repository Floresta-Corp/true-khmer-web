import type { QuizAttemptAnswer } from "~/api/education/education.server";

const ANSWER_FIELD_PREFIX = "answer:";

export function quizAnswerField(questionId: string) {
  return `${ANSWER_FIELD_PREFIX}${questionId}`;
}

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
