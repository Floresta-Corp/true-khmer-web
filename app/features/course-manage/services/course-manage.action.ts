import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import { z } from "zod";
import {
  messageCourseStudent,
  removeCourseStudent,
} from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
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

const FormSchema = z.discriminatedUnion("intent", [
  RemoveSchema,
  MessageSchema,
]);

/** The Students tab's row actions. Both are creator-only, enforced by the API. */
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
