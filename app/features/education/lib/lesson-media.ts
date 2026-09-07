export function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    const id =
      host === "youtu.be"
        ? parsed.pathname.slice(1)
        : host.endsWith("youtube.com")
          ? (parsed.searchParams.get("v") ??
            parsed.pathname.match(/^\/(?:embed|shorts|v)\/([^/?]+)/)?.[1] ??
            null)
          : null;

    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function pdfEmbedUrl(src: string): string {
  try {
    const url = new URL(src);
    url.hash = "toolbar=0&navpanes=0";
    return url.href;
  } catch {
    return src;
  }
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${minutes}:${String(secs).padStart(2, "0")}`;
}
