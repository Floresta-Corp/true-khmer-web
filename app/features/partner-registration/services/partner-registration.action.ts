import { data, redirect } from "react-router";
import type { Route } from "project-types/partner-registration/route/+types/partner-registration";

import {
  companyStepSchema,
  fieldErrorsFromZod,
} from "./registration-validation";
import {
  readPartnerCookie,
  setPartnerCookie,
} from "./registration-cookie.server";

// Step 1 — validate company info, persist to the cookie, advance to packages.
export async function partnerRegistrationAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const parsed = companyStepSchema.safeParse(raw);
  if (!parsed.success) {
    return data(
      { ok: false, validationErrors: fieldErrorsFromZod(parsed.error) },
      { status: 400 },
    );
  }

  const existing = readPartnerCookie(request) ?? {};
  const cookieData = { ...existing, ...parsed.data };

  return redirect("/registration/partner-registration/choose-package", {
    headers: { "Set-Cookie": setPartnerCookie(cookieData) },
  });
}
