import { getCourseQuiz } from "~/api/education/education.server";
import type { CourseQuiz } from "~/features/education/types";

/**
 * The course's real quiz, or `null` when there isn't one to serve.
 *
 * `GET /courses/:id/quiz` is the only quiz resource and it is Bearer-guarded,
 * so it answers for the course owner and nobody else. A learner therefore gets
 * `null` here and the quiz screen reports the quiz as unavailable — the
 * alternative would be inventing questions, which tells the learner they
 * passed or failed something that was never set.
 */
export async function loadCourseQuiz(
  request: Request,
  courseId: string,
): Promise<CourseQuiz | null> {
  try {
    const response = await getCourseQuiz(request, courseId);
    const quiz = response?.data?.quiz;
    if (!quiz || quiz.questions.length === 0) return null;

    const questions = quiz.questions
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((question) => {
        const options = question.options
          .slice()
          .sort((a, b) => a.position - b.position);
        const correct = options.find((option) => option.isCorrect);
        // A question with no correct option cannot be graded, so it is dropped
        // rather than silently marked wrong for everyone.
        if (!correct) return null;

        return {
          id: question.id,
          question: question.question,
          options: options.map(({ id, label }) => ({ id, label })),
          correctOptionId: correct.id,
        };
      })
      .filter((question) => question !== null);

    if (questions.length === 0) return null;

    return {
      id: courseId,
      courseId,
      passMark: quiz.passMark,
      questions,
    };
  } catch {
    // Not the owner, or no quiz saved — either way there is nothing to serve.
    return null;
  }
}
