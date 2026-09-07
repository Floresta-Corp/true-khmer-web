import { z } from "zod";
import type { Route } from "project-types/workspace/route/+types/my-events.create";
import {
  createPlumpiEvent,
  uploadPlumpiEventThumbnail,
} from "~/api/events/events.server";
import { PLUMPI_HANDOFF_INTENT } from "~/features/workspace/lib/plumpi-handoff";
import {
  PLUMPI_HANDOFF_RESPONSE_INIT,
  plumpiHandoffErrorMessage,
  plumpiHandoffParamsSchema,
  resolvePlumpiHandoffUrl,
} from "~/features/workspace/services/plumpi-handoff.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import { validateCreateEventCover } from "~/features/workspace/lib/create-event-cover";
import {
  CreateEventInputSchema,
  type CreateEventActionData,
  type CreateEventFieldErrors,
  type CreateEventInput,
} from "~/features/workspace/types/my-events";
import { schemas, type postV1plumpievents_Body } from "~/types/api-client";

const submissionEventDateSchema =
  schemas.postV1plumpievents_Body.shape.eventDates.element.superRefine(
    (value, context) => {
      const start = new Date(value.startAt);
      const end = new Date(value.endAt);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid event date and time",
        });
      } else if (end <= start) {
        context.addIssue({
          code: "custom",
          path: ["endAt"],
          message: "End time must be after the start time",
        });
      }
    },
  );

const submissionMetaSchema = z.object({
  intent: z.literal("create-draft"),
  eventDates: z.array(submissionEventDateSchema).min(1),
});

const apiValidationErrorSchema = z.object({
  formErrors: z.array(z.string()),
  fieldErrors: z.record(z.string(), z.array(z.string())),
});

const apiFieldToFormField = {
  organizationId: "organizerId",
  title: "name",
  excerpt: "description",
  eventCategories: "category",
  isOnline: "format",
  venueId: "venueId",
  venueName: "venueName",
  address: "address",
  googleMapLink: "googleMapLink",
  visibility: "visibility",
  registrationMode: "registrationMode",
  entryMode: "entryMode",
} satisfies Partial<Record<string, keyof CreateEventInput>>;

const genericApiFieldMessages: Partial<Record<keyof CreateEventInput, string>> =
  {
    organizerId: "Choose a valid host organization.",
    name: "Enter an event name between 1 and 100 characters.",
    category: "Choose a valid event category.",
    description: "Enter a description between 1 and 200 characters.",
    format: "Choose an event format.",
    eventDates: "Enter valid event dates and times.",
    venueId: "Choose a valid venue.",
    venueName: "Select or enter a venue.",
    address: "Enter a valid venue address.",
    googleMapLink: "Enter a valid Google Maps URL.",
    visibility: "Choose who can discover this event.",
    registrationMode: "Choose who can register for this event.",
    entryMode: "Choose how guests will enter this event.",
  };

function mapFieldErrors(issues: z.ZodIssue[]): CreateEventFieldErrors {
  const errors: CreateEventFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0] as keyof CreateEventInput | undefined;
    if (!field || errors[field]) continue;

    errors[field] =
      field === "eventDates" && typeof issue.path[1] === "number"
        ? `Day ${issue.path[1] + 1}: ${issue.message}`
        : issue.message;
  }

  return errors;
}

function mapApiField(path: string): keyof CreateEventInput | undefined {
  const parts = path.replaceAll(/\[(\d+)\]/g, ".$1").split(".");

  if (parts[0] === "eventDates") {
    return "eventDates";
  }

  return apiFieldToFormField[parts[0] as keyof typeof apiFieldToFormField];
}

