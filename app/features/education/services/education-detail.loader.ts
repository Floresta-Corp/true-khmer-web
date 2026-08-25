import { data } from "react-router";
import type { Route as EducationDetailRoute } from "project-types/education/route/+types/education.$id";
import {
  getCourseById,
  getCourseCategories,
} from "~/api/education/education.server";
import {
  CATALOG_COURSES,
  enrichCourseDetail,
} from "~/features/education/lib/education-fixtures";
import type { CourseDetail, CourseSummary } from "~/features/education/types";

/**
 * Resolves a course into the full detail shape.
 *
 * `GET /education-center/courses/:id` supplies title, description, cover and
 * price. Instructor, rating, curriculum, reviews and enrolment come from the
 * fixtures until those resources exist. Fixture-only ids (the hub catalog)
 * short-circuit the API call.
 */
export async function loadCourseDetail(
  request: Request,
  courseId: string,
): Promise<CourseDetail | null> {
  const fixture = CATALOG_COURSES.find((course) => course.id === courseId);
  if (fixture) return enrichCourseDetail(fixture);

  const [courseRes, categoriesRes] = await Promise.all([
    getCourseById(request, courseId),
    getCourseCategories(request),
  ]);

  const course = courseRes?.data?.course;
  if (!course) return null;

  const categoryName =
    categoriesRes?.data?.categories?.find((c) => c.id === course.categoryId)
      ?.name ?? "Course";

  const base: CourseSummary = {
    id: course.id,
    title: course.title,
    description: course.description,
    categoryId: course.categoryId,
    categoryName,
    coverImageUrl: course.coverImageUrl,
    // Not yet returned by the API — see education-fixtures.
    instructor: {
      id: course.createdBy,
      name: "True Khmer Instructor",
      avatarUrl: "/images/avatar_placeholder.webp",
      coursesPublished: 1,
    },
    rating: 4.7,
    ratingCount: 0,
    level: "Beginner",
    lessonCount: 0,
    studentCount: 0,
    isNew: false,
    price: course.price,
    isSaved: false,
  };

  return { ...enrichCourseDetail(base), status: course.status };
}

export async function educationDetailLoader({
  request,
  params,
}: EducationDetailRoute.LoaderArgs) {
  const course = await loadCourseDetail(request, params.id);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  return { course };
}
