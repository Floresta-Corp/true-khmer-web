import { redirect } from "react-router";
import type { Route } from "project-types/partner-registration/route/+types/contact-person";

import { readPartnerCookie } from "./registration-cookie.server";

// Step 3 — require both step 1 (company) and step 2 (package) data.
export async function contactPersonLoader({ request }: Route.LoaderArgs) {
  const cookie = readPartnerCookie(request);
  if (!cookie || !cookie.companyName || !cookie.package) {
    throw redirect("/registration/partner-registration");
  }
  return null;
}
