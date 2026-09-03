import type { Route } from "project-types/course-builder/route/+types/course-builder";
import { z } from "zod";
import {
  createCourse,
  presignCourseCover,
  presignLessonAsset,
  replaceCourseCurriculum,
  replaceCourseQuiz,
  submitCourseForReview,
  updateCourse,
  updateCourseMeta,
} from "~/api/education/education.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

const MAX_COVER_BYTES = 5 * 1024 * 1024;

const LessonSchema = z.object({
  id: z.string().uuid().nullish(),
  title: z.string().trim().min(1).max(255),
  type: z.enum(["YOUTUBE", "PDF", "AUDIO"]),
  url: z
    .string()
    .trim()
    .url()
    .max(2000)
    .refine((value) => /^https?:\/\//i.test(value), {
      message: "must be an http or https link",
    })
    .nullish(),
  assetKey: z.string().trim().min(1).max(600).nullish(),
  durationSeconds: z.number().int().nonnegative().nullish(),
  isPreview: z.boolean().optional(),
});

const CurriculumSchema = z.object({
  format: z.enum(["MULTI", "SINGLE"]),
  chapters: z.array(
    z.object({
      id: z.string().uuid().nullish(),
      title: z.string().trim().min(1).max(255),
      lessons: z.array(LessonSchema),
    }),
  ),
});

const QuizSchema = z.object({
  passMark: z.number().int().min(0).max(100),
  questions: z.array(
    z.object({
      question: z.string().trim().min(1).max(2000),
      options: z
        .array(
          z.object({
            label: z.string().trim().min(1).max(500),
            isCorrect: z.boolean(),
          }),
        )
        .min(2),
    }),
  ),
});

const MetaSchema = z.object({
  difficulty: z
    .enum(["BEGINNER", "INTERMEDIATE", "ADVANCE", "ALL_LEVELS"])
    .nullish(),
  skills: z.array(z.string().trim().min(1).max(80)).optional(),
  outcomes: z.array(z.string().trim().min(1).max(300)).optional(),
  tags: z.array(z.string().trim().min(1).max(80)).optional(),
  certificateKind: z.enum(["PARTICIPATION", "COMPLETION"]).nullish(),
});

type JsonFieldResult<T> =
  | { status: "absent" }
  | { status: "ok"; value: T }
  | { status: "invalid"; message: string };

function readJsonField<T>(
  raw: unknown,
  schema: z.ZodType<T>,
  label: string,
): JsonFieldResult<T> {
  if (typeof raw !== "string" || raw.trim() === "") return { status: "absent" };

  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return { status: "invalid", message: `Could not read the ${label}.` };
  }

  const parsed = schema.safeParse(decoded);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      status: "invalid",
      message: issue
        ? `${label}: ${issue.path.join(".") || "value"} — ${issue.message}`
        : `The ${label} is not valid.`,
    };
  }

  return { status: "ok", value: parsed.data };
}

const CourseFieldsSchema = z.object({
  title: z.string().trim().min(1, "Add a course title.").max(255),
  description: z.string().trim().min(1, "Add a course description.").max(20000),
  categoryId: z.string().uuid("Pick a category."),
  coverImageKey: z.string().min(1).max(600).nullish(),
});

const ContentFieldsSchema = z.object({
  curriculum: z.string().optional(),
  quiz: z.string().optional(),
  meta: z.string().optional(),
});

const SaveDraftSchema = CourseFieldsSchema.merge(ContentFieldsSchema).extend({
  intent: z.literal("save-draft"),
  courseId: z.string().uuid().optional(),
});

const SubmitSchema = CourseFieldsSchema.merge(ContentFieldsSchema).extend({
  intent: z.literal("submit"),
  courseId: z.string().uuid().optional(),
});

const PresignCoverSchema = z.object({
  intent: z.literal("presign-cover"),
  contentType: z.string().min(1),
  fileSize: z.coerce.number().int().positive().max(MAX_COVER_BYTES),
});

