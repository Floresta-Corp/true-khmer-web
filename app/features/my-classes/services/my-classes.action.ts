import type { Route } from "project-types/my-classes/route/+types/my-classes";
import { z } from "zod";
import {
  leaveCourse,
  saveCourse,
  unsaveCourse,
} from "~/api/education/my-classes.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { MyClassIntentSchema } from "~/features/my-classes/types";

const FormSchema = z.object({
  intent: MyClassIntentSchema,
  courseId: z.string().uuid(),
});

export async function myClassesAction({ request }: Route.ActionArgs) {
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
    if (intent === "save") await saveCourse(request, courseId);
    if (intent === "unsave") await unsaveCourse(request, courseId);
    if (intent === "leave") await leaveCourse(request, courseId);
  } catch (error) {
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

  return withAuthData(auth, { ok: true as const, intent });
}
