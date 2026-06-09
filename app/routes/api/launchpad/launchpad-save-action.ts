import type { ActionFunctionArgs } from "react-router";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import {
  saveLaunchpad,
  unsaveLaunchpad,
} from "~/services/launchpad/server/launchpad.opportunities.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export async function LaunchpadSaveAction({ request }: ActionFunctionArgs) {
  const auth = await requireUser(request);

  const formData = await request.formData();
  const launchpadId = formData.get("launchpadId");
  const intent = formData.get("intent");

  if (typeof launchpadId !== "string" || !launchpadId) {
    return withAuthJson(
      auth,
      { ok: false, error: "Missing launchpadId" },
      { status: 400 },
    );
  }

  try {
    if (intent === "save") {
      await saveLaunchpad(request, launchpadId);
      return withAuthJson(auth, { ok: true, saved: true });
    } else if (intent === "unsave") {
      await unsaveLaunchpad(request, launchpadId);
      return withAuthJson(auth, { ok: true, saved: false });
    }
    return withAuthJson(
      auth,
      { ok: false, error: "Invalid intent" },
      { status: 400 },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return withAuthJson(
        auth,
        { ok: false, error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
