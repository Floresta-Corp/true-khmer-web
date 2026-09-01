import type { CourseCurriculumResponse } from "~/api/education/education.server";
import type { CourseSection, LessonType } from "~/features/education/types";

type ApiCurriculum = CourseCurriculumResponse["curriculum"];
type ApiLesson = ApiCurriculum["chapters"][number]["lessons"][number];

const LESSON_TYPE: Record<ApiLesson["type"], LessonType> = {
  YOUTUBE: "video",
  PDF: "pdf",
  AUDIO: "audio",
};

/** "08:24" from a duration in seconds; empty when nothing measured it. */
function formatDuration(seconds: number | null) {
  if (!seconds) return "";
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

/** The saved curriculum in the shape the course screens render. */
export function toCourseSections(curriculum: ApiCurriculum): CourseSection[] {
  return curriculum.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      type: LESSON_TYPE[lesson.type],
      duration: formatDuration(lesson.durationSeconds),
      isPreview: lesson.isPreview,
      // Completion is per-learner and the API tracks none yet.
      isComplete: false,
      sourceUrl: lesson.url ?? lesson.assetUrl,
    })),
  }));
}
