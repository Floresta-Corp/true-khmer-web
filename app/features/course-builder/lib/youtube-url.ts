/** Hosts YouTube serves watchable videos from. */
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

/** A video id is always 11 characters of the URL-safe alphabet. */
const VIDEO_ID = /^[\w-]{11}$/;

/** The paths that carry the id in the first segment rather than in `?v=`. */
const PATH_FORMS = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/;

/**
 * The video id in a YouTube link, or null when it is not one. Accepts the
 * shapes people actually paste: watch pages, youtu.be shares, embeds, Shorts
 * and live URLs.
 */
export function youtubeVideoId(raw: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (!YOUTUBE_HOSTS.has(parsed.hostname.toLowerCase())) return null;

  const id = parsed.hostname.toLowerCase().endsWith("youtu.be")
    ? parsed.pathname.slice(1).split("/")[0]
    : parsed.pathname === "/watch"
      ? (parsed.searchParams.get("v") ?? "")
      : (PATH_FORMS.exec(parsed.pathname)?.[1] ?? "");

  return VIDEO_ID.test(id) ? id : null;
}

export function isYoutubeUrl(raw: string): boolean {
  return youtubeVideoId(raw) !== null;
}

/** Returns a problem to show the user, or null while the box is usable. */
export function validateYoutubeUrl(raw: string): string | null {
  if (!raw.trim()) return null;
  return isYoutubeUrl(raw)
    ? null
    : "That is not a YouTube video link. Paste one like https://youtube.com/watch?v=…";
}
