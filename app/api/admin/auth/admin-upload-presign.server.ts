import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type { FileInput } from "~/services/types";
import type { AdminPresignAvatarUploadResponse } from "~/types/api-client";

export async function AdminUploadPresign(
  request: Request,
  accessToken: string,
  input: FileInput,
) {
  const result = await apiRequestWithAccessToken<AdminPresignAvatarUploadResponse>(
    request,
    accessToken,
    "/admin/presign-avatar",
    {
      method: "POST",
      body: input,
    },
  );
  return result;
}
