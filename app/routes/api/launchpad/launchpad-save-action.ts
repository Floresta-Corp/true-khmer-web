import type { ActionFunctionArgs } from "react-router";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  saveLaunchpad,
  unsaveLaunchpad,
} from "~/services/launchpad/server/launchpad.opportunities.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export async function LaunchpadSaveAction({ request }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  const formData = await request.formData();
  const launchpadId = formData.get("launchpadId");
  const intent = formData.get("intent");

  if (typeof launchpadId !== "string" || !launchpadId) {
    return Response.json(
      { ok: false, error: "Missing launchpadId" },
      { status: 400 },
    );
  }

  try {
    if (intent === "save") {
      await saveLaunchpad(request, launchpadId);
      return Response.json({ ok: true, saved: true });
    } else if (intent === "unsave") {
      await unsaveLaunchpad(request, launchpadId);
      return Response.json({ ok: true, saved: false });
    }
    return Response.json(
      { ok: false, error: "Invalid intent" },
      { status: 400 },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return Response.json(
        { ok: false, error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
