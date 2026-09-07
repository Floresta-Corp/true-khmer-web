import type { ReactNode } from "react";
import type { ActiveLesson } from "~/features/education/types";

export interface LessonMediaProps {
  lesson: ActiveLesson;
  overlay?: ReactNode;
  flush?: boolean;
}

export const mediaFrame = (flush?: boolean) => (flush ? "" : "rounded-xl");

export function MediaBar({ children }: { children: ReactNode }) {
  return <div className="bg-[#C4C4CA] px-5 py-4">{children}</div>;
}
