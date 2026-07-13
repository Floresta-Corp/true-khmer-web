import { redirect } from "react-router";
import type { Route } from "project-types/partner-registration/route/+types/partner-packages";

import { readPartnerCookie } from "./registration-cookie.server";

// Step 2 — require step 1 data; expose any already-selected package.
export async function partnerPackagesLoader({ request }: Route.LoaderArgs) {
  const cookie = readPartnerCookie(request);
  if (!cookie || !cookie.companyName) {
    throw redirect("/registration/partner-registration");
  }
  return { selectedPackage: cookie.package ?? null };
}
