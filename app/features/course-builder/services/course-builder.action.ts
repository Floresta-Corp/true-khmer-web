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
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

/** 5 MiB — the cap the presign endpoint enforces. */
const MAX_COVER_BYTES = 5 * 1024 * 1024;

/**
 * The wizard posts its curriculum, quiz and meta as JSON strings alongside the
 * flat form fields, since a `FormData` body cannot carry nested arrays.
 */
const LessonSchema = z.object({
  title: z.string().trim().min(1).max(255),
  type: z.enum(["YOUTUBE", "PDF", "AUDIO"]),
  url: z.string().trim().url().max(2000).nullish(),
  assetKey: z.string().trim().min(1).max(600).nullish(),
  durationSeconds: z.number().int().nonnegative().nullish(),
  isPreview: z.boolean().optional(),
});

const CurriculumSchema = z.object({
  format: z.enum(["MULTI", "SINGLE"]),
  chapters: z.array(
    z.object({
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
  tags: z.array(z.string().trim().min(1).max(80)).optional(),
  certificateKind: z.enum(["PARTICIPATION", "COMPLETION"]).nullish(),
});

/** Parses one of the JSON side-channel fields, ignoring anything malformed. */
function readJsonField<T>(raw: unknown, schema: z.ZodType<T>): T | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const CourseFieldsSchema = z.object({
  title: z.string().trim().min(1, "Add a course title.").max(255),
  description: z.string().trim().min(1, "Add a course description.").max(20000),
  categoryId: z.string().uuid("Pick a category."),
  coverImageKey: z.string().min(1).max(600).nullish(),
});

/** JSON side-channel carried by both save and submit. */
const ContentFieldsSchema = z.object({
  curriculum: z.string().optional(),
  quiz: z.string().optional(),
  meta: z.string().optional(),
});

const SaveDraftSchema = CourseFieldsSchema.merge(ContentFieldsSchema).extend({
  intent: z.literal("save-draft"),
  /** Present once a draft exists, so the save patches instead of creating. */
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

/** 100 MiB — the cap the lesson presign endpoint enforces. */
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

  if (parsed.data.intent === "presign-lesson") {
    const { contentType, fileSize } = parsed.data;
    const result = await presignLessonAsset(request, { contentType, fileSize });
    return withAuthData(auth, {
      ok: true as const,
      intent: "presign-lesson" as const,
      upload: result.data.upload,
    });
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

  const {
    intent,
    courseId,
    curriculum: rawCurriculum,
    quiz: rawQuiz,
    meta: rawMeta,
    ...fields
  } = parsed.data;

  const saved = courseId
    ? await updateCourse(request, courseId, {
        ...fields,
        coverImageKey: fields.coverImageKey ?? null,
      })
    : await createCourse(request, fields);

  let course = saved.data.course;

  // The course row has to exist before its curriculum can hang off it, so the
  // rest of the wizard is saved here rather than in the same request.
  const meta = readJsonField(rawMeta, MetaSchema);
  if (meta) {
    const updated = await updateCourseMeta(request, course.id, meta);
    course = updated.data.course;
  }

  const curriculum = readJsonField(rawCurriculum, CurriculumSchema);
  if (curriculum) {
    await replaceCourseCurriculum(request, course.id, curriculum);
  }

  const quiz = readJsonField(rawQuiz, QuizSchema);
  if (quiz) {
    await replaceCourseQuiz(request, course.id, quiz);
  }

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
