export type VideoSource =
  | { platform: "youtube"; id: string }
  | { platform: "vimeo"; id: string; hash: string | null }
  | { platform: "tiktok"; id: string }
  | { platform: "facebook"; id: string }
  | { platform: "file"; url: string };

export type VideoPlatform = VideoSource["platform"];

export const VIDEO_PLATFORM_LABELS: Record<VideoPlatform, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  tiktok: "TikTok",
  facebook: "Facebook",
  file: "Video file",
};

export const SUPPORTED_VIDEO_LINKS =
  "a public YouTube, Vimeo, TikTok or Facebook video link, or a direct link to an .mp4 or .webm file";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

const YOUTUBE_ID = /^[\w-]{11}$/;

const YOUTUBE_PATH_FORMS = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/;

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

const VIMEO_ID = /^\d{6,}$/;

const VIMEO_HASH = /^[\da-f]{6,}$/i;

const TIKTOK_HOSTS = new Set(["tiktok.com", "www.tiktok.com", "m.tiktok.com"]);

const TIKTOK_ID = /^\d{15,25}$/;

const TIKTOK_PATH_FORMS =
  /^\/(?:@[^/]+\/(?:video|photo)|player\/v1|embed(?:\/v2)?|v)\/(\d+)(?:\.html)?(?:\/|$)/;

const FACEBOOK_HOSTS = new Set([
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
  "web.facebook.com",
]);

const FACEBOOK_ID = /^\d{8,}$/;

const SHORT_LINK_HOSTS = new Set([
  "vm.tiktok.com",
  "vt.tiktok.com",
  "fb.watch",
  "www.fb.watch",
]);

const VIDEO_FILE = /\.(?:mp4|m4v|webm|ogv)$/i;

function youtubeSource(url: URL): VideoSource | null {
  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return null;

  const id = host.endsWith("youtu.be")
    ? url.pathname.slice(1).split("/")[0]
    : url.pathname === "/watch"
      ? (url.searchParams.get("v") ?? "")
      : (YOUTUBE_PATH_FORMS.exec(url.pathname)?.[1] ?? "");

  return YOUTUBE_ID.test(id) ? { platform: "youtube", id } : null;
}

function vimeoSource(url: URL): VideoSource | null {
  if (!VIMEO_HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const index = segments.findIndex((segment) => VIMEO_ID.test(segment));
  if (index === -1) return null;

  const pathHash = segments[index + 1];
  const hash =
    url.searchParams.get("h") ??
    (pathHash && VIMEO_HASH.test(pathHash) ? pathHash : null);

  return { platform: "vimeo", id: segments[index], hash };
}

function tiktokSource(url: URL): VideoSource | null {
  if (!TIKTOK_HOSTS.has(url.hostname.toLowerCase())) return null;

  const id = TIKTOK_PATH_FORMS.exec(url.pathname)?.[1] ?? "";
  return TIKTOK_ID.test(id) ? { platform: "tiktok", id } : null;
}

function facebookSource(url: URL): VideoSource | null {
  if (!FACEBOOK_HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const fromQuery =
    segments[0] === "watch" || segments[0] === "video.php"
      ? url.searchParams.get("v")
      : null;
  const reel = segments[0] === "reel" ? segments[1] : null;
  const videosAt = segments.indexOf("videos");
  const fromVideos =
    videosAt === -1
      ? null
      : segments.slice(videosAt + 1).find((part) => FACEBOOK_ID.test(part));

  const id = fromQuery ?? reel ?? fromVideos ?? "";
  return FACEBOOK_ID.test(id) ? { platform: "facebook", id } : null;
}

function fileSource(url: URL): VideoSource | null {
  return VIDEO_FILE.test(url.pathname)
    ? { platform: "file", url: url.href }
    : null;
}

export function parseVideoSource(raw: string): VideoSource | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  return (
    youtubeSource(url) ??
    vimeoSource(url) ??
    tiktokSource(url) ??
    facebookSource(url) ??
    fileSource(url)
  );
}

export function videoSourceKey(source: VideoSource): string {
  switch (source.platform) {
    case "youtube":
      return `youtube:${source.id}`;
    case "vimeo":
      return `vimeo:${source.id}`;
    case "tiktok":
      return `tiktok:${source.id}`;
    case "facebook":
      return `facebook:${source.id}`;
    case "file":
      return `file:${source.url}`;
  }
}

export function validateVideoUrl(raw: string): string | null {
  if (!raw.trim()) return null;
  if (isShortVideoLink(raw)) {
    return "Short links can't be read. Open the link, then copy the full address from your browser's address bar.";
  }
  return parseVideoSource(raw)
    ? null
    : `That link can't be played as a lesson. Paste ${SUPPORTED_VIDEO_LINKS}.`;
}

function isShortVideoLink(raw: string): boolean {
  try {
    return SHORT_LINK_HOSTS.has(new URL(raw.trim()).hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function facebookVideoHref(id: string): string {
  return `https://www.facebook.com/video.php?v=${id}`;
}
