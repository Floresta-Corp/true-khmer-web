import { data, redirect } from "react-router";
import type { Route } from "project-types/partner-registration/route/+types/partner-packages";

import { packageSchema } from "./registration-validation";
import {
  readPartnerCookie,
  setPartnerCookie,
} from "./registration-cookie.server";

// Step 2 — validate the chosen package, persist it, advance to contact person.
export async function partnerPackagesAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const selectedPackage = String(formData.get("selectedPackage") ?? "");

  const parsed = packageSchema.safeParse(selectedPackage);
  if (!parsed.success) {
    return data(
      { ok: false, error: "Please select a package to continue." },
      { status: 400 },
    );
  }

  const cookie = readPartnerCookie(request);
  if (!cookie || !cookie.companyName) {
    throw redirect("/registration/partner-registration");
  }

  const updated = { ...cookie, package: parsed.data };
  return redirect(
    "/registration/partner-registration/choose-package/contact-person",
    { headers: { "Set-Cookie": setPartnerCookie(updated) } },
  );
}
