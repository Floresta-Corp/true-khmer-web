import type { Route } from "project-types/course-listing/route/+types/course-listing";
import { z } from "zod";
import {
  submitCourseForReview,
  unpublishCourse,
  withdrawCourse,
} from "~/api/education/education.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

const IntentSchema = z.enum(["submit", "withdraw", "unpublish"]);

const FormSchema = z.object({
  intent: IntentSchema,
  courseId: z.string().uuid(),
});

/** Status changes offered by the row's overflow menu. */
export async function courseListingAction({ request }: Route.ActionArgs) {
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

  const { intent, courseId } = parsed.data;

  try {
    if (intent === "submit") await submitCourseForReview(request, courseId);
    if (intent === "withdraw") await withdrawCourse(request, courseId);
    if (intent === "unpublish") await unpublishCourse(request, courseId);
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

    console.error(`Failed to ${intent} a course`, error);
    return withAuthData(
      auth,
      { ok: false as const, error: "That change could not be saved." },
      { status: 500 },
    );
  }

  return withAuthData(auth, { ok: true as const });
}
