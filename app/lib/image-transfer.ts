/**
 * Helpers for reading images out of drag-and-drop and clipboard payloads.
 *
 * A payload can carry an image two ways: as a file (a screenshot, a file from
 * the desktop) or as a link (a copied image address, "Copy image" in a
 * browser, an image dragged from another tab). Links are already hosted, so
 * callers use them as-is instead of sending them through the upload API.
 */

function toHttpUrl(value: string | null | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/**
 * The image link in a payload, if any. Browsers put the image address in
 * `text/uri-list` when dragging, and in `text/html` (as `<img src>`) when an
 * image is copied — so those are read before the plain-text fallback.
 */
export function getImageUrlFromTransfer(data: DataTransfer): string | null {
  const uriList = data
    .getData("text/uri-list")
    .split(/\r?\n/)
    .find((line) => line.trim() && !line.startsWith("#"));
  const fromUriList = toHttpUrl(uriList);
  if (fromUriList) return fromUriList;

  const html = data.getData("text/html");
  if (html && typeof DOMParser !== "undefined") {
    const src = new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("img")
      ?.getAttribute("src");
    const fromHtml = toHttpUrl(src);
    if (fromHtml) return fromHtml;
  }

  return toHttpUrl(data.getData("text/plain"));
}

/** Files in a payload. `DataTransfer.files` is empty for clipboard items in some browsers, so items are read as well. */
export function getFilesFromTransfer(data: DataTransfer): File[] {
  if (data.files.length > 0) return Array.from(data.files);

  return Array.from(data.items)
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
}

/**
 * Resolves whether `url` loads as an image. Uses an `<img>` rather than
 * `fetch` so links on hosts without CORS headers still pass, as they would
 * when rendered.
 */
export function isLoadableImageUrl(
  url: string,
  timeoutMs = 10_000,
): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    const timer = window.setTimeout(() => finish(false), timeoutMs);

    function finish(ok: boolean) {
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      resolve(ok);
    }

    image.onload = () => finish(image.naturalWidth > 0);
    image.onerror = () => finish(false);
    image.src = url;
  });
}

/**
 * Downloads an image link as a `File`, for uploaders whose backend only takes
 * files. Only works when the host allows cross-origin reads (CORS); resolves
 * `null` otherwise.
 */
export async function fetchImageAsFile(url: string): Promise<File | null> {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return null;

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) return null;

    const name =
      decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "") ||
      "image";
    return new File([blob], name, { type: blob.type });
  } catch {
    return null;
  }
}
