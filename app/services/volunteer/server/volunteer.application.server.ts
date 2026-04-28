import {
  apiRequestWithSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  ApplyApplicationInputSchema,
  UploadApplicationDocumentSchema,
  type ApplyApplicationInput,
  type ApplyApplicationResponse,
  type UploadApplicationDocumentInput,
  type UploadApplicationDocumentResponse,
} from "../volunteer-types";

export async function ApplyApplication(
  request: Request,
  input: ApplyApplicationInput,
) {
  const body = ApplyApplicationInputSchema.parse(input);
  try {
    const result = await apiRequestWithSession<ApplyApplicationResponse>(
      request,
      "",
      {
        method: "POST",
        body,
      },
    );
    return result;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function uploadDocumentApplication(
  request: Request,
  input: UploadApplicationDocumentInput,
) {
  const body = UploadApplicationDocumentSchema.parse(input);
  return apiRequestWithSession<
    UploadApplicationDocumentResponse,
    UploadApplicationDocumentInput
  >(request, "/volunteer/applications/document/presign", {
    method: "POST",
    body,
  });
}
