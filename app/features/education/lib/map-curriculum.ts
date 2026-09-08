import type { CourseCurriculumResponse } from "~/api/education/education.server";
import type { CourseSection, LessonType } from "~/features/education/types";
import { formatDuration } from "~/features/education/lib/lesson-media";

type ApiCurriculum = CourseCurriculumResponse["curriculum"];
type ApiLesson = ApiCurriculum["chapters"][number]["lessons"][number];

const LESSON_TYPE: Record<ApiLesson["type"], LessonType> = {
  YOUTUBE: "video",
  PDF: "pdf",
  AUDIO: "audio",
};

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
      pageCount: lesson.pageCount,
    })),
  }));
}
