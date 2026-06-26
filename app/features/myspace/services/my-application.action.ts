import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  errorActionResponse,
  transformActionResponse,
} from "~/lib/server/action-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  postMyApplicationArchiveAction,
  postMyApplicationChangeStatus,
} from "~/routes/api/myspace/my-application.server";
import {
  MyApplicationArchiveActionSchema,
  MyApplicationRequestSourceTypeSchema,
  MyApplicationStatusActionSchema,
} from "~/features/myspace/types";

export async function myApplicationAction({ request }: ActionFunctionArgs) {
  const auth = await requireUser(request);

  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "");
  const sourceType = String(formData.get("sourceType") ?? "");
  const parsedSourceType =
    MyApplicationRequestSourceTypeSchema.safeParse(sourceType);

  if (!parsedSourceType.success) {
    return withAuthData(auth, errorActionResponse("Invalid source type."));
  }

  try {
    switch (actionType) {
      case "change-status": {
        const applicationId = String(formData.get("applicationId") ?? "");
        const statusAction = String(formData.get("statusAction") ?? "");

        if (!applicationId) {
          return withAuthData(auth, errorActionResponse("Missing application id."));
        }

        const parsedStatusAction =
          MyApplicationStatusActionSchema.safeParse(statusAction);
        if (!parsedStatusAction.success) {
          return withAuthData(auth, errorActionResponse("Invalid status action."));
        }

        const result = await postMyApplicationChangeStatus(
          request,
          parsedSourceType.data,
          applicationId,
          parsedStatusAction.data,
        );

        return withAuthData(auth, transformActionResponse(result.data));
      }

      case "archive": {
        const opportunityId = String(formData.get("opportunityId") ?? "");
        const archiveAction = String(formData.get("archiveAction") ?? "");

        if (!opportunityId) {
          return withAuthData(auth, errorActionResponse("Missing opportunity id."));
        }

        const parsedArchiveAction =
          MyApplicationArchiveActionSchema.safeParse(archiveAction);
        if (!parsedArchiveAction.success) {
          return withAuthData(auth, errorActionResponse("Invalid archive action."));
        }

        const result = await postMyApplicationArchiveAction(
          request,
          parsedSourceType.data,
          opportunityId,
          parsedArchiveAction.data,
        );

        return withAuthData(auth, transformActionResponse(result.data));
      }

      default:
        return withAuthData(auth, errorActionResponse("Unsupported action."));
    }
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return withAuthData(auth, errorActionResponse(error.message), {
        status: error.status,
      });
    }

    console.error("Unexpected my application action error:", error);
    return withAuthData(
      auth,
      errorActionResponse("Something went wrong. Please try again."),
    );
  }
}
