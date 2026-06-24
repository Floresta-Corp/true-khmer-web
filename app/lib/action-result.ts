/**
 * Shape returned by route actions for toast handling. Tolerant of both the
 * flat `{ ok, message }` structure and the legacy `{ data: { ok } }` wrapping.
 */
type ActionResultLike =
  | {
      ok?: boolean;
      message?: string;
      error?: string;
      data?: { ok?: boolean } | null;
    }
  | null
  | undefined;

/** Normalize raw action/fetcher data into `{ ok, message }` for toasting. */
export function readActionResult(data: ActionResultLike): {
  ok: boolean;
  message?: string;
} {
  if (!data) return { ok: false };
  const ok = data.ok === true || data.data?.ok === true;
  return { ok, message: data.message ?? data.error ?? undefined };
}
