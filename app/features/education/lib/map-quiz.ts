import { getLearnerCourseQuiz } from "~/api/education/education.server";
import type { PublicCourseQuiz } from "~/features/education/types";

/**
 * The course's real quiz, or `null` when there isn't one to serve.
 *
 * `GET /courses/:id/quiz/questions` serves the questions without their answer
 * key for any course the viewer can see, and `POST /courses/:id/quiz/attempt`
 * marks them. So no answer key passes through here at all — not to the browser
 * and not even to this server, which is what the owner-only `GET .../quiz`
 * used to hand over on every quiz page load.
 */
export async function loadCourseQuiz(
  request: Request,
  courseId: string,
): Promise<PublicCourseQuiz | null> {
  const response = await getLearnerCourseQuiz(request, courseId);
  const quiz = response?.data?.quiz;
  if (!quiz || quiz.questions.length === 0) return null;

  // The API orders both lists, but the response does not promise it, so the
  // paper is ordered here rather than depending on that.
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
