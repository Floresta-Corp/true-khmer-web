import { data } from "react-router";
import type { Route } from "project-types/course-builder/route/+types/course-builder.$id";
import {
  getCourseById,
  getCourseCategories,
  getCourseCurriculum,
  getCourseQuiz,
} from "~/api/education/education.server";
import { MY_COURSES_FIXTURES } from "~/features/course-listing/lib/my-courses-fixtures";
import {
  BuilderStepSchema,
  DIFFICULTY_API_VALUE,
  emptyDraft,
  type BuilderSection,
  type CategoryOption,
  type CertificateKind,
  type CourseDifficulty,
  type CourseDraft,
  type CourseFormat,
  type QuizQuestion,
} from "~/features/course-builder/types";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

const DIFFICULTY_FROM_API: Record<
  (typeof DIFFICULTY_API_VALUE)[CourseDifficulty],
  CourseDifficulty
> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCE: "Advance",
  ALL_LEVELS: "All levels",
};

/**
 * The builder opened on an existing course, which is where the teach screen's
 * Content tab sends you. Only the creator edits a course, so this sits behind a
 * session, and `?step=` lets that tab deep-link straight to the curriculum.
 */
export async function courseBuilderEditLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const [categoryResult, courseResult, curriculumResult, quizResult] =
    await Promise.all([
      getCourseCategories(request),
      getCourseById(request, params.id),
      getCourseCurriculum(request, params.id),
      getCourseQuiz(request, params.id),
    ]);

  // The Course Listing placeholders resolve here too, so the screen can be
  // reviewed against the design before the API has courses in it.
  const course =
    courseResult?.data?.course ??
    MY_COURSES_FIXTURES.find((entry) => entry.id === params.id) ??
    null;

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const categories: CategoryOption[] = (
    categoryResult?.data?.categories ?? []
  ).map((category) => ({ value: category.id, label: category.name }));

  // The course model carries the builder's extras, so they round-trip. Reading
  // them back matters: saving replaces them wholesale, so anything not loaded
  // here would be wiped by the next save.
  const saved = course as Partial<{
    difficulty: keyof typeof DIFFICULTY_FROM_API;
    skills: string[];
    tags: string[];
    certificateKind: "PARTICIPATION" | "COMPLETION";
    format: CourseFormat | "MULTI" | "SINGLE";
  }>;

  const draft: CourseDraft = {
    ...emptyDraft(),
    title: course.title,
    description: course.description ?? "",
    categoryId: course.categoryId ?? "",
    coverImageKey: course.coverImageKey ?? null,
    coverPreviewUrl: course.coverImageUrl ?? null,
    difficulty: saved.difficulty ? DIFFICULTY_FROM_API[saved.difficulty] : null,
    skills: Array.isArray(saved.skills) ? saved.skills : [],
    tags: Array.isArray(saved.tags) ? saved.tags : [],
  };

  const certificate: CertificateKind =
    saved.certificateKind === "PARTICIPATION" ? "participation" : "completion";

  const format: CourseFormat = saved.format === "SINGLE" ? "single" : "multi";

  const step = BuilderStepSchema.safeParse(
    new URL(request.url).searchParams.get("step"),
  );

  // The saved curriculum, mapped into the builder's shape. No fixture
  // fallback: a full-replace save would write those fixtures over the real
  // curriculum the next time the creator pressed Save.
  const sections: BuilderSection[] = (
    curriculumResult?.data?.curriculum.chapters ?? []
  ).map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      type:
        lesson.type === "PDF"
          ? ("pdf" as const)
          : lesson.type === "AUDIO"
            ? ("audio" as const)
            : ("video" as const),
      duration: "",
      isPreview: lesson.isPreview,
      isComplete: false,
      url: lesson.url,
      assetKey: lesson.assetKey,
    })),
  }));

  // Whether the saved content actually came back, as opposed to being absent.
  // A save replaces wholesale, so the builder must not send a curriculum it
  // never managed to load — that would delete the real one.
  const curriculumLoaded = Boolean(curriculumResult?.data?.curriculum);
  const quizLoaded = Boolean(quizResult?.data?.quiz);

  const quiz = quizResult?.data?.quiz ?? null;
  const questions: QuizQuestion[] = (quiz?.questions ?? []).map((question) => ({
    id: question.id,
    text: question.question,
    answers: question.options.map((option) => ({
      id: option.id,
      text: option.label,
      correct: option.isCorrect,
    })),
  }));

  return withAuthData(auth, {
    categories,
    draft,
    sections,
    courseStatus: course.status,
    curriculumLoaded,
    quizLoaded,
    certificate,
    format,
    passMark: String(quiz?.passMark ?? 70),
    questions,
    courseId: course.id,
    step: step.success ? step.data : "basic",
  });
}
