import type { ActiveLesson, CourseDetail } from "~/features/education/types";

/**
 * The lesson the learner screen should play.
 *
 * `lessonId` is what the address bar asked for and `resumeLessonId` is where
 * the course has got to, used when nothing was asked for — so returning to a
 * half-finished course picks up where it stopped rather than at lesson one.
 *
 * A locked lesson is never returned. The loader already redirects a request
 * for one, and this is the second half of that promise: whatever the callers
 * pass in, the player is only ever handed something the learner may open.
 */
export function toActiveLesson(
  course: CourseDetail,
  lessonId: string | null,
  resumeLessonId?: string | null,
): ActiveLesson | null {
  const flattened = course.curriculum.flatMap((section) =>
    section.lessons.map((lesson) => ({ section, lesson })),
  );
  if (flattened.length === 0) return null;

  const indexOf = (id: string | null | undefined) =>
    id ? flattened.findIndex((entry) => entry.lesson.id === id) : -1;

  const firstOpen = flattened.findIndex((entry) => !entry.lesson.isLocked);

  const candidates = [indexOf(lessonId), indexOf(resumeLessonId), firstOpen, 0];
  const position =
    candidates.find(
      (index) => index >= 0 && !flattened[index].lesson.isLocked,
    ) ??
    candidates.find((index) => index >= 0) ??
    0;

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
