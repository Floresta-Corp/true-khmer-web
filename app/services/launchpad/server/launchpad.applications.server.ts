import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplyBatchRoleInput,
  ApplicationDocumentPresignInput,
  ApplicationDocumentPresignResponse,
  ApplyRoleInput,
  ApplyRoleResponse,
} from "../types/application";
import {
  ApplyBatchRoleInputSchema,
  ApplicationDocumentPresignInputSchema,
  ApplyRoleInputSchema,
} from "../types/application";

export async function uploadApplicationDocumentPresign(
  request: Request,
  launchpadId: string,
  input: ApplicationDocumentPresignInput,
) {
  const encodedLaunchpadId = encodeURIComponent(launchpadId);
  const body = ApplicationDocumentPresignInputSchema.parse(input);
  return apiRequestWithSession<ApplicationDocumentPresignResponse>(
    request,
    `/launchpad/${encodedLaunchpadId}/applications/document/presign`,
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
  const encodedLaunchpadId = encodeURIComponent(launchpadId);
  const body = ApplyRoleInputSchema.parse(input);
  return apiRequestWithSession<ApplyRoleResponse>(
    request,
    `/launchpad/${encodedLaunchpadId}/applications`,
    {
      method: "POST",
      body,
    },
  );
}

export async function applyForLaunchpadRolesBatch(
  request: Request,
  launchpadId: string,
  input: ApplyBatchRoleInput,
) {
  const encodedLaunchpadId = encodeURIComponent(launchpadId);
  const body = ApplyBatchRoleInputSchema.parse(input);
  return apiRequestWithSession<ApplyRoleResponse>(
    request,
    `/launchpad/${encodedLaunchpadId}/applications/batch`,
    {
      method: "POST",
      body,
    },
  );
}
