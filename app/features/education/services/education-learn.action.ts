import type { ActionFunctionArgs } from "react-router";
import {
  markLessonWatched,
  saveLessonResume,
} from "~/api/education/education.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

/**
 * Two things happen on this route, at very different rates.
 *
 * `resume` is written every few seconds while a lesson plays and only records
 * a place; `complete` happens once and is what opens the next lesson. Telling
 * them apart with an intent keeps the frequent write off the path that
 * revalidates the whole course.
 */
export type LearnActionIntent = "complete" | "resume";

export type LearnActionResult =
  | { ok: true; intent: "resume" }
  | {
      ok: true;
      intent: "complete";
      completedLessonIds: string[];
      unlockedLessonIds: string[];
      nextLessonId: string | null;
      isComplete: boolean;
    }
  | {
      ok: false;
      intent: LearnActionIntent;
      message: string;
      /** Set when the API refused because an earlier lesson is unfinished. */
      isLocked: boolean;
      nextLessonId: string | null;
    };

/** The `nextLessonId` the API sends back with a 409, when it sends one. */
function lockedLessonFrom(error: ProtectedApiError): string | null {
  const details = error.details;
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }

  const next = (details as Record<string, unknown>).nextLessonId;
  return typeof next === "string" ? next : null;
}

export async function educationLearnAction({
  request,
  params,
}: ActionFunctionArgs): Promise<LearnActionResult> {
  const courseId = params.id;
  const formData = await request.formData();
  const lessonId = formData.get("lessonId");
  const watched = formData.get("watchedSeconds");
  const position = formData.get("positionSeconds");

  const intent: LearnActionIntent =
    formData.get("intent") === "resume" ? "resume" : "complete";

  if (!courseId || typeof lessonId !== "string" || !lessonId) {
    return {
      ok: false,
      intent,
      message: "Missing course or lesson id.",
      isLocked: false,
      nextLessonId: null,
    };
  }

  /* Absent for a document lesson, which has no playback to measure. */
  const watchedSeconds =
    typeof watched === "string" && watched !== "" && Number.isFinite(+watched)
      ? +watched
      : null;

  const positionSeconds =
    typeof position === "string" &&
    position !== "" &&
    Number.isFinite(+position)
      ? Math.max(0, Math.round(+position))
      : 0;

  try {
    if (intent === "resume") {
      await saveLessonResume(request, courseId, {
        lessonId,
        positionSeconds,
        watchedSeconds: Math.max(0, Math.round(watchedSeconds ?? 0)),
      });

      return { ok: true, intent };
    }

    const response = await markLessonWatched(
      request,
      courseId,
      lessonId,
      watchedSeconds,
    );

    const progress = response?.data;
    return {
      ok: true,
      intent,
      completedLessonIds: progress?.completedLessonIds ?? [],
      unlockedLessonIds: progress?.unlockedLessonIds ?? [],
      nextLessonId: progress?.nextLessonId ?? null,
      isComplete: progress?.isComplete ?? false,
    };
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return {
        ok: false,
        intent,
        message: error.message,
        isLocked: error.status === 409,
        nextLessonId: lockedLessonFrom(error),
      };
    }
    throw error;
  }
}
