export const MAX_ANDROID_FINGERPRINTS = 20;

export function normalizeSha1Fingerprint(value: string): string | null {
  const compact = value
    .trim()
    .replace(/[:\s-]/g, "")
    .toUpperCase();
  if (!/^[A-F0-9]{40}$/.test(compact)) return null;
  return compact.match(/.{2}/g)?.join(":") ?? null;
}

export function parseFingerprintsField(
  raw: FormDataEntryValue | null,
): string[] {
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed
      .filter((entry): entry is string => typeof entry === "string")
      .map(normalizeSha1Fingerprint)
      .filter((entry): entry is string => entry !== null);
    return Array.from(new Set(normalized));
  } catch {
    return [];
  }
}
