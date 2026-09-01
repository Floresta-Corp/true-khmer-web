import { data } from "react-router";
import type { Route as EducationDetailRoute } from "project-types/education/route/+types/education.$id";
import {
  getCourseById,
  getCourseCategories,
  getCourseCurriculum,
} from "~/api/education/education.server";
import { toCourseSections } from "~/features/education/lib/map-curriculum";
import type { CourseDetail, CourseSummary } from "~/features/education/types";

/**
 * Resolves a course into the full detail shape, entirely from the API.
 *
 * Anything the API has no resource for — ratings, reviews, enrolment, course
 * duration — is reported as absent rather than filled with sample content, so
 * the page never shows a learner a number nobody recorded.
 */
export async function loadCourseDetail(
  request: Request,
  courseId: string,
): Promise<CourseDetail | null> {
  const [courseRes, categoriesRes, curriculumRes] = await Promise.all([
    getCourseById(request, courseId),
    getCourseCategories(request),
    getCourseCurriculum(request, courseId),
  ]);

  const course = courseRes?.data?.course;
  if (!course) return null;

  const categoryName =
    categoriesRes?.data?.categories?.find((c) => c.id === course.categoryId)
      ?.name ?? "Course";

  const sections = curriculumRes?.data?.curriculum
    ? toCourseSections(curriculumRes.data.curriculum)
    : [];

  const lessonCount = curriculumRes?.data?.curriculum.lessonCount ?? 0;
  const creator = (course as { creator?: { id: string; name: string } | null })
    .creator;

  const skills = Array.isArray((course as { skills?: string[] }).skills)
    ? ((course as { skills?: string[] }).skills as string[])
    : [];

  const difficulty = (course as { difficulty?: string | null }).difficulty;
  const level: CourseSummary["level"] =
    difficulty === "INTERMEDIATE"
      ? "Intermediate"
      : difficulty === "ADVANCE"
        ? "Advance"
        : "Beginner";

  const summary: CourseSummary = {
    id: course.id,
    title: course.title,
    description: course.description,
    categoryId: course.categoryId,
    categoryName,
    coverImageUrl: course.coverImageUrl,
    instructor: {
      id: creator?.id ?? course.createdBy,
      name: creator?.name ?? "Unknown instructor",
      avatarUrl: null,
      coursesPublished: 0,
    },
    // Ratings, enrolment and reviews have no API resource, so they stay at
    // zero rather than being invented.
    rating: 0,
    ratingCount: 0,
    level,
    lessonCount,
    studentCount: 0,
    isNew: false,
    price: course.price,
    isSaved: false,
  };

  return {
    ...summary,
    // Only facts the API actually knows. Duration and rating are omitted
    // entirely rather than shown as placeholders.
    meta: [
      {
        label: "LESSONS",
        value: `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`,
      },
      { label: "LEVEL", value: level },
      {
        label: "PRICE",
        value: course.price > 0 ? `$${course.price.toFixed(2)}` : "Free",
      },
    ],
    // "What you'll learn" is the creator's own skills list from the builder.
    outcomes: skills,
    curriculum: sections,
    reviews: [],
    reviewCount: 0,
    enrolledCount: 0,
    isEnrolled: false,
    progressPercent: 0,
    status: course.status,
  };
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
