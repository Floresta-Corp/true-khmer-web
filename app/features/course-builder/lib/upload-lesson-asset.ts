import type { LessonSource } from "~/features/course-builder/types";

export type LessonAssetUpload = {
  uploadUrl: string;
  method: "PUT";
  requiredHeaders: Record<string, string>;
  assetKey: string;
  publicUrl: string | null;
  expiresInSeconds: number;
};

/** 100 MiB — the cap the presign endpoint enforces. */
export const MAX_LESSON_ASSET_BYTES = 100 * 1024 * 1024;

const ACCEPTED: Record<Exclude<LessonSource, "youtube">, string[]> = {
  pdf: ["application/pdf"],
  audio: [
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/x-m4a",
    "audio/aac",
    "audio/ogg",
    "audio/wav",
    "audio/x-wav",
    "audio/webm",
  ],
};

/**
 * Sends the file straight to storage using the presigned URL. This does not go
 * through our API, so it stays out of `services/`.
 */
export async function putLessonAsset(upload: LessonAssetUpload, file: File) {
  const response = await fetch(upload.uploadUrl, {
    method: upload.method,
    headers: upload.requiredHeaders,
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Lesson upload failed (${response.status})`);
  }

  return upload.assetKey;
}

/** Returns a problem to show the user, or null when the file is usable. */
export function validateLessonFile(
  file: File,
  source: Exclude<LessonSource, "youtube">,
): string | null {
  if (!ACCEPTED[source].includes(file.type)) {
    return source === "pdf"
      ? "Use a PDF file."
      : "Use an MP3, M4A, WAV or OGG file.";
  }
  if (file.size > MAX_LESSON_ASSET_BYTES) {
    return "That file is over 100 MB.";
  }
  return null;
}
