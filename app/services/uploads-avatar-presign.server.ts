import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { FileInput, UploadAvatarPresignResponse } from "./types";

export async function UploadAvatarPresign(request: Request, input: FileInput) {
  const result = await apiRequestWithSession<
    UploadAvatarPresignResponse,
    FileInput
  >(request, "/uploads/avatar/presign", {
    method: "POST",
    body: input,
  });
  return result;
}
