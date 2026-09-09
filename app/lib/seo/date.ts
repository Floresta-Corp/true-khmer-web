/**
 * Normalise a timestamp to ISO 8601.
 *
 * Both Open Graph's `article:*` times and schema.org's date properties are
 * specified as ISO 8601, and our API hands back Postgres' own rendering
 * instead -- `2026-08-21 11:47:11.968+00`, with a space where the `T` belongs.
 * That parses fine in a browser and is silently ignored by every consumer that
 * matters, so the date has to be normalised on the way into a tag rather than
 * passed through.
 *
 * Anything unparseable returns `undefined`, which drops the property: no date
 * is better than a date a validator rejects.
 */
export function toIsoDate(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return parsed.toISOString();
}