const MAX_LESSON_ASSET_BYTES = 100 * 1024 * 1024;

const PresignLessonSchema = z.object({
  intent: z.literal("presign-lesson"),
  contentType: z.string().min(1),
  fileSize: z.coerce.number().int().positive().max(MAX_LESSON_ASSET_BYTES),
});

const FormSchema = z.discriminatedUnion("intent", [
  SaveDraftSchema,
  SubmitSchema,
  PresignCoverSchema,
  PresignLessonSchema,
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

  const refusedUpload = (error: unknown, noun: string) => {
    if (error instanceof ProtectedApiError && error.status < 500) {
      return withAuthData(
        auth,
        { ok: false as const, fieldErrors: {}, error: error.message },
        { status: error.status },
      );
    }

    console.error(`Failed to presign a ${noun} upload`, error);
    return withAuthData(
      auth,
      {
        ok: false as const,
        fieldErrors: {},
        error: `That ${noun} could not be prepared for upload. Try again.`,
      },
      { status: 502 },
    );
  };

  if (parsed.data.intent === "presign-lesson") {
    const { contentType, fileSize } = parsed.data;
    try {
      const result = await presignLessonAsset(request, {
        contentType,
        fileSize,
      });
      return withAuthData(auth, {
        ok: true as const,
        intent: "presign-lesson" as const,
        upload: result.data.upload,
      });
    } catch (error) {
      return refusedUpload(error, "file");
    }
  }

  if (parsed.data.intent === "presign-cover") {
    const { contentType, fileSize } = parsed.data;
    try {
      const result = await presignCourseCover(request, {
        contentType,
        fileSize,
      });
      return withAuthData(auth, {
        ok: true as const,
        intent: "presign-cover" as const,
        upload: result.data.upload,
      });
    } catch (error) {
      return refusedUpload(error, "image");
    }
  }

  const {
    intent,
    courseId,
    curriculum: rawCurriculum,
    quiz: rawQuiz,
    meta: rawMeta,
    ...fields
  } = parsed.data;

  const meta = readJsonField(rawMeta, MetaSchema, "course details");
  const curriculum = readJsonField(
    rawCurriculum,
    CurriculumSchema,
    "curriculum",
  );
  const quiz = readJsonField(rawQuiz, QuizSchema, "quiz");

  const invalid = [meta, curriculum, quiz].find(
    (field) => field.status === "invalid",
  );
  if (invalid && invalid.status === "invalid") {
    return withAuthData(
      auth,
      {
        ok: false as const,
        fieldErrors: {},
        error: invalid.message,
        courseId,
      },
      { status: 400 },
    );
  }

  let saved;
  try {
    saved = courseId
      ? await updateCourse(request, courseId, {
          ...fields,
          coverImageKey: fields.coverImageKey ?? null,
        })
      : await createCourse(request, fields);
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status < 500) {
      return withAuthData(
        auth,
        {
          ok: false as const,
          fieldErrors: {},
          error: error.message,
          courseId,
        },
        { status: error.status },
      );
    }
    throw error;
  }

  let course = saved.data.course;

  const failed = (error: ProtectedApiError) =>
    withAuthData(
      auth,
      {
        ok: false as const,
        fieldErrors: {},
        error: error.message,
        courseId: course.id,
      },
      { status: error.status },
    );

  try {
    if (meta.status === "ok") {
      const updated = await updateCourseMeta(request, course.id, meta.value);
      course = updated.data.course;
    }

    if (curriculum.status === "ok") {
      await replaceCourseCurriculum(request, course.id, curriculum.value);
    }

    if (quiz.status === "ok") {
      await replaceCourseQuiz(request, course.id, quiz.value);
    }

    if (intent === "submit") {
      const submitted = await submitCourseForReview(request, course.id);
      return withAuthData(auth, {
        ok: true as const,
        intent,
        course: submitted.data.course,
      });
    }
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status < 500) {
      return failed(error);
    }
    throw error;
  }

  return withAuthData(auth, { ok: true as const, intent, course });
}
