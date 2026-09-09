import type { api } from "~/types/api-client";

/** Public-event payload types come directly from the generated API client. */
export type PublicEventPhoto = Awaited<
  ReturnType<typeof api.getV1plumpieventsslugSlugphotos>
>["photos"][number];

export type PublicEventSession = Awaited<
  ReturnType<typeof api.getV1plumpieventsslugSlugsessions>
>["sessions"][number];

export type PublicEventExhibitor = Awaited<
  ReturnType<typeof api.getV1plumpieventsslugSlugexhibitors>
>["exhibitors"][number];

export type PublicEventExhibitorCategory = Awaited<
  ReturnType<typeof api.getV1plumpieventsslugSlugexhibitorCategories>
>["categories"][number];

export type PublicEventFloorPlanPhoto = Awaited<
  ReturnType<typeof api.getV1plumpieventsslugSlugfloorPlanPhotos>
>["photos"][number];

export function readString(
  record: Record<string, unknown | null>,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export function readRecord(
  value: unknown,
): Record<string, unknown | null> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown | null>)
    : null;
}

export function readRecords(value: unknown): Record<string, unknown | null>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const record = readRecord(item);
    return record ? [record] : [];
  });
}

export function getPhotoUrl(photo: PublicEventPhoto) {
  return readString(photo, "fullUrl", "url", "photoUrl", "imageUrl");
}

export function getSessionId(session: PublicEventSession, index: number) {
  return readString(session, "id", "uuid") ?? `session-${index}`;
}

export function getSessionDateKey(session: PublicEventSession) {
  const startAt = readString(session, "startAt", "startDate", "startsAt");
  return readString(session, "dateId") ?? startAt?.slice(0, 10) ?? "schedule";
}

export function getExhibitorId(exhibitor: PublicEventExhibitor, index: number) {
  return readString(exhibitor, "id", "uuid") ?? `exhibitor-${index}`;
}

export function getExhibitorName(exhibitor: PublicEventExhibitor) {
  return (
    readString(exhibitor, "companyName", "name", "title") ?? "Unnamed exhibitor"
  );
}

export function getExhibitorCategory(exhibitor: PublicEventExhibitor) {
  return readRecord(exhibitor.category);
}

export function getExhibitorBooths(exhibitor: PublicEventExhibitor) {
  return readRecords(exhibitor.booths);
}
