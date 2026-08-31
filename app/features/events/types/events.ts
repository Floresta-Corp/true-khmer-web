import { z } from "zod";
import { EVENT_TYPES } from "~/features/events/lib/event-types";
import { formatEventType } from "~/features/events/lib/event-formatters";

/** Ticket availability as reported by `GET /v1/plumpi/events`. */
export const EventTicketStatusSchema = z.enum([
  "AVAILABLE",
  "ALMOST_FULL",
  "SOLD_OUT",
  "WAITING_LIST",
]);
export type EventTicketStatus = z.infer<typeof EventTicketStatusSchema>;

/**
 * A price Plumpi sends as a decimal string ("9.90"), and that is `null` when
 * the event has no paid ticket tier.
 */
const PriceSchema = z
  .union([z.null(), z.number(), z.string()])
  .optional()
  .transform((value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  });

const NullableString = z.union([z.null(), z.string()]).optional();

/**
 * One row of `GET /v1/plumpi/events`, mapped to what the listing card renders.
 *
 * The endpoint types its rows as open records, so fields are picked out
 * leniently: an unexpected enum value falls back rather than failing, and a row
 * that is missing something essential is skipped by the loader instead of
 * blanking the page.
 */
export const EventListItemSchema = z
  .object({
    id: z.string(),
    title: NullableString,
    excerpt: NullableString,
    // Required: the card links by slug, which is what the detail endpoint takes.
    slug: z.string(),
    eventType: z.unknown(),
    thumbnail: NullableString,
    startAt: z.string(),
    endAt: NullableString,
    venueName: NullableString,
    basePrice: PriceSchema,
    salePrice: PriceSchema,
    ticketStatus: z.unknown(),
    /** Plumpi's category name ("Tech", "F&B"), which the card badge shows. */
    eventCategory: NullableString,
    isOnline: z.union([z.null(), z.boolean()]).optional(),
    isFavorite: z.union([z.null(), z.boolean()]).optional(),
  })
  .transform((event) => {
    const eventType = z.enum(EVENT_TYPES).catch("OTHER").parse(event.eventType);
    const ticketStatus = EventTicketStatusSchema.catch("AVAILABLE").parse(
      event.ticketStatus,
    );

    return {
      id: event.id,
      slug: event.slug,
      title: event.title?.trim() || "Untitled event",
      excerpt: event.excerpt?.trim() || "",
      thumbnail: event.thumbnail ?? null,
      startAt: event.startAt,
      endAt: event.endAt ?? null,
      eventType,
      // Plumpi's own category wins; the coarse event type is the fallback.
      categoryLabel: event.eventCategory?.trim() || formatEventType(eventType),
      location:
        event.venueName?.trim() ||
        (event.isOnline ? "Online" : "Location to be announced"),
      /** Cheapest sellable price, or `null` for a free event. */
      price: event.salePrice ?? event.basePrice,
      isSoldOut: ticketStatus === "SOLD_OUT",
      ticketStatus,
      isFavorite: event.isFavorite ?? false,
    };
  });
export type EventListItem = z.infer<typeof EventListItemSchema>;

export type EventsHubLoaderData = {
  events: EventListItem[];
  /** Set when the listing could not be read at all. */
  loadError: string | null;
};

// --- Event detail ---

/** How a visitor gets in, as reported by `GET /v1/plumpi/events/slug/{slug}`. */
export const EventEntryModeSchema = z.enum(["TICKETED", "RSVP", "OPEN_ACCESS"]);
export type EventEntryMode = z.infer<typeof EventEntryModeSchema>;

/**
 * Optional sections an organizer can switch on in Plumpi. Only the two the
 * design gives a tab are tracked; `featureVisibility` can still hide one or
 * restrict it to registered attendees, which a public page cannot satisfy.
 */
const FEATURE_KEYS = ["programs", "exhibitors"] as const;
type FeatureKey = (typeof FEATURE_KEYS)[number];

const FlagRecord = z
  .union([z.null(), z.record(z.string(), z.unknown())])
  .optional();

/** One day of an event; Plumpi returns a list even for single-day events. */
const EventDateSchema = z.object({
  id: z.string(),
  startAt: z.string(),
  endAt: NullableString,
});

const EventPhotoSchema = z.object({ url: z.string() });

const VenueSchema = z
  .union([
    z.null(),
    z.object({
      name: NullableString,
      address: NullableString,
      locationUrl: NullableString,
      googleMapLink: NullableString,
    }),
  ])
  .optional();

function buildMapUrl(
  venue: { locationUrl?: string | null; googleMapLink?: string | null } | null,
  query: string,
) {
  const link = venue?.googleMapLink ?? venue?.locationUrl;
  if (link) return link;
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const EventDetailSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    title: NullableString,
    excerpt: NullableString,
    description: NullableString,
    cover: NullableString,
    eventType: z.unknown(),
    eventCategory: NullableString,
    startAt: z.string(),
    endAt: NullableString,
    venue: VenueSchema,
    venueName: NullableString,
    isOnline: z.union([z.null(), z.boolean()]).optional(),
    entryMode: z.unknown(),
    isFavorite: z.union([z.null(), z.boolean()]).optional(),
    advancedFeatures: FlagRecord,
    featureVisibility: FlagRecord,
    eventDates: z.array(EventDateSchema).optional(),
    photos: z.array(EventPhotoSchema).optional(),
  })
  .transform((event) => {
    const eventType = z.enum(EVENT_TYPES).catch("OTHER").parse(event.eventType);
    const venue = event.venue ?? null;
    const venueName = event.venueName?.trim() || venue?.name?.trim() || null;
    const venueAddress = venue?.address?.trim() || null;
    const dates = (event.eventDates ?? [])
      .slice()
      .sort((a, b) => a.startAt.localeCompare(b.startAt));

    // A feature earns a tab only when the organizer enabled it and left it
    // visible to everyone; "registered attendees only" needs a registration
    // this page has no way to check.
    const features = Object.fromEntries(
      FEATURE_KEYS.map((key) => [
        key,
        event.advancedFeatures?.[key] === true &&
          (event.featureVisibility?.[key] ?? "EVERYONE") === "EVERYONE",
      ]),
    ) as Record<FeatureKey, boolean>;

    return {
      id: event.id,
      slug: event.slug,
      title: event.title?.trim() || "Untitled event",
      excerpt: event.excerpt?.trim() || "",
      /** Rich text from Plumpi's editor; render through `SanitizedHtml`. */
      description: event.description?.trim() || "",
      cover: event.cover ?? null,
      eventType,
      categoryLabel: event.eventCategory?.trim() || formatEventType(eventType),
      startAt: dates[0]?.startAt ?? event.startAt,
      endAt: dates.at(-1)?.endAt ?? event.endAt ?? null,
      dates: dates.length > 0 ? dates : null,
      venueName,
      venueAddress,
      mapUrl: buildMapUrl(
        venue,
        [venueName, venueAddress].filter(Boolean).join(", "),
      ),
      isOnline: event.isOnline ?? false,
      entryMode: EventEntryModeSchema.catch("TICKETED").parse(event.entryMode),
      isFavorite: event.isFavorite ?? false,
      photos: (event.photos ?? []).map((photo) => photo.url),
      features,
    };
  });
export type EventDetail = z.infer<typeof EventDetailSchema>;

export type EventDetailLoaderData = {
  event: EventDetail | null;
  loadError: string | null;
};
