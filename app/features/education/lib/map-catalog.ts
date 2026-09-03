import type { PublicCourseListItem } from "~/api/education/education.server";
import type { CourseLevel, CourseSummary } from "~/features/education/types";

const LEVEL: Record<
  NonNullable<PublicCourseListItem["difficulty"]>,
  CourseLevel
> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCE: "Advance",
  ALL_LEVELS: "Beginner",
};

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function isRecentlyPublished(publishedAt: string | null) {
  if (!publishedAt) return false;
  const published = new Date(publishedAt).getTime();
  return Number.isFinite(published) && Date.now() - published < NEW_WINDOW_MS;
}

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
