import type { ActionFunctionArgs } from "react-router";
import { postMyApplicationChangeStatus } from "~/services/myspace/server/my-application.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const sourceType = formData.get("sourceType");
  const applicationId = formData.get("applicationId");
  const statusAction = formData.get("statusAction");

  if (typeof sourceType !== "string" || !sourceType) {
    return Response.json({ ok: false, error: "Missing source type" }, { status: 400 });
  }

  if (typeof applicationId !== "string" || !applicationId) {
    return Response.json({ ok: false, error: "Missing application ID" }, { status: 400 });
  }

  if (typeof statusAction !== "string" || !statusAction) {
    return Response.json({ ok: false, error: "Missing status action" }, { status: 400 });
  }

  const VALID_STATUS_ACTIONS = ["confirm", "decline", "withdraw"] as const;
  type ValidStatusAction = (typeof VALID_STATUS_ACTIONS)[number];
  if (!(VALID_STATUS_ACTIONS as readonly string[]).includes(statusAction)) {
    return Response.json({ ok: false, error: "Invalid status action" }, { status: 400 });
  }
  const validatedAction: ValidStatusAction = statusAction as ValidStatusAction;

  const result = await postMyApplicationChangeStatus(
    request,
    sourceType,
    applicationId,
    validatedAction,
  );

  return Response.json(result.data, { status: 200 });
}
