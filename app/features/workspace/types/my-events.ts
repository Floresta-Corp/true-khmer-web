import * as z from "zod";
import {
  schemas,
  type postV1plumpievents_Body as CreatePlumpiEventBody,
} from "~/types/api-client";

/**
 * Lifecycle of an event, as returned by `GET /v1/plumpi/myevents`.
 * Mirrors the `status` query enum in `~/types/api-client`.
 */
export const MyEventStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
  "ARCHIVED",
]);
export type MyEventStatus = z.infer<typeof MyEventStatusSchema>;

/** Status segmented control on the listing page, plus the Archived toggle. */
export const MyEventFilterSchema = z.enum([
  "all",
  "live",
  "published",
  "ended",
  "cancelled",
  "draft",
  "archived",
]);
export type MyEventFilter = z.infer<typeof MyEventFilterSchema>;

/** The `status` query value each listing filter maps to. */
export const MY_EVENT_STATUS_BY_FILTER = {
  live: "ACTIVE",
  published: "PUBLISHED",
  ended: "COMPLETED",
  cancelled: "CANCELLED",
  draft: "DRAFT",
  archived: "ARCHIVED",
} as const satisfies Record<Exclude<MyEventFilter, "all">, MyEventStatus>;

/**
 * A count or amount that Plumpi may send as a number or a decimal string
 * ("4820.00"), and that is `null` when the event has no figures yet.
 */
const NumericSchema = z
  .union([z.null(), z.number(), z.string()])
  .optional()
  .transform((value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  });

/** One day of an event; Plumpi returns a list even for single-day events. */
const MyEventDateSchema = z.object({
  startAt: z.string(),
  endAt: z.union([z.null(), z.string()]).optional(),
});

/**
 * `GET /v1/plumpi/myevents` types its rows as open records, so the fields the
 * card needs are picked out leniently: anything missing degrades to a
 * placeholder on the card rather than failing the whole page.
 */
export const MyEventSchema = z
  .object({
    id: z.string(),
    organizationId: z.union([z.null(), z.string()]).optional(),
    title: z.union([z.null(), z.string()]).optional(),
    status: z.unknown(),
    thumbnail: z.union([z.null(), z.string()]).optional(),
    eventDates: z.array(MyEventDateSchema).optional(),
    startAt: z.union([z.null(), z.string()]).optional(),
    endAt: z.union([z.null(), z.string()]).optional(),
    isOnline: z.union([z.null(), z.boolean()]).optional(),
    address: z.union([z.null(), z.string()]).optional(),
    venueName: z.union([z.null(), z.string()]).optional(),
    currencyCode: z.union([z.null(), z.string()]).optional(),
    // Plumpi reports money and ticket totals as decimal strings.
    totalRevenue: NumericSchema,
    ticketsAttributed: NumericSchema,
    totalQuantity: NumericSchema,
    maxAttendees: NumericSchema,
  })
  .transform((event) => {
    const dates = event.eventDates ?? [];
    const startAt = dates[0]?.startAt ?? event.startAt ?? null;
    const endAt = dates.at(-1)?.endAt ?? event.endAt ?? null;

    return {
      id: event.id,
      organizationId: event.organizationId ?? null,
      title: event.title?.trim() || "Untitled event",
      status: MyEventStatusSchema.catch("DRAFT").parse(event.status),
      thumbnail: event.thumbnail ?? null,
      startAt,
      endAt,
      location:
        event.venueName?.trim() ||
        event.address?.trim() ||
        (event.isOnline ? "Online event" : "Location to be announced"),
      currencyCode: event.currencyCode ?? "USD",
      revenue: event.totalRevenue,
      ticketsSold: event.ticketsAttributed,
      ticketCapacity: event.totalQuantity ?? event.maxAttendees,
    };
  });
export type MyEvent = z.infer<typeof MyEventSchema>;

export const MyEventsPaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type MyEventsPagination = z.infer<typeof MyEventsPaginationSchema>;

/** The part of the listing that has to wait on Plumpi. */
export type MyEventsContent = {
  events: MyEvent[];
  pagination: MyEventsPagination | null;
  loadError: string | null;
};

/**
 * The listing streams: the page shell, filters and create button render from
 * `userId` right away, while the grid and the Live tab wait on their promise.
 */
