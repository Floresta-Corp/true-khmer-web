import { FileText, Music, PlayCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import type { LessonType } from "~/features/education/types";

const ICONS = {
  video: PlayCircle,
  pdf: FileText,
  audio: Music,
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
