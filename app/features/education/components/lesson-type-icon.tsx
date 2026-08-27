import { File, SquarePlay, Volume2 } from "lucide-react";
import { cn } from "~/lib/utils";
import type { LessonType } from "~/features/education/types";

/** The design uses a play-in-square, a plain page and a speaker. */
const ICONS = {
  video: SquarePlay,
  pdf: File,
  audio: Volume2,
} as const;

export function LessonTypeIcon({
  type,
  className,
}: {
  type: LessonType;
  className?: string;
}) {
  const Icon = ICONS[type];
  return <Icon className={cn("size-4", className)} aria-hidden />;
}
