import type { CourseLesson } from "~/features/education/types";

export function pdfEmbedUrl(src: string): string {
  try {
    const url = new URL(src);
    url.hash = "toolbar=0&navpanes=0";
    return url.href;
  } catch {
    return src;
  }
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds < 0) return "";
  return formatClock(seconds);
}

export function formatPageCount(
  count: number | null | undefined,
): string | null {
  if (!count || !Number.isInteger(count) || count < 1) return null;
  return `${count} page${count === 1 ? "" : "s"}`;
}

export function lessonDetail(lesson: CourseLesson): string | null {
  return lesson.type === "pdf"
    ? formatPageCount(lesson.pageCount)
    : lesson.duration || null;
}
