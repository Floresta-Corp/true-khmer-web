import type { ActionFunctionArgs } from "react-router";
import { markLessonWatched } from "~/api/education/education.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export type LearnActionResult =
  | { ok: true; completedLessonIds: string[] }
  | { ok: false; message: string };

/**
 * Records that the learner opened a lesson.
 *
 * Fired in the background as they move through the course, so a failure never
 * blocks playback. It is still reported: the sidebar has already ticked the
 * lesson off locally, and a learner told nothing would come back to a course
 * that had forgotten everything they watched.
 *
 * Only API failures are answered this way. A thrown redirect — what a failed
 * token refresh raises — is left alone so the session still ends properly.
 */
export async function educationLearnAction({
  request,
  params,
}: ActionFunctionArgs): Promise<LearnActionResult> {
  const courseId = params.id;
  const formData = await request.formData();
  const lessonId = formData.get("lessonId");

  if (!courseId || typeof lessonId !== "string" || !lessonId) {
    return { ok: false, message: "Missing course or lesson id." };
  }

  try {
    const response = await markLessonWatched(request, courseId, lessonId);
    return {
      ok: true,
      completedLessonIds: response?.data?.completedLessonIds ?? [],
    };
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}
