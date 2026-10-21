import { data } from "react-router";
import type { Route } from "project-types/contact/route/+types/contact";
import { SendContactMessage } from "~/api/contact/contact.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  contactFieldErrors,
  contactFormSchema,
  type ContactFieldErrors,
  type ContactFormField,
} from "../lib/contact-schema";

export type ContactActionResult =
  | {
      ok: true;
      message: string;
      remaining: number;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: ContactFieldErrors;
      /** Set when the daily limit is reached. */
      retryAt?: string;
    };

const FIELDS: ContactFormField[] = [
  "category",
  "name",
  "email",
  "subject",
  "message",
];

/** Maps the API's `issues: [{ path, message }]` back onto form fields. */
function fieldErrorsFromApi(details: unknown): ContactFieldErrors | undefined {
  const issues = (details as { issues?: unknown } | undefined)?.issues;
  if (!Array.isArray(issues)) return undefined;

  const errors: ContactFieldErrors = {};
  for (const issue of issues as Array<{ path?: string; message?: string }>) {
    const field = issue.path?.split(".")[0] as ContactFormField | undefined;
    if (field && FIELDS.includes(field) && !errors[field] && issue.message) {
      errors[field] = issue.message;
    }
  }
  return Object.keys(errors).length > 0 ? errors : undefined;
}

export async function contactAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(
    [...FIELDS, "website"].map((key) => [key, String(formData.get(key) ?? "")]),
  );

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return data<ContactActionResult>(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fieldErrors: contactFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    const result = await SendContactMessage(request, parsed.data);
    return data<ContactActionResult>(
      {
        ok: true,
        message: result.data.message,
        remaining: result.data.rateLimit.remaining,
      },
      result.setCookie ? { headers: { "Set-Cookie": result.setCookie } } : {},
    );
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      const details = error.details as
        | { error?: string; retryAt?: string }
        | undefined;

      if (error.status === 429) {
        return data<ContactActionResult>(
          {
            ok: false,
            error:
              details?.error ??
              "You've reached today's limit for contact messages.",
            retryAt: details?.retryAt,
          },
          { status: 429 },
        );
      }

      if (error.status === 400) {
        return data<ContactActionResult>(
          {
            ok: false,
            error: "Please check the highlighted fields.",
            fieldErrors: fieldErrorsFromApi(error.details),
          },
          { status: 400 },
        );
      }

      return data<ContactActionResult>(
        {
          ok: false,
          error:
            details?.error ??
            "We couldn't send your message right now. Please try again shortly.",
        },
        { status: error.status >= 500 ? 503 : error.status },
      );
    }

    console.error("[contact] failed to send message", error);
    return data<ContactActionResult>(
      {
        ok: false,
        error:
          "We couldn't send your message right now. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}
