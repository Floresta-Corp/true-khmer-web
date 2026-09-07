import type { ActiveLesson, CourseDetail } from "~/features/education/types";

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
    description: "",
    outcomes: [],
    posterUrl: course.coverImageUrl,
    elapsed: "00:00",
  };
}
