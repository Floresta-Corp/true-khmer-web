import type { PublicCourseListItem } from "~/api/education/education.server";
import type { CourseLevel, CourseSummary } from "~/features/education/types";

const LEVEL: Record<
  NonNullable<PublicCourseListItem["difficulty"]>,
  CourseLevel
> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCE: "Advance",
  // The card shows one level and "All levels" is not one of them; Beginner is
  // the least misleading of the three for a course open to anyone.
  ALL_LEVELS: "Beginner",
};

/** Published within the last 30 days earns the green "New" badge. */
const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function isRecentlyPublished(publishedAt: string | null) {
  if (!publishedAt) return false;
  const published = new Date(publishedAt).getTime();
  return Number.isFinite(published) && Date.now() - published < NEW_WINDOW_MS;
}

/**
 * A catalogue row in the shape the course cards render.
 *
 * Ratings and enrolment have no API resource, so they stay at zero rather than
 * being invented; the instructor is the course's real creator.
 */
export function toCourseSummary(course: PublicCourseListItem): CourseSummary {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    categoryId: course.categoryId,
    categoryName: course.categoryName ?? "Course",
    coverImageUrl: course.coverImageUrl,
    instructor: {
      id: course.creator?.id ?? "",
      name: course.creator?.name ?? "Unknown instructor",
      avatarUrl: null,
      coursesPublished: 0,
      // The list response carries no phone; the detail loader fetches it.
      phone: null,
      email: course.creator?.email ?? null,
    },
    rating: 0,
    ratingCount: 0,
    level: course.difficulty ? LEVEL[course.difficulty] : "Beginner",
    lessonCount: course.lessonCount,
    studentCount: 0,
    isNew: isRecentlyPublished(course.publishedAt),
    type: "course",
    price: course.price,
    isSaved: false,
  };
}
