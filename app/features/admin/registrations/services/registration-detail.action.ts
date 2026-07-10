import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/registrations/route/+types/registrations.partner.$partnerId";

import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { updatePartnerRegistrationStatus } from "~/api/admin/registrations/registrations.server";

const RESTRICTED_MESSAGE =
  "Partner registrations are restricted to Super Admins.";

export async function registrationDetailAction({
  request,
  params,
}: Route.ActionArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);

  const partnerId = params.partnerId;
  if (!partnerId) {
    throw new Response("Partner ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const action = String(formData.get("action") ?? "");

  if (action !== "ACTIVE" && action !== "DELETE") {
    return data({ ok: false, error: "Invalid action" }, { status: 400 });
  }

  const result = await updatePartnerRegistrationStatus(
    request,
    partnerId,
    action,
  );

  // Approve (ACTIVE) or reject (DELETE) both return to the registrations list.
  return redirect("/tk-admin/registrations", {
    ...(result.setCookie
      ? { headers: { "Set-Cookie": result.setCookie } }
      : {}),
  });
}