export type MyEventsLoaderData = {
  content: Promise<MyEventsContent>;
  /** Whether any event is running right now, which reveals the Live tab. */
  hasLiveEvents: Promise<boolean>;
  userId: string | null;
};

/** Result of handing a listed event over to the Plumpi organizer console. */
export type MyEventsActionData = {
  ok: boolean;
  redirectTo?: string;
  error?: string;
};

// --- Create event ---

/** Only the two formats the basics step offers; hybrid is set up in Plumpi. */
export const CreateEventFormatSchema = z.enum(["IN_PERSON", "ONLINE"], {
  error: "Choose an event format",
});
export type CreateEventFormat = z.infer<typeof CreateEventFormatSchema>;

/** Date and time values as entered in the browser before UTC conversion. */
export const CreateEventDateInputSchema = z.object({
  date: z
    .string()
    .trim()
    .min(1, "Event date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid event date"),
  startTime: z
    .string()
    .trim()
    .min(1, "Start time is required")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid start time"),
  endTime: z
    .string()
    .trim()
    .min(1, "End time is required")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid end time"),
});
export type CreateEventDateInput = z.infer<typeof CreateEventDateInputSchema>;

export const emptyCreateEventDate: CreateEventDateInput = {
  date: "",
  startTime: "",
  endTime: "",
};

export const CREATE_EVENT_NAME_LIMIT =
  schemas.postV1plumpievents_Body.shape.title.maxLength ?? 100;
export const CREATE_EVENT_DESCRIPTION_LIMIT =
  schemas.postV1plumpievents_Body.shape.excerpt.maxLength ?? 200;

/** An organization the creator can publish an event under. */
export const EventOrganizerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  logo: z.string().nullable().optional().default(null),
});
export type EventOrganizer = z.infer<typeof EventOrganizerSchema>;

/** A Plumpi category available for the new event. */
export const EventCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});
export type EventCategory = z.infer<typeof EventCategorySchema>;

/** A Plumpi venue that can be assigned to an in-person event. */
export const EventVenueSchema = z
  .object({
    id: schemas.postV1plumpievents_Body.shape.venueId.unwrap(),
    name: z.string().trim().min(1),
    address: z.string().nullable().optional(),
    locationUrl: z.string().nullable().optional(),
  })
  .transform(({ locationUrl, ...venue }) => ({
    ...venue,
    googleMapLink: locationUrl,
  }));
export type EventVenue = z.infer<typeof EventVenueSchema>;

/** Venues are paged in as the organizer scrolls the suggestion list. */
export const VENUE_SEARCH_PAGE_SIZE = 10;

/** Shape returned by the venue suggestion resource route. */
export type VenueSearchResponse = {
  ok: boolean;
  /** Echoed back so the dropdown can drop responses to stale keystrokes. */
  search: string;
  page: number;
  hasMore: boolean;
  venues: EventVenue[];
  message?: string;
};

export const EventVisibilitySchema =
  schemas.postV1plumpievents_Body.shape.visibility;
export type EventVisibility = CreatePlumpiEventBody["visibility"];

export const EventRegistrationModeSchema =
  schemas.postV1plumpievents_Body.shape.registrationMode;
export type EventRegistrationMode = CreatePlumpiEventBody["registrationMode"];

export const EventEntryModeSchema =
  schemas.postV1plumpievents_Body.shape.entryMode;
export type EventEntryMode = CreatePlumpiEventBody["entryMode"];

/** Partial update emitted by the access & visibility section. */
export type EventAccessPatch = Partial<
  Pick<CreatePlumpiEventBody, "visibility" | "registrationMode" | "entryMode">
>;

