import type { ReactNode } from "react";
import type {
  ActiveLesson,
  LessonGateState,
  LessonResumePoint,
} from "~/features/education/types";

export interface LessonMediaProps {
  lesson: ActiveLesson;
  overlay?: ReactNode;
  flush?: boolean;
  /**
   * Where this learner left the lesson last time, if they did.
   *
   * The player opens there and counts from the coverage already earned, so a
   * lesson closed half way through is continued rather than begun again.
   */
  resume?: LessonResumePoint | null;
  /**
   * Reports how far the learner is from finishing this lesson.
   *
   * Each player measures its own medium, because only the player knows what
   * was really played — the learner screen just records the verdict.
   */
  onGateChange?: (gate: LessonGateState) => void;
}

export const mediaFrame = (flush?: boolean) => (flush ? "" : "rounded-xl");

export function MediaBar({ children }: { children: ReactNode }) {
  return <div className="bg-[#C4C4CA] px-5 py-4">{children}</div>;
}
