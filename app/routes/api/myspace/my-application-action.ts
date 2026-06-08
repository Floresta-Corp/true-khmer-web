import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  errorActionResponse,
  transformActionResponse,
} from "~/lib/server/action-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  postMyApplicationArchiveAction,
  postMyApplicationChangeStatus,
} from "~/services/myspace/server/my-application.server";
import {
  MyApplicationArchiveActionSchema,
  MyApplicationRequestSourceTypeSchema,
  MyApplicationStatusActionSchema,
} from "~/services/myspace/types";

export async function MyApplicationAction({ request }: ActionFunctionArgs) {
  await requireUser(request);

  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "");
  const sourceType = String(formData.get("sourceType") ?? "");
  const parsedSourceType =
    MyApplicationRequestSourceTypeSchema.safeParse(sourceType);

  if (!parsedSourceType.success) {
    return errorActionResponse("Invalid source type.");
  }

  try {
    switch (actionType) {
      case "change-status": {
        const applicationId = String(formData.get("applicationId") ?? "");
        const statusAction = String(formData.get("statusAction") ?? "");

        if (!applicationId) {
          return errorActionResponse("Missing application id.");
        }

        const parsedStatusAction =
          MyApplicationStatusActionSchema.safeParse(statusAction);
        if (!parsedStatusAction.success) {
          return errorActionResponse("Invalid status action.");
        }

        const result = await postMyApplicationChangeStatus(
          request,
          parsedSourceType.data,
          applicationId,
          parsedStatusAction.data,
        );

        return transformActionResponse(result.data);
      }

      case "archive": {
        const opportunityId = String(formData.get("opportunityId") ?? "");
        const archiveAction = String(formData.get("archiveAction") ?? "");

        if (!opportunityId) {
          return errorActionResponse("Missing opportunity id.");
        }

        const parsedArchiveAction =
          MyApplicationArchiveActionSchema.safeParse(archiveAction);
        if (!parsedArchiveAction.success) {
          return errorActionResponse("Invalid archive action.");
        }

        const result = await postMyApplicationArchiveAction(
          request,
          parsedSourceType.data,
          opportunityId,
          parsedArchiveAction.data,
        );

        return transformActionResponse(result.data);
      }

      default:
        return errorActionResponse("Unsupported action.");
    }
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return errorActionResponse(error.message);
    }

    console.error("Unexpected my application action error:", error);
    return errorActionResponse("Something went wrong. Please try again.");
  }
}
