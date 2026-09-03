import { data } from "react-router";

import {
  approveCourse,
  rejectCourse,
  setCoursePublication,
} from "~/api/admin/education-center/education-center.server";
import {
  REJECTION_NOTE_MAX_LENGTH,
  type CourseReviewIntent,
} from "~/features/admin/manage-education/types";

export {
  isCourseReviewIntent,
  type CourseReviewIntent,
} from "~/features/admin/manage-education/types";

const SUCCESS_MESSAGE: Record<CourseReviewIntent, string> = {
  approveCourse: "Course approved and published.",
  rejectCourse: "Course rejected and sent back to its creator.",
  publishCourse: "Course published.",
  unpublishCourse: "Course unpublished.",
};

/**
 * Shared by the queue and the detail route so both surfaces answer the same
 * intents with the same messages.
 */
export async function handleCourseReviewIntent(
  request: Request,
  accessToken: string,
  formData: FormData,
  intent: CourseReviewIntent,
  cookieHeader: { headers?: { "Set-Cookie": string } },
) {
  const courseId = String(formData.get("courseId") ?? "").trim();

  if (!courseId) {
    return data(
      { ok: false, message: "Course ID is required" },
      { status: 400, ...cookieHeader },
    );
  }

  if (intent === "rejectCourse") {
    const note = String(formData.get("note") ?? "").trim();

    if (note.length > REJECTION_NOTE_MAX_LENGTH) {
      return data(
        {
          ok: false,
          message: `The reason must be ${REJECTION_NOTE_MAX_LENGTH} characters or fewer.`,
        },
        { status: 400, ...cookieHeader },
      );
    }

    // The API takes the note as optional but rejects an empty string, so an
    // unwritten reason is sent as no note at all.
    const result = await rejectCourse(
      request,
      accessToken,
      courseId,
      note || undefined,
    );

    return data(
      {
        ok: true,
        intent,
        courseId,
        status: result.course.status,
        message: SUCCESS_MESSAGE[intent],
      },
      cookieHeader,
    );
  }

  const result =
    intent === "approveCourse"
      ? await approveCourse(request, accessToken, courseId)
      : await setCoursePublication(
          request,
          accessToken,
          courseId,
          intent === "publishCourse" ? "PUBLISH" : "UNPUBLISH",
        );

  return data(
    {
      ok: true,
      intent,
      courseId,
      status: result.course.status,
      message: SUCCESS_MESSAGE[intent],
    },
    cookieHeader,
  );
}
