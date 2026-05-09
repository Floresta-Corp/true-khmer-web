import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicationDocumentPresignInput,
  ApplicationDocumentPresignResponse,
  ApplyRoleInput,
  ApplyRoleResponse,
} from "../types/application";
import {
  ApplicationDocumentPresignInputSchema,
  ApplyRoleInputSchema,
} from "../types/application";

export async function uploadApplicationDocumentPresign(
  request: Request,
  launchpadId: string,
  input: ApplicationDocumentPresignInput,
) {
  const body = ApplicationDocumentPresignInputSchema.parse(input);
  return apiRequestWithSession<ApplicationDocumentPresignResponse>(
    request,
    `/launchpad/${launchpadId}/applications/document/presign`,
    {
      method: "POST",
      body,
    },
  );
}

export async function applyForLaunchpadRole(
  request: Request,
  launchpadId: string,
  input: ApplyRoleInput,
) {
  const body = ApplyRoleInputSchema.parse(input);
  return apiRequestWithSession<ApplyRoleResponse>(
    request,
    `/launchpad/${launchpadId}/applications`,
    {
      method: "POST",
      body,
    },
  );
}
