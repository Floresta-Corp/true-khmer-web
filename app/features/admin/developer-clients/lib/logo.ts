/** The presign endpoint rejects anything larger. */
export const MAX_LOGO_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;

export const LOGO_ACCEPT_ATTRIBUTE = ACCEPTED_LOGO_TYPES.join(",");

/** Returns an error message, or null when the file is acceptable. */
export function validateLogoFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!(ACCEPTED_LOGO_TYPES as readonly string[]).includes(file.type)) {
    return "Logo must be a PNG, JPEG, WebP, or SVG image.";
  }
  if (file.size <= 0) {
    return "That file is empty.";
  }
  if (file.size > MAX_LOGO_BYTES) {
    return "Logo must be 5 MB or smaller.";
  }
  return null;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
