import { AudioLesson } from "./audio-lesson";
import { PdfLesson } from "./pdf-lesson";
import { VideoLesson } from "./video-lesson";
import type { LessonMediaProps } from "./lesson-media-frame";

export type { LessonMediaProps };

export function LessonPlayer({ lesson, overlay, flush }: LessonMediaProps) {
  if (lesson.type === "pdf")
    return <PdfLesson lesson={lesson} overlay={overlay} flush={flush} />;
  if (lesson.type === "audio")
    return <AudioLesson lesson={lesson} overlay={overlay} flush={flush} />;
  return <VideoLesson lesson={lesson} overlay={overlay} flush={flush} />;
}
