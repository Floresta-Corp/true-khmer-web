const METADATA_TIMEOUT_MS = 10_000;

const MAX_DURATION_SECONDS = 86_400;

export function measureVideoUrlDuration(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    let timer: ReturnType<typeof setTimeout>;
    let settled = false;

    const finish = (seconds: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.removeAttribute("src");
      video.load();
      resolve(seconds);
    };

    timer = setTimeout(() => finish(null), METADATA_TIMEOUT_MS);

    video.addEventListener("loadedmetadata", () => {
      const seconds = Math.round(video.duration);
      finish(
        Number.isFinite(video.duration) && seconds >= 1
          ? Math.min(seconds, MAX_DURATION_SECONDS)
          : null,
      );
    });
    video.addEventListener("error", () => finish(null));

    video.preload = "metadata";
    video.muted = true;
    video.src = url;
  });
}
