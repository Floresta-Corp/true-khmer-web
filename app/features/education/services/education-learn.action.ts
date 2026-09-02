import type { ActionFunctionArgs } from "react-router";
import { markLessonWatched } from "~/api/education/education.server";

export type LearnActionResult =
  | { ok: true; completedLessonIds: string[] }
  | { ok: false };

/**
 * Records that the learner opened a lesson.
 *
 * Fired in the background as they move through the course, so a failure is
 * reported but never blocks playback — a signed-out viewer simply has no
 * progress to record.
 */
export async function educationLearnAction({
  request,
  params,
}: ActionFunctionArgs): Promise<LearnActionResult> {
  const courseId = params.id;
  const formData = await request.formData();
  const lessonId = formData.get("lessonId");

  if (!courseId || typeof lessonId !== "string" || !lessonId) {
    return { ok: false };
  }

  try {
    const response = await markLessonWatched(request, courseId, lessonId);
    return {
      ok: true,
      completedLessonIds: response?.data?.completedLessonIds ?? [],
    };
  } catch {
    return { ok: false };
  }
}