function parseJsonFormValue(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function friendlyApiFieldMessage(
  field: keyof CreateEventInput,
  message: string,
) {
  if (/endAt must be after startAt/i.test(message)) {
    return "End time must be after the start time.";
  }

  if (
    /^(invalid (?:data )?input|invalid event data|invalid uuid|too (?:big|small)|expected )/i.test(
      message,
    )
  ) {
    return genericApiFieldMessages[field] ?? message;
  }

  return message;
}

function mapApiValidationError(error: ProtectedApiError) {
  const parsed = apiValidationErrorSchema.safeParse(error.details);
  if (!parsed.success) return null;

  const errors: CreateEventFieldErrors = {};
  const messages = parsed.data.formErrors.filter(
    (message) =>
      message.trim() &&
      !/^(invalid (?:data )?input|invalid event data|validation failed)\.?$/i.test(
        message.trim(),
      ),
  );

  for (const [path, fieldMessages] of Object.entries(parsed.data.fieldErrors)) {
    const field = mapApiField(path);
    const pathParts = path.replaceAll(/\[(\d+)\]/g, ".$1").split(".");
    const message = fieldMessages.find((value) => value.trim());
    if (!message) continue;

    const friendlyMessage = field
      ? friendlyApiFieldMessage(field, message)
      : message;
    messages.push(friendlyMessage);
    if (field && !errors[field]) {
      const dateIndex = field === "eventDates" ? Number(pathParts[1]) : NaN;
      errors[field] = Number.isInteger(dateIndex)
        ? `Day ${dateIndex + 1}: ${friendlyMessage}`
        : friendlyMessage;
    }
  }

  return {
    errors,
    message:
      messages[0] ??
      "Plumpi could not validate this event. Review the event details and try again.",
  };
}

function thumbnailUploadErrorMessage(error: unknown) {
  if (!(error instanceof ProtectedApiError)) {
    return "The event was created, but its thumbnail could not be uploaded. Try adding it again in Plumpi.";
  }

  if (error.code === "EMPTY_THUMBNAIL_IMAGE") {
    return "The event was created, but the selected thumbnail is empty. Choose another image in Plumpi.";
  }
  if (error.code === "THUMBNAIL_IMAGE_TOO_LARGE" || error.status === 413) {
    return "The event was created, but its thumbnail is larger than 2 MB. Upload a smaller image in Plumpi.";
  }
  if (error.status === 403) {
    return "The event was created, but you do not have permission to update its thumbnail in Plumpi.";
  }
  if (error.status === 404) {
    return "The event was created, but Plumpi could not find it while uploading the thumbnail. Add it in Plumpi.";
  }
  if (error.status >= 500) {
    return "The event was created, but Plumpi could not upload its thumbnail right now. Add it in Plumpi when the service is available.";
  }

  return `The event was created, but its thumbnail could not be uploaded. ${error.message}`;
}

export async function createEventAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cookies = auth.setCookie ? [auth.setCookie] : [];
  let apiRequest = requestWithSetCookie(request, auth.setCookie);

  if (intent === PLUMPI_HANDOFF_INTENT) {
    const handoffParams = plumpiHandoffParamsSchema.safeParse({
      intent,
      eventId: formData.get("eventId"),
      organizationId: formData.get("organizationId"),
    });

    if (!handoffParams.success) {
      return withAuthData(
        { setCookie: cookies },
        {
          ok: false,
          error: "The created event could not be opened in Plumpi.",
        } satisfies CreateEventActionData,
        PLUMPI_HANDOFF_RESPONSE_INIT,
      );
    }

    try {
      const redirectTo = await resolvePlumpiHandoffUrl(
        apiRequest,
        handoffParams.data,
        cookies,
      );

      return withAuthData(
        { setCookie: cookies },
        { ok: true, redirectTo } satisfies CreateEventActionData,
        PLUMPI_HANDOFF_RESPONSE_INIT,
      );
    } catch (error) {
      console.error("Create event handoff step failed:", error);

      return withAuthData(
        { setCookie: cookies },
        {
          ok: false,
          error: plumpiHandoffErrorMessage(error),
        } satisfies CreateEventActionData,
        PLUMPI_HANDOFF_RESPONSE_INIT,
      );
    }
  }

  const cover = formData.get("cover");

  const parsed = CreateEventInputSchema.safeParse({
    organizerId: formData.get("organizerId"),
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    format: formData.get("format"),
    eventDates: parseJsonFormValue(formData.get("eventDates")),
    venueId: formData.get("venueId"),
    venueName: formData.get("venueName"),
    address: formData.get("address"),
    googleMapLink: formData.get("googleMapLink"),
    coverImageName: cover instanceof File ? cover.name : "",
    visibility: formData.get("visibility"),
    registrationMode: formData.get("registrationMode"),
    entryMode: formData.get("entryMode"),
  });
  const submissionMeta = submissionMetaSchema.safeParse({
    intent,
    eventDates: parseJsonFormValue(formData.get("eventDateRanges")),
  });

  const errors = parsed.success ? {} : mapFieldErrors(parsed.error.issues);
  if (!(cover instanceof File)) {
    errors.coverImageName = "Event thumbnail is required";
  } else {
    const coverError = validateCreateEventCover(cover);
    if (coverError) errors.coverImageName = coverError;
  }

  if (!submissionMeta.success) {
    const issue = submissionMeta.error.issues[0];
    const dateIndex =
      issue?.path[0] === "eventDates" && typeof issue.path[1] === "number"
        ? issue.path[1]
        : null;
    errors.eventDates =
      dateIndex === null
        ? "Enter at least one valid event date and time"
        : `Day ${dateIndex + 1}: ${issue?.message ?? "Enter a valid date and time"}`;
  } else if (
    parsed.success &&
    submissionMeta.data.eventDates.length !== parsed.data.eventDates.length
  ) {
    errors.eventDates =
      "Some event dates could not be validated. Please try again.";
  }

  if (
    !parsed.success ||
    !submissionMeta.success ||
    !(cover instanceof File) ||
    Object.keys(errors).length > 0
  ) {
    return withAuthData(auth, {
      ok: false,
      errors,
      error: "Please review the highlighted fields.",
    } satisfies CreateEventActionData);
  }

  try {
    const payload = {
      organizationId: parsed.data.organizerId,
      title: parsed.data.name,
      excerpt: parsed.data.description,
      eventCategories: [parsed.data.category],
      isOnline: false,
      ...(parsed.data.venueId
        ? { venueId: parsed.data.venueId }
        : { venueName: parsed.data.venueName }),
      address: parsed.data.address,
      ...(parsed.data.googleMapLink
        ? { googleMapLink: parsed.data.googleMapLink }
        : {}),
      eventDates: submissionMeta.data.eventDates,
      visibility: parsed.data.visibility,
      registrationMode: parsed.data.registrationMode,
      entryMode: parsed.data.entryMode,
    } satisfies postV1plumpievents_Body;

    const created = await createPlumpiEvent(apiRequest, payload);
    if (created.setCookie) {
      cookies.push(created.setCookie);
      apiRequest = requestWithSetCookie(apiRequest, created.setCookie);
    }

    const eventId = z.string().uuid().parse(created.data.event.id);
    let warning: string | undefined;

    try {
      const uploaded = await uploadPlumpiEventThumbnail(
        apiRequest,
        eventId,
        cover,
      );
      if (uploaded.setCookie) {
        cookies.push(uploaded.setCookie);
      }
    } catch (error) {
      warning = thumbnailUploadErrorMessage(error);
      console.error("Create event thumbnail step failed:", error);
    }

    return withAuthData({ setCookie: cookies }, {
      ok: true,
      eventId,
      warning,
    } satisfies CreateEventActionData);
  } catch (error) {
    console.error("Create event step failed:", error);

    if (error instanceof ProtectedApiError) {
      const validation = mapApiValidationError(error);
      if (validation) {
        return withAuthData({ setCookie: cookies }, {
          ok: false,
          errors: validation.errors,
          error: validation.message,
        } satisfies CreateEventActionData);
      }

      const message =
        error.status === 403
          ? "Plumpi did not allow this event to be created. Check your organization access and try again."
          : error.status === 503
            ? "Plumpi is temporarily unavailable. Your event details are still here, so please try again shortly."
            : error.status >= 500
              ? "Plumpi could not create the event right now. Please try again shortly."
              : error.message;

      return withAuthData({ setCookie: cookies }, {
        ok: false,
        error: message,
      } satisfies CreateEventActionData);
    }

    return withAuthData({ setCookie: cookies }, {
      ok: false,
      error: "Unable to create the event. Please try again.",
    } satisfies CreateEventActionData);
  }
}
