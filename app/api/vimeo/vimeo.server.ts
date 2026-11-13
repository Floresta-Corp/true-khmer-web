const OEMBED_ENDPOINT = "https://vimeo.com/api/oembed.json";

const LOOKUP_TIMEOUT_MS = 8_000;

const MAX_DURATION_SECONDS = 86_400;

export type VimeoDurationLookup =
  | { status: "ok"; durationSeconds: number }
  | { status: "unavailable" }
  | { status: "failed" };

export async function lookupVimeoDuration(
  id: string,
  hash: string | null,
): Promise<VimeoDurationLookup> {
  const url = new URL(OEMBED_ENDPOINT);
  url.searchParams.set(
    "url",
    hash ? `https://vimeo.com/${id}/${hash}` : `https://vimeo.com/${id}`,
  );

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("The Vimeo duration lookup did not complete", error);
    return { status: "failed" };
  }

  if (response.status === 403 || response.status === 404) {
    return { status: "unavailable" };
  }

  if (!response.ok) {
    console.error(
      `Vimeo oEmbed answered ${response.status} for a duration lookup`,
    );
    return { status: "failed" };
  }

  let payload: { duration?: unknown };
  try {
    payload = await response.json();
  } catch (error) {
    console.error("Vimeo oEmbed sent a response we could not read", error);
    return { status: "failed" };
  }

  const seconds =
    typeof payload.duration === "number" ? Math.round(payload.duration) : 0;

  return seconds >= 1
    ? {
        status: "ok",
        durationSeconds: Math.min(seconds, MAX_DURATION_SECONDS),
      }
    : { status: "unavailable" };
}
