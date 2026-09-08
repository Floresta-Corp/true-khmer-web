const METADATA_TIMEOUT_MS = 10_000;

export function measureAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    let timer: ReturnType<typeof setTimeout>;
    let settled = false;

    const finish = (seconds: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      audio.removeAttribute("src");
      audio.load();
      URL.revokeObjectURL(url);
      resolve(seconds);
    };

    timer = setTimeout(() => finish(null), METADATA_TIMEOUT_MS);

    audio.addEventListener("loadedmetadata", () => {
      const seconds = Math.round(audio.duration);
      finish(Number.isFinite(audio.duration) && seconds >= 1 ? seconds : null);
    });
    audio.addEventListener("error", () => finish(null));

    audio.preload = "metadata";
    audio.src = url;
  });
}
