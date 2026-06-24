import { apiRequestWithOptionalSession } from "~/lib/server/api-client.server";
import type {
  GetPostedContentResponse,
  GetProfileByIdResponse,
} from "~/services/profile/types";

export async function GetProfileById(request: Request, id: string) {
  return await apiRequestWithOptionalSession<GetProfileByIdResponse>(
    request,
    `/profile/${encodeURIComponent(id)}`,
    {
      method: "GET",
    },
  );
}

export async function GetPostedContent(
  request: Request,
  userId: string,
  sourceType: "forum" | "volunteer" | "project" = "forum",
  cursor?: string | null,
  limit?: number,
) {
  const params = new URLSearchParams({ sourceType });
  if (cursor) params.set("cursor", cursor);
  if (limit != null) params.set("limit", String(limit));
  return await apiRequestWithOptionalSession<GetPostedContentResponse>(
    request,
    `/profile/${encodeURIComponent(userId)}/posted?${params}`,
    {
      method: "GET",
    },
  );
}
