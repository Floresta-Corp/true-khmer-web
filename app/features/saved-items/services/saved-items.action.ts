import type { Route } from "project-types/saved-items/route/+types/saved-items";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import {
  saveEvent,
  saveItem,
  unsaveEvent,
  unsaveItem,
} from "~/api/saved-items/saved-items.server";
import {
  LocalSavedItemTypeSchema,
  SavedItemTypeSchema,
} from "~/features/saved-items/types";
import {
  parseVoteAction,
  submitVoteAction,
} from "~/features/forum/services/forum.vote-helpers";

/**
 * Two kinds of submission land here.
 *
 * The page's own bookmark buttons send `actionType: save | unsave` with the
 * item's type, which map onto the unified saved-items endpoints. The reused
 * domain cards send what they send everywhere else — a question vote, or a
 * volunteer save keyed on `opportunityId` — so those keep their own shapes and
 * are translated here.
 */
export async function savedItemsAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "vote-question") {
    const parsedVoteAction = parseVoteAction(formData);
    if (!parsedVoteAction.ok) {
      return withAuthJson(
        auth,
        { ok: false, error: parsedVoteAction.message },
        { status: 400 },
      );
    }
    return withAuthJson(
      auth,
      await submitVoteAction(request, parsedVoteAction),
    );
  }

  // The volunteer card's own save button, as posted on every other page.
  if (
    actionType === "save-opportunity" ||
    actionType === "unsave-opportunity"
  ) {
    const opportunityId = formData.get("opportunityId");
    if (typeof opportunityId !== "string" || !opportunityId) {
      return withAuthJson(
        auth,
        { ok: false, error: "Missing or invalid opportunityId" },
        { status: 400 },
      );
    }

    try {
      const result =
        actionType === "save-opportunity"
          ? await saveItem(request, "volunteer", opportunityId)
          : await unsaveItem(request, "volunteer", opportunityId);
      return withAuthJson(auth, { ok: true, saved: result?.data?.saved });
    } catch (error) {
      return handleFailure(auth, error);
    }
  }

  const rawType = formData.get("type");
  const rawItemId = formData.get("itemId");

  if (
    (actionType !== "save" && actionType !== "unsave") ||
    typeof rawItemId !== "string" ||
    !rawItemId
  ) {
    return withAuthJson(
      auth,
      { ok: false, error: "Missing or invalid actionType or itemId" },
      { status: 400 },
    );
  }

  const parsedType = SavedItemTypeSchema.safeParse(rawType);
  if (!parsedType.success) {
    return withAuthJson(
      auth,
      { ok: false, error: "Unknown saved item type" },
      { status: 400 },
    );
  }

  const type = parsedType.data;

  try {
    if (type === "event") {
      const result =
        actionType === "save"
          ? await saveEvent(request, rawItemId)
          : await unsaveEvent(request, rawItemId);
      return withAuthJson(auth, { ok: true, saved: result?.data?.saved });
    }

    const localType = LocalSavedItemTypeSchema.parse(type);
    const result =
      actionType === "save"
        ? await saveItem(request, localType, rawItemId)
        : await unsaveItem(request, localType, rawItemId);

    return withAuthJson(auth, { ok: true, saved: result?.data?.saved });
  } catch (error) {
    return handleFailure(auth, error);
  }
}

function handleFailure(
  auth: Parameters<typeof withAuthJson>[0],
  error: unknown,
) {
  if (error instanceof ProtectedApiError) {
    return withAuthJson(
      auth,
      { ok: false, error: error.message },
      { status: error.status },
    );
  }
  throw error;
}
