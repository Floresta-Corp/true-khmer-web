import type { ActiveLesson, CourseDetail } from "~/features/education/types";

/**
 * Resolves the lesson the learning screen should open, from the real
 * curriculum.
 *
 * Everything here comes from `GET /courses/:id/curriculum`. The API has no
 * per-lesson description or outcomes — the builder cannot author them — so
 * those stay empty and the learning screen omits both blocks rather than
 * showing invented prose.
 */
export function toActiveLesson(
  course: CourseDetail,
  lessonId: string | null,
): ActiveLesson | null {
  const flattened = course.curriculum.flatMap((section) =>
    section.lessons.map((lesson) => ({ section, lesson })),
  );
  if (flattened.length === 0) return null;

  const position = Math.max(
    0,
    flattened.findIndex((entry) => entry.lesson.id === lessonId),
  );
  const { section, lesson } = flattened[position];

  return {
    ...lesson,
    sectionId: section.id,
    sectionTitle: section.title,
    index: position + 1,
    heading: lesson.title,
    // The API carries no per-lesson description or outcomes — not in the
    // curriculum response, and the builder cannot author them — so these stay
    // empty and the learning screen omits both blocks.
    description: "",
    outcomes: [],
    posterUrl: course.coverImageUrl,
    elapsed: "00:00",
  };
}
