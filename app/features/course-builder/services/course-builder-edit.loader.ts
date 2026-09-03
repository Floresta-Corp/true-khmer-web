import { data } from "react-router";
import type { Route } from "project-types/course-builder/route/+types/course-builder.$id";
import {
  getCourseById,
  getCourseCategories,
  readCourseCurriculum,
  readCourseQuiz,
} from "~/api/education/education.server";
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

export async function courseBuilderEditLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const [categoryResult, courseResult, curriculumResult, quizResult] =
    await Promise.all([
      getCourseCategories(request),
      getCourseById(request, params.id),
      readCourseCurriculum(request, params.id),
      readCourseQuiz(request, params.id),
    ]);

  const course = courseResult?.data?.course ?? null;

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const categories: CategoryOption[] = (
    categoryResult?.data?.categories ?? []
  ).map((category) => ({ value: category.id, label: category.name }));

  const saved = course as Partial<{
    difficulty: keyof typeof DIFFICULTY_FROM_API;
    skills: string[];
    outcomes: string[];
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
    outcomes:
      Array.isArray(saved.outcomes) && saved.outcomes.length > 0
        ? saved.outcomes
        : [""],
    tags: Array.isArray(saved.tags) ? saved.tags : [],
  };

  const certificate: CertificateKind =
    saved.certificateKind === "PARTICIPATION" ? "participation" : "completion";

  const format: CourseFormat = saved.format === "SINGLE" ? "single" : "multi";

  const step = BuilderStepSchema.safeParse(
    new URL(request.url).searchParams.get("step"),
  );

  const savedCurriculum =
    curriculumResult.status === "loaded"
      ? curriculumResult.result.data.curriculum
      : null;

  const sections: BuilderSection[] = (savedCurriculum?.chapters ?? []).map(
    (chapter) => ({
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
    }),
  );

  const canReplaceCurriculum = curriculumResult.status !== "unreadable";
  const canReplaceQuiz = quizResult.status !== "unreadable";

  const quiz =
    quizResult.status === "loaded" ? quizResult.result.data.quiz : null;
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
    canReplaceCurriculum,
    canReplaceQuiz,
    certificate,
    format,
    passMark: String(quiz?.passMark ?? 70),
    questions,
    courseId: course.id,
    step: step.success ? step.data : "basic",
  });
}
