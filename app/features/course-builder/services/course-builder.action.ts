import type { Route } from "project-types/course-builder/route/+types/course-builder";
import { z } from "zod";
import {
  createCourse,
  presignCourseCover,
  submitCourseForReview,
  updateCourse,
} from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

/** 5 MiB — the cap the presign endpoint enforces. */
const MAX_COVER_BYTES = 5 * 1024 * 1024;

const CourseFieldsSchema = z.object({
  title: z.string().trim().min(1, "Add a course title.").max(255),
  description: z.string().trim().min(1, "Add a course description.").max(20000),
  categoryId: z.string().uuid("Pick a category."),
  coverImageKey: z.string().min(1).max(600).nullish(),
});

const SaveDraftSchema = CourseFieldsSchema.extend({
  intent: z.literal("save-draft"),
  /** Present once a draft exists, so the save patches instead of creating. */
  courseId: z.string().uuid().optional(),
});

const SubmitSchema = CourseFieldsSchema.extend({
  intent: z.literal("submit"),
  courseId: z.string().uuid().optional(),
});

const PresignCoverSchema = z.object({
  intent: z.literal("presign-cover"),
  contentType: z.string().min(1),
  fileSize: z.coerce.number().int().positive().max(MAX_COVER_BYTES),
});

const FormSchema = z.discriminatedUnion("intent", [
  SaveDraftSchema,
  SubmitSchema,
  PresignCoverSchema,
]);

export async function courseBuilderAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);

  const raw = Object.fromEntries(await request.formData());
  const parsed = FormSchema.safeParse(raw);

  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return withAuthData(
      auth,
      {
        ok: false as const,
        fieldErrors,
        error: formErrors[0] ?? "Check the highlighted fields.",
      },
      { status: 400 },
    );
  }

  if (parsed.data.intent === "presign-cover") {
    const { contentType, fileSize } = parsed.data;
    const result = await presignCourseCover(request, { contentType, fileSize });
    return withAuthData(auth, {
      ok: true as const,
      intent: "presign-cover" as const,
      upload: result.data.upload,
    });
  }

  const { intent, courseId, ...fields } = parsed.data;

  const saved = courseId
    ? await updateCourse(request, courseId, {
        ...fields,
        coverImageKey: fields.coverImageKey ?? null,
      })
    : await createCourse(request, fields);

  const course = saved.data.course;

  if (intent === "submit") {
    const submitted = await submitCourseForReview(request, course.id);
    return withAuthData(auth, {
      ok: true as const,
      intent,
      course: submitted.data.course,
    });
  }

  return withAuthData(auth, { ok: true as const, intent, course });
}