export const CreateEventInputSchema = z
  .object({
    organizerId: z
      .string()
      .trim()
      .min(1, "Pick a host organization")
      .pipe(schemas.postV1plumpievents_Body.shape.organizationId),
    name: z
      .string()
      .trim()
      .min(1, "Event name is required")
      .pipe(schemas.postV1plumpievents_Body.shape.title),
    category: z
      .string()
      .trim()
      .min(1, "Pick an event category")
      .pipe(schemas.postV1plumpievents_Body.shape.eventCategories.element),
    description: z
      .string()
      .trim()
      .min(1, "A short description is required")
      .pipe(schemas.postV1plumpievents_Body.shape.excerpt),
    format: CreateEventFormatSchema,
    eventDates: z
      .array(CreateEventDateInputSchema)
      .min(1, "Add at least one event date"),
    venueName: z.preprocess(
      (value) =>
        typeof value === "string"
          ? value.trim() === ""
            ? undefined
            : value.trim()
          : value,
      schemas.postV1plumpievents_Body.shape.venueName,
    ),
    venueId: z.preprocess(
      (value) => (value === "" ? undefined : value),
      schemas.postV1plumpievents_Body.shape.venueId,
    ),
    address: z.preprocess(
      (value) =>
        typeof value === "string"
          ? value.trim() === ""
            ? undefined
            : value.trim()
          : value,
      schemas.postV1plumpievents_Body.shape.address,
    ),
    googleMapLink: z.preprocess(
      (value) =>
        typeof value === "string"
          ? value.trim() === ""
            ? undefined
            : value.trim()
          : value,
      schemas.postV1plumpievents_Body.shape.googleMapLink,
    ),
    /**
     * Name of the picked cover file. The File itself is held separately so it
     * can be sent as multipart data after the event exists.
     */
    coverImageName: z.string().trim().min(1, "Event thumbnail is required"),
    visibility: schemas.postV1plumpievents_Body.shape.visibility,
    registrationMode: schemas.postV1plumpievents_Body.shape.registrationMode,
    entryMode: schemas.postV1plumpievents_Body.shape.entryMode,
  })
  .superRefine((value, context) => {
    if (value.format !== "IN_PERSON") {
      context.addIssue({
        code: "custom",
        path: ["format"],
        message: "Online events are not available yet",
      });
    }

    value.eventDates.forEach((eventDate, index) => {
      if (!eventDate.date || !eventDate.startTime || !eventDate.endTime) return;

      const start = new Date(`${eventDate.date}T${eventDate.startTime}:00`);
      const end = new Date(`${eventDate.date}T${eventDate.endTime}:00`);
      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end <= start
      ) {
        context.addIssue({
          code: "custom",
          path: ["eventDates", index, "endTime"],
          message: "End time must be after the start time",
        });
      }
    });

    if (value.format !== "IN_PERSON") return;

    if (!value.venueId && !value.venueName) {
      context.addIssue({
        code: "custom",
        path: ["venueName"],
        message: "Select or enter a venue for your in-person event",
      });
    }
    if (!value.googleMapLink) {
      context.addIssue({
        code: "custom",
        path: ["googleMapLink"],
        message: "Google Map link is required",
      });
    }
  });
export type CreateEventInput = z.infer<typeof CreateEventInputSchema>;

export type CreateEventFieldErrors = Partial<
  Record<keyof CreateEventInput, string>
>;

export type CreateEventActionData = {
  ok: boolean;
  eventId?: string;
  redirectTo?: string;
  warning?: string;
  errors?: CreateEventFieldErrors;
  error?: string;
};

export type CreateEventLoaderData = {
  categories: EventCategory[];
  organizers: EventOrganizer[];
  userId: string | null;
};

/** Client-side state of the basics step, before it is validated. */
export type CreateEventFormState = Pick<
  CreatePlumpiEventBody,
  "visibility" | "registrationMode" | "entryMode"
> & {
  organizerId: string;
  name: string;
  category: string;
  description: string;
  format: CreateEventFormat | "";
  eventDates: CreateEventDateInput[];
  venueName: string;
  venueId: string;
  address: string;
  googleMapLink: string;
  /** File name of the picked cover, used for form completeness and review. */
  coverImageName: string;
  /** Object URL for the local preview; never sent to the server. */
  coverPreviewUrl: string;
};

export const initialCreateEventFormState: CreateEventFormState = {
  organizerId: "",
  name: "",
  category: "",
  description: "",
  format: "IN_PERSON",
  eventDates: [{ ...emptyCreateEventDate }],
  venueName: "",
  venueId: "",
  address: "",
  googleMapLink: "",
  coverImageName: "",
  coverPreviewUrl: "",
  visibility: "LISTED",
  registrationMode: "ANYONE",
  entryMode: "TICKETED",
};
