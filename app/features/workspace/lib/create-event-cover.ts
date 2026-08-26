// Plumpi validates against 2,000,000 bytes, so use its exact upstream limit.
export const CREATE_EVENT_COVER_MAX_BYTES = 2_000_000;
export const CREATE_EVENT_COVER_ACCEPT = "image/jpeg,image/png,image/webp";

const ALLOWED_COVER_TYPES = new Set(CREATE_EVENT_COVER_ACCEPT.split(","));

export function validateCreateEventCover(file: File): string | null {
  if (!ALLOWED_COVER_TYPES.has(file.type)) {
    return "Use a JPG, PNG, or WebP image.";
  }

  if (file.size === 0) {
    return "The selected image is empty.";
  }

  if (file.size > CREATE_EVENT_COVER_MAX_BYTES) {
    return "Event cover must be 2 MB or smaller.";
  }

  return null;
}
