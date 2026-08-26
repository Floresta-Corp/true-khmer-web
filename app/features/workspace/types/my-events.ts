import * as z from "zod";
import {
  schemas,
  type postV1plumpievents_Body as CreatePlumpiEventBody,
} from "~/types/api-client";

/** Lifecycle of an event the signed-in creator owns. */
export const MyEventStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "LIVE",
  "ENDED",
  "CANCELLED",
]);
export type MyEventStatus = z.infer<typeof MyEventStatusSchema>;

export const MyEventFormatSchema = z.enum(["IN_PERSON", "ONLINE", "HYBRID"]);
export type MyEventFormat = z.infer<typeof MyEventFormatSchema>;

/** Status segmented control on the listing page. */
export const MyEventFilterSchema = z.enum([
  "all",
  "draft",
  "published",
  "live",
  "ended",
  "cancelled",
]);
export type MyEventFilter = z.infer<typeof MyEventFilterSchema>;

/** Format dropdown on the listing page. */
export const MyEventFormatFilterSchema = z.enum([
  "all",
  "in_person",
  "online",
  "hybrid",
]);
export type MyEventFormatFilter = z.infer<typeof MyEventFormatFilterSchema>;

export const MyEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.union([z.null(), z.string()]),
  category: z.string(),
  coverImageKey: z.union([z.null(), z.string()]),
  status: MyEventStatusSchema,
  format: MyEventFormatSchema,
  startAt: z.string(),
  endAt: z.union([z.null(), z.string()]),
  venue: z.string(),
  currencyCode: z.string(),
  revenue: z.number(),
  ticketsSold: z.number(),
  ticketCapacity: z.union([z.null(), z.number()]),
  attendanceCount: z.union([z.null(), z.number()]),
});
export type MyEvent = z.infer<typeof MyEventSchema>;

export const MyEventsPaginationSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type MyEventsPagination = z.infer<typeof MyEventsPaginationSchema>;

export type MyEventsLoaderData = {
  events: MyEvent[];
  pagination: MyEventsPagination | null;
  userId: string | null;
};

// --- Create event ---

/** Only the two formats the basics step offers; hybrid is set up in Plumpi. */
export const CreateEventFormatSchema = z.enum(["IN_PERSON", "ONLINE"]);
export type CreateEventFormat = z.infer<typeof CreateEventFormatSchema>;

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

export const CreateEventInputSchema = z.object({
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
  startDate: z.string().trim().min(1, "Start date is required"),
  startTime: z.string().trim().min(1, "Start time is required"),
  endTime: z.string().trim().min(1, "End time is required"),
  /**
   * Name of the picked cover file. The File itself is held separately so it can
   * be sent as multipart data after the event exists.
   */
  coverImageName: z.string().trim().min(1, "An event cover is required"),
  visibility: schemas.postV1plumpievents_Body.shape.visibility,
  registrationMode: schemas.postV1plumpievents_Body.shape.registrationMode,
  entryMode: schemas.postV1plumpievents_Body.shape.entryMode,
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
  startDate: string;
  startTime: string;
  endTime: string;
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
  format: "",
  startDate: "",
  startTime: "",
  endTime: "",
  coverImageName: "",
  coverPreviewUrl: "",
  visibility: "LISTED",
  registrationMode: "ANYONE",
  entryMode: "TICKETED",
};
