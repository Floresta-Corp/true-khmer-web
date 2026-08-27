import { data } from "react-router";
import type { Route } from "project-types/course-builder/route/+types/course-builder.$id";
import {
  getCourseById,
  getCourseCategories,
} from "~/api/education/education.server";
import { MY_COURSES_FIXTURES } from "~/features/course-listing/lib/my-courses-fixtures";
import { buildManageOverview } from "~/features/course-manage/lib/course-manage-fixtures";
import { enrichCourseDetail } from "~/features/education/lib/education-fixtures";
import {
  BuilderStepSchema,
  emptyDraft,
  type CategoryOption,
  type CourseDraft,
} from "~/features/course-builder/types";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

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

  const [categoryResult, courseResult] = await Promise.all([
    getCourseCategories(request),
    getCourseById(request, params.id),
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

  // Difficulty, skills and tags have no field on the API's course model, so
  // they start empty rather than pretending to round-trip.
  const draft: CourseDraft = {
    ...emptyDraft(),
    title: course.title,
    description: course.description ?? "",
    categoryId: course.categoryId ?? "",
    coverPreviewUrl: course.coverImageUrl ?? null,
  };

  const step = BuilderStepSchema.safeParse(
    new URL(request.url).searchParams.get("step"),
  );

  // Same builder the teach screen and the learner detail use, so the curriculum
  // the Content tab shows is the curriculum the builder opens. There is no
  // curriculum resource on the API, so edits to it are not persisted.
  const { curriculum } = enrichCourseDetail({
    id: course.id,
    title: course.title,
    description: course.description,
    categoryId: course.categoryId,
    categoryName: "Business",
    coverImageUrl: course.coverImageUrl,
    instructor: {
      id: course.createdBy,
      name: "Kosal Em",
      avatarUrl: "/images/education/instructors/kosal-em.jpg",
      coursesPublished: 3,
    },
    rating: 0,
    ratingCount: 0,
    level: "Beginner",
    // The same lesson count the teach screen derives, so both surfaces show
    // the same chapters instead of the fixture default.
    lessonCount: buildManageOverview(course).lessonCount,
    studentCount: 0,
    isNew: false,
    price: course.price,
    isSaved: false,
  });

  return withAuthData(auth, {
    categories,
    draft,
    sections: curriculum,
    courseId: course.id,
    step: step.success ? step.data : "basic",
  });
}
