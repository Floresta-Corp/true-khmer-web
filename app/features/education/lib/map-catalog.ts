import type { PublicCourseListItem } from "~/api/education/education.server";
import { resolveImageURL } from "~/lib/utils";
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

/* The web deploys independently of the API, so a catalogue payload from an API
   that predates the rating/learner counts must degrade to zeroes rather than
   throw and blank the whole page. */
function readRating(rating: PublicCourseListItem["rating"] | undefined) {
  return { average: rating?.average ?? 0, total: rating?.total ?? 0 };
}

export function toCourseSummary(course: PublicCourseListItem): CourseSummary {
  const rating = readRating(course.rating);

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
      avatarUrl: course.creator?.avatarKey
        ? resolveImageURL(course.creator.avatarKey)
        : null,
      coursesPublished: 0,
      phone: null,
      email: course.creator?.email ?? null,
    },
    /* Zero, not null, once it reaches the card: an unrated course carries no
       average, and the card reads `ratingCount` to tell that apart from 0.0. */
    rating: rating.average,
    ratingCount: rating.total,
    level: course.difficulty ? LEVEL[course.difficulty] : "Beginner",
    lessonCount: course.lessonCount,
    studentCount: course.studentCount ?? 0,
    isNew: isRecentlyPublished(course.publishedAt),
    price: course.price,
    isSaved: false,
  };
}
