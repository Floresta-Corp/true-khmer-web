import type { ActionFunctionArgs } from "react-router";
import { markLessonWatched } from "~/api/education/education.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export type LearnActionResult =
  | { ok: true; completedLessonIds: string[] }
  | { ok: false; message: string };

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
