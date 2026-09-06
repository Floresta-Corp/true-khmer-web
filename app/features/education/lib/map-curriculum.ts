import type { CourseCurriculumResponse } from "~/api/education/education.server";
import type { CourseSection, LessonType } from "~/features/education/types";

type ApiCurriculum = CourseCurriculumResponse["curriculum"];
type ApiLesson = ApiCurriculum["chapters"][number]["lessons"][number];

const LESSON_TYPE: Record<ApiLesson["type"], LessonType> = {
  YOUTUBE: "video",
  PDF: "pdf",
  AUDIO: "audio",
};

/**
 * "9:12", and "1:02:05" once a lesson runs past an hour.
 *
 * Minutes are unpadded at the front, as the design writes them, but padded
 * after an hours part so "1:2:05" cannot happen. The previous version padded
 * minutes always ("09:12") and had no hours case, so a 62-minute lesson read
 * as "62:05".
 */
function formatDuration(seconds: number | null) {
  if (!seconds || seconds < 0) return "";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(rest)}`
    : `${minutes}:${pad(rest)}`;
}

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
      isComplete: false,
      sourceUrl: lesson.url ?? lesson.assetUrl,
    })),
  }));
}
