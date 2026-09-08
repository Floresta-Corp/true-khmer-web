import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import { z } from "zod";
import {
  deleteCourse,
  messageCourseStudent,
  removeCourseStudent,
  unpublishCourse,
} from "~/api/education/education.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

const RemoveSchema = z.object({
  intent: z.literal("remove-student"),
  userId: z.string().uuid(),
});

const MessageSchema = z.object({
  intent: z.literal("message-student"),
  userId: z.string().uuid(),
  subject: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(2000),
});

/* The header's overflow menu. Both are creator-only, enforced by the API. */
const UnpublishSchema = z.object({ intent: z.literal("unpublish") });

const DeleteSchema = z.object({ intent: z.literal("delete-course") });

const FormSchema = z.discriminatedUnion("intent", [
  RemoveSchema,
  MessageSchema,
  UnpublishSchema,
  DeleteSchema,
]);

/** The Students tab's row actions and the course's own status actions. */
export async function courseManageAction({
  request,
  params,
}: Route.ActionArgs) {
  const auth = await requireUser(request);

  const parsed = FormSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );

  if (!parsed.success) {
    return withAuthData(
      auth,
      { ok: false as const, error: "That action is not available." },
      { status: 400 },
    );
  }

  const form = parsed.data;

  if (form.intent === "unpublish" || form.intent === "delete-course") {
    try {
      if (form.intent === "delete-course") {
        await deleteCourse(request, params.id);
        /* The page this menu sits on is gone with the course, so leave for the
           listing rather than revalidating a course that no longer exists. */
        return withAuthRedirect(auth, "/course-listing");
      }

      await unpublishCourse(request, params.id);
    } catch (error) {
      // The API refuses transitions its state machine does not allow, and that
      // reason is the useful part — do not bury it under a generic message.
      if (error instanceof ProtectedApiError && error.status < 500) {
        return withAuthData(
          auth,
          { ok: false as const, error: error.message },
          { status: error.status },
        );
      }

      console.error(`Failed to ${form.intent} a course`, error);
      return withAuthData(
        auth,
        { ok: false as const, error: "That change could not be saved." },
        { status: 500 },
      );
    }

    return withAuthData(auth, {
      ok: true as const,
      intent: form.intent,
      message: "Course unpublished.",
    });
  }

  try {
    if (form.intent === "remove-student") {
      await removeCourseStudent(request, params.id, form.userId);
      return withAuthData(auth, {
        ok: true as const,
        intent: form.intent,
        message: "Student removed from the course.",
      });
    }

    await messageCourseStudent(request, params.id, form.userId, {
      subject: form.subject,
      body: form.body,
    });

    return withAuthData(auth, {
      ok: true as const,
      intent: form.intent,
      message: "Message sent.",
    });
  } catch {
    return withAuthData(
      auth,
      { ok: false as const, error: "That change could not be saved." },
      { status: 500 },
    );
  }
}
