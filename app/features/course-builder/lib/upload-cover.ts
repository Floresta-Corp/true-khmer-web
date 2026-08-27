import type { PresignCourseCoverUploadResponse } from "~/types/api-client";

export type CoverUpload = PresignCourseCoverUploadResponse["upload"];

/** 5 MiB — the cap the presign endpoint enforces. */
export const MAX_COVER_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_COVER_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/**
 * Sends the file straight to storage using the presigned URL. This does not go
 * through our API, so it stays out of `services/`.
 */
export async function putCoverImage(upload: CoverUpload, file: File) {
  const response = await fetch(upload.uploadUrl, {
    method: upload.method,
    headers: upload.requiredHeaders,
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Cover upload failed (${response.status})`);
  }

  return upload.coverImageKey;
}

/** Returns a problem to show the user, or null when the file is usable. */
export function validateCoverFile(file: File): string | null {
  if (!ACCEPTED_COVER_TYPES.includes(file.type as never)) {
    return "Use a JPG, PNG or WebP image.";
  }
  if (file.size > MAX_COVER_BYTES) {
    return "That image is over 5 MB.";
  }
  return null;
}
