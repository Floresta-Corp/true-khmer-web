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
 * Fallback copy for non-secure contexts (HTTP, some webviews) where
 * `navigator.clipboard` is unavailable. Uses a temporary textarea and
 * the legacy `execCommand("copy")`.
 */
function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  // Keep it out of view and avoid scrolling/zoom side effects.
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }

  document.body.removeChild(textarea);
  return succeeded;
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
  let succeeded = false;

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      succeeded = true;
    } catch {
      succeeded = false;
    }
  }

  // Fall back to the legacy approach when the async Clipboard API is missing
  // (non-secure context) or failed.
  if (!succeeded) {
    succeeded = legacyCopy(text);
  }

  if (succeeded) {
    if (successMessage) toast.success(successMessage);
  } else {
    if (errorMessage) toast.error(errorMessage);
  }

  return succeeded;
}
