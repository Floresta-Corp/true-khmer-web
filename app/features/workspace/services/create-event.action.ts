import { z } from "zod";
import type { Route } from "project-types/workspace/route/+types/my-events.create";
import {
  createPlumpiEvent,
  createPlumpiHandoff,
  uploadPlumpiEventCover,
} from "~/api/events/events.server";
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
import type { postV1plumpievents_Body } from "~/types/api-client";

const submissionMetaSchema = z.object({
  intent: z.literal("create-draft"),
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }),
});

const handoffParamsSchema = z.object({
  intent: z.literal("continue-to-plumpi"),
  eventId: z.string().uuid(),
  organizationId: z.string().uuid(),
});

const HANDOFF_RESPONSE_INIT = {
  headers: { "Cache-Control": "private, no-store" },
} satisfies ResponseInit;

class ExpiredPlumpiHandoffError extends Error {
  constructor() {
    super("The Plumpi handoff token expired before redirect.");
    this.name = "ExpiredPlumpiHandoffError";
  }
}

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
    startTime: "Enter a valid event start date and time.",
    endTime: "Enter a valid event end time.",
    visibility: "Choose who can discover this event.",
    registrationMode: "Choose who can register for this event.",
    entryMode: "Choose how guests will enter this event.",
  };

function mapFieldErrors(issues: z.ZodIssue[]): CreateEventFieldErrors {
  const errors: CreateEventFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0] as keyof CreateEventInput | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }

  return errors;
}

function mapApiField(path: string): keyof CreateEventInput | undefined {
  const parts = path.replaceAll(/\[(\d+)\]/g, ".$1").split(".");

  if (parts[0] === "eventDates") {
    return parts.includes("endAt") ? "endTime" : "startTime";
  }

  return apiFieldToFormField[parts[0] as keyof typeof apiFieldToFormField];
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
    const message = fieldMessages.find((value) => value.trim());
    if (!message) continue;

    const friendlyMessage = field
      ? friendlyApiFieldMessage(field, message)
      : message;
    messages.push(friendlyMessage);
    if (field && !errors[field]) errors[field] = friendlyMessage;
  }

  return {
    errors,
    message:
      messages[0] ??
      "Plumpi could not validate this event. Review the event details and try again.",
  };
}

function handoffErrorMessage(error: unknown) {
  if (error instanceof ExpiredPlumpiHandoffError) {
    return "The secure Plumpi link expired before it could be opened. Please try again.";
  }

  if (!(error instanceof ProtectedApiError)) {
    return "The event was created, but Plumpi could not be opened automatically.";
  }

  if (error.status === 409) {
    return "This Plumpi account is already connected to another True Khmer account.";
  }
  if (error.status === 403) {
    return "Your Plumpi account cannot be connected. Check your account access and try again.";
  }
  if (error.status === 503) {
    return "Plumpi is temporarily unavailable. Your draft is safe in My Events, so you can try again later.";
  }
  if (error.status >= 500) {
    return "Your draft was created, but Plumpi could not be opened right now. Try again from My Events.";
  }

  return error.message;
}

function coverUploadErrorMessage(error: unknown) {
  if (!(error instanceof ProtectedApiError)) {
    return "The event was created, but its cover could not be uploaded. Try adding it again in Plumpi.";
  }

  if (error.code === "EMPTY_COVER_IMAGE") {
    return "The event was created, but the selected cover image is empty. Choose another image in Plumpi.";
  }
  if (error.code === "COVER_IMAGE_TOO_LARGE" || error.status === 413) {
    return "The event was created, but its cover is larger than 2 MB. Upload a smaller image in Plumpi.";
  }
  if (error.status === 403) {
    return "The event was created, but you do not have permission to update its cover in Plumpi.";
  }
  if (error.status === 404) {
    return "The event was created, but Plumpi could not find it while uploading the cover. Add the cover in Plumpi.";
  }
  if (error.status >= 500) {
    return "The event was created, but Plumpi could not upload its cover right now. Add it in Plumpi when the service is available.";
  }

  return `The event was created, but its cover could not be uploaded. ${error.message}`;
}

function plumpiHandoffUrl(
  organizationId: string,
  eventId: string,
  handoffToken: string,
) {
  const baseUrl = process.env.VITE_PLUMPI_WEB?.trim();
  if (!baseUrl) {
    throw new Error("Plumpi web URL is not configured.");
  }

  const nextPath = `/console/${encodeURIComponent(organizationId)}/events/${encodeURIComponent(eventId)}`;
  const url = new URL("/auth/handoff", baseUrl);
  url.searchParams.set("token", handoffToken);
  url.searchParams.set("nextPath", nextPath);
  return url.toString();
}

export async function createEventAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cookies = auth.setCookie ? [auth.setCookie] : [];
  let apiRequest = requestWithSetCookie(request, auth.setCookie);

  if (intent === "continue-to-plumpi") {
    const handoffParams = handoffParamsSchema.safeParse({
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
        HANDOFF_RESPONSE_INIT,
      );
    }

    try {
      const handoff = await createPlumpiHandoff(apiRequest);
      if (handoff.setCookie) cookies.push(handoff.setCookie);

      if (Date.now() >= new Date(handoff.data.expiresAt).getTime()) {
        throw new ExpiredPlumpiHandoffError();
      }

      return withAuthData(
        { setCookie: cookies },
        {
          ok: true,
          redirectTo: plumpiHandoffUrl(
            handoffParams.data.organizationId,
            handoffParams.data.eventId,
            handoff.data.token,
          ),
        } satisfies CreateEventActionData,
        HANDOFF_RESPONSE_INIT,
      );
    } catch (error) {
      console.error("Create event handoff step failed:", error);

      return withAuthData(
        { setCookie: cookies },
        {
          ok: false,
          error: handoffErrorMessage(error),
        } satisfies CreateEventActionData,
        HANDOFF_RESPONSE_INIT,
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
    startDate: formData.get("startDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    coverImageName: cover instanceof File ? cover.name : "",
    visibility: formData.get("visibility"),
    registrationMode: formData.get("registrationMode"),
    entryMode: formData.get("entryMode"),
  });
  const submissionMeta = submissionMetaSchema.safeParse({
    intent,
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
  });

  const errors = parsed.success ? {} : mapFieldErrors(parsed.error.issues);
  if (!(cover instanceof File)) {
    errors.coverImageName = "An event cover is required";
  } else {
    const coverError = validateCreateEventCover(cover);
    if (coverError) errors.coverImageName = coverError;
  }

  if (!submissionMeta.success) {
    const invalidDateTime = submissionMeta.error.issues.some((issue) =>
      ["startAt", "endAt"].includes(String(issue.path[0])),
    );
    if (invalidDateTime) {
      errors.startTime = "Enter a valid event date and time";
    }
  } else if (
    new Date(submissionMeta.data.endAt) <= new Date(submissionMeta.data.startAt)
  ) {
    errors.endTime = "End time must be after the start time";
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
      isOnline: parsed.data.format === "ONLINE",
      eventDates: [
        {
          startAt: submissionMeta.data.startAt,
          endAt: submissionMeta.data.endAt,
        },
      ],
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
      const uploaded = await uploadPlumpiEventCover(apiRequest, eventId, cover);
      if (uploaded.setCookie) {
        cookies.push(uploaded.setCookie);
      }
    } catch (error) {
      warning = coverUploadErrorMessage(error);
      console.error("Create event cover step failed:", error);
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
