export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
export const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

export const COVER_MAX_FILE_SIZE = 10 * 1024 * 1024;

export function isSupportedImageFile(file: File | null) {
  if (!file) return false;
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return !!extension && ALLOWED_IMAGE_EXTENSIONS.has(extension);
}

export function getImageFileError(
  file: File | null,
  maxFileSize: number,
  fileLabel: string,
  options?: { required?: boolean },
): string | null {
  if (!file) {
    return options?.required ? `${fileLabel} is required.` : null;
  }

  if (!isSupportedImageFile(file)) {
    return "Invalid file type. Use JPG, JPEG, PNG, or WebP.";
  }

  if (file.size > maxFileSize) {
    const maxSizeInMb = maxFileSize / (1024 * 1024);
    return `${fileLabel} must be ${maxSizeInMb}MB or smaller.`;
  }

  return null;
}
