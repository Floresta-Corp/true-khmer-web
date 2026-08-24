export function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.origin === "null" ? null : url.origin;
  } catch {
    return null;
  }
}

export const MAX_ALLOWED_ORIGINS = 20;

export function parseOriginsField(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || raw.trim() === "") return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => normalizeOrigin(entry))
      .filter((entry): entry is string => entry !== null);

    return Array.from(new Set(normalized));
  } catch {
    return [];
  }
}
