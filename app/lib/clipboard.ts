import { toast } from "sonner";

/**
 * Build an absolute URL from a relative path, falling back to the raw path
 * during SSR where `window` is unavailable.
 */
export function buildAbsoluteUrl(path: string): string {
  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).href;
  }
  return path;
}

interface CopyToClipboardOptions {
  /** Toast shown on success. Pass `null` to disable the success toast. */
  successMessage?: string | null;
  /** Toast shown on failure. Pass `null` to disable the error toast. */
  errorMessage?: string | null;
}

/**
 * Copy text to the clipboard and surface a toast for the outcome.
 * Returns `true` when the copy succeeded.
 */
export async function copyToClipboard(
  text: string,
  {
    successMessage = "Link copied to clipboard!",
    errorMessage = "Failed to copy link.",
  }: CopyToClipboardOptions = {},
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    if (successMessage) toast.success(successMessage);
    return true;
  } catch {
    if (errorMessage) toast.error(errorMessage);
    return false;
  }
}
