import type { ActionFunctionArgs } from "react-router";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  parseVoteAction,
  submitVoteAction,
} from "~/features/forum/services/forum.vote-helpers";

export async function homeAction({ request }: ActionFunctionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();

  if (actionType === "vote-question") {
    const parsedVoteAction = parseVoteAction(formData);
    if (!parsedVoteAction.ok) {
      return respond({
        ok: false,
        message: parsedVoteAction.message,
      });
    }
    return respond(await submitVoteAction(request, parsedVoteAction));
  }

  return respond({
    ok: false,
    message: "Unsupported action.",
  });
}
