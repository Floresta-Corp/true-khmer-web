import { data, redirect } from "react-router";
import type { Route } from "project-types/partner-registration/route/+types/contact-person";

import { ProtectedApiError } from "~/lib/server/api-client.server";
import { submitPartnerRegistration } from "~/api/partner/partner-registration.server";
import type {
  CompanyRegistrationData,
  PartnerPackage,
  PartnerRegistrationPayload,
} from "../types";
import {
  contactStepSchema,
  fieldErrorsFromZod,
} from "./registration-validation";
import { clearPartnerCookie, readPartnerCookie } from "./registration-cookie.server";

// Step 3 (final) — validate contact info, assemble the full payload, POST to the
// API, clear the cookie and redirect to the success page.
export async function contactPersonAction({ request }: Route.ActionArgs) {
  const cookie = readPartnerCookie(request);
  if (!cookie || !cookie.companyName || !cookie.package) {
    return data(
      { ok: false, error: "Registration session expired. Please start again." },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const parsed = contactStepSchema.safeParse(raw);
  if (!parsed.success) {
    return data(
      { ok: false, validationErrors: fieldErrorsFromZod(parsed.error) },
      { status: 400 },
    );
  }

  const payload: PartnerRegistrationPayload = {
    ...(cookie as CompanyRegistrationData),
    package: cookie.package as PartnerPackage,
    ...parsed.data,
  };

  try {
    await submitPartnerRegistration(request, payload);
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      const details = error.details as
        | { error?: string; validationErrors?: Record<string, string> }
        | undefined;
      if (details?.validationErrors) {
        return data(
          { ok: false, validationErrors: details.validationErrors },
          { status: error.status },
        );
      }
      return data(
        { ok: false, error: details?.error ?? error.message },
        { status: error.status },
      );
    }
    return data(
      { ok: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }

  return redirect("/registration/successfully?type=partner", {
    headers: { "Set-Cookie": clearPartnerCookie() },
  });
}
