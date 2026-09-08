import type { LessonSource } from "~/features/course-builder/types";
import { countPdfPages } from "./pdf-page-count";
import { measureAudioDuration } from "./audio-duration";

export interface LessonAssetMeta {
  pageCount: number | null;
  durationSeconds: number | null;
}

export async function readLessonAssetMeta(
  file: File,
  source: LessonSource,
): Promise<LessonAssetMeta> {
  if (source === "pdf") {
    return { pageCount: await countPdfPages(file), durationSeconds: null };
  }

  if (source === "audio") {
    return {
      pageCount: null,
      durationSeconds: await measureAudioDuration(file),
    };
  }

  return { pageCount: null, durationSeconds: null };
}
