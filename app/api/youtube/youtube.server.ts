import { getServerEnv } from "~/lib/server/env";

const VIDEOS_ENDPOINT = "https://www.googleapis.com/youtube/v3/videos";

const LOOKUP_TIMEOUT_MS = 8_000;

/** The longest length a lesson may carry, matching the curriculum schema. */
const MAX_DURATION_SECONDS = 86_400;

/**
 * How a duration lookup ended. Only `ok` carries a length: everything else is
 * a reason the caller can turn into a message without guessing.
 */
export type YoutubeDurationLookup =
  | { status: "ok"; durationSeconds: number }
  | { status: "unavailable" }
  | { status: "unconfigured" }
  | { status: "failed" };

/** YouTube reports lengths as ISO 8601 durations, e.g. `PT1H2M10S`. */
const ISO_DURATION =
  /^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

const UNITS = [604_800, 86_400, 3_600, 60, 1];

/** Whole seconds in an ISO 8601 duration, or null when it carries no length. */
export function isoDurationToSeconds(raw: string): number | null {
  const match = ISO_DURATION.exec(raw.trim());
  if (!match) return null;

  const parts = match.slice(1);
  if (parts.every((part) => part === undefined)) return null;

  const total = parts.reduce(
    (sum, part, index) => sum + Number(part ?? 0) * UNITS[index],
    0,
  );

  if (!Number.isFinite(total) || total < 1) return null;
  return Math.min(Math.round(total), MAX_DURATION_SECONDS);
}

/** What the API said went wrong, for the server log. */
async function describeFailure(response: Response): Promise<string> {
  try {
    const body: {
      error?: { message?: string; errors?: Array<{ reason?: string }> };
    } = await response.json();
    const reason = body.error?.errors?.[0]?.reason;
    const message = body.error?.message ?? "no message";
    return reason ? `${reason} — ${message}` : message;
  } catch {
    return "the error body could not be read";
  }
}

/**
 * The length of a public YouTube video, read from the Data API v3. Live
 * streams, private and deleted videos have no length to report, so they come
 * back as `unavailable` rather than as an error.
 */
export async function lookupYoutubeDuration(
  videoId: string,
): Promise<YoutubeDurationLookup> {
  const apiKey = getServerEnv("YOUTUBE_API_KEY");

  if (!apiKey) {
    console.warn(
      "YOUTUBE_API_KEY is not set. Video lengths cannot be read from YouTube until it is configured.",
    );
    return { status: "unconfigured" };
  }

  const url = new URL(VIDEOS_ENDPOINT);
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", apiKey);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("The YouTube duration lookup did not complete", error);
    return { status: "failed" };
  }

  if (!response.ok) {
    /* A rejected key, a project without the API enabled or an exhausted quota
       all answer 4xx. None of that is the author's doing, so it reads as a
       setup problem and the reason goes to the log for whoever fixes it. */
    console.error(
      `The YouTube Data API answered ${response.status} for a duration lookup: ${await describeFailure(response)}`,
    );
    return {
      status:
        response.status >= 400 && response.status < 500
          ? "unconfigured"
          : "failed",
    };
  }

  let payload: {
    items?: Array<{ contentDetails?: { duration?: string } }>;
  };
  try {
    payload = await response.json();
  } catch (error) {
    console.error(
      "The YouTube Data API sent a response we could not read",
      error,
    );
    return { status: "failed" };
  }

  const duration = payload.items?.[0]?.contentDetails?.duration;
  if (!duration) return { status: "unavailable" };

  const durationSeconds = isoDurationToSeconds(duration);
  return durationSeconds === null
    ? { status: "unavailable" }
    : { status: "ok", durationSeconds };
}
