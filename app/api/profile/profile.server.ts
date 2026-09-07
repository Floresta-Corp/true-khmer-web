import { apiRequestWithOptionalSession } from "~/lib/server/api-client.server";
import type {
  GetPostedContentResponse,
  GetProfileByIdResponse,
} from "~/features/profile/types";
import type { ListCertificatesResponse } from "~/api/education/education.server";

export async function GetProfileById(request: Request, id: string) {
  return await apiRequestWithOptionalSession<GetProfileByIdResponse>(
    request,
    `/profile/${encodeURIComponent(id)}`,
    {
      method: "GET",
    },
  );
}

export async function GetProfileCertificates(
  request: Request,
  userId: string,
  params: { page?: number; limit?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const suffix = query.size > 0 ? `?${query.toString()}` : "";

  return await apiRequestWithOptionalSession<ListCertificatesResponse>(
    request,
    `/profile/${encodeURIComponent(userId)}/certificates${suffix}`,
    { method: "GET" },
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
