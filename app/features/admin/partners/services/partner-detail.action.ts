import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/partners/route/+types/partners.$partnerId";

import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import {
  deleteManagedPartner,
  updateManagedPartner,
} from "~/api/admin/partners/partners.server";

const RESTRICTED_MESSAGE = "Partner management is restricted to Super Admins.";

export async function partnerDetailAction({
  request,
  params,
}: Route.ActionArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);

  const partnerId = params.partnerId;
  if (!partnerId) {
    throw new Response("Partner ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const action = formData.get("action");

  try {
    if (action === "delete") {
      const result = await deleteManagedPartner(request, partnerId);
      return redirect("/tk-admin/partners", {
        ...(result.setCookie
          ? { headers: { "Set-Cookie": result.setCookie } }
          : {}),
      });
    }

    if (action === "togglePublish") {
      const currentStatus = formData.get("currentStatus") === "true";
      const result = await updateManagedPartner(request, partnerId, {
        isPublished: !currentStatus,
      });
      return data(
        {
          success: true,
          message: `Partner has been ${!currentStatus ? "published" : "unpublished"} successfully`,
          type: "publish",
        },
        {
          ...(result.setCookie
            ? { headers: { "Set-Cookie": result.setCookie } }
            : {}),
        },
      );
    }

    if (action === "toggleStatus") {
      const currentStatus = formData.get("currentStatus") as string;
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const result = await updateManagedPartner(request, partnerId, {
        status: newStatus,
      });
      return data(
        {
          success: true,
          message: `Partner has been ${newStatus.toLowerCase()} successfully`,
          type: "status",
        },
        {
          ...(result.setCookie
            ? { headers: { "Set-Cookie": result.setCookie } }
            : {}),
        },
      );
    }
  } catch (error) {
    console.error("Error processing partner action:", error);
    return data({
      success: false,
      message: "Failed to process action. Please try again.",
      variant: "error",
    });
  }

  return data({ success: true });
}
