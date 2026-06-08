import { apiRequestWithOptionalSession } from "~/lib/server/api-client.server";
import type { GetProfileByIdResponse } from "~/services/profile/types";

export async function GetProfileById(request: Request, id: string) {
  return await apiRequestWithOptionalSession<GetProfileByIdResponse>(
    request,
    `/profile/${encodeURIComponent(id)}`,
    {
      method: "GET",
    },
  );
}
