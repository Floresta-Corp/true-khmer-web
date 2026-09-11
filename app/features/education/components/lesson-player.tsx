import { AudioLesson } from "./audio-lesson";
import { PdfLesson } from "./pdf-lesson";
import { VideoLesson } from "./video-lesson";
import type { LessonMediaProps } from "./lesson-media-frame";

export type { LessonMediaProps };

/**
 * The player for whichever medium the lesson is.
 *
 * Keyed on the lesson, so changing lesson builds a new player rather than
 * handing the old one a new file. Players hold state that describes one piece
 * of media — whether it reached its end, how long it is, whether it failed —
 * and that state is reset in effects, which run *after* the render that
 * swapped the lesson in. Without the key, that one render computes the new
 * lesson's gate from the old lesson's state: a finished lesson leaves
 * `hasEnded` true, the gate reports the next lesson as already watched, and
 * the learner screen records it as finished the moment they arrive — which
 * quietly unlocks the lesson after it and undoes the whole sequence.
 */
export function LessonPlayer(props: LessonMediaProps) {
  const key = props.lesson.id;

  if (props.lesson.type === "pdf") return <PdfLesson key={key} {...props} />;
  if (props.lesson.type === "audio")
    return <AudioLesson key={key} {...props} />;
  return <VideoLesson key={key} {...props} />;
}
