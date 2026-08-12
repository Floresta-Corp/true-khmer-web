import type { VolunteerStatusFilter } from "~/features/admin/manage-content/types";
import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  AdminDeletePostResponse,
  AdminSuspendPostBody,
  AdminSuspendVolunteerPostResponse,
  AdminVolunteerPostResponse,
  AdminVolunteerPostsResponse,
} from "~/types/api-client";

export interface VolunteerPaginationParams {
  cursor?: string;
  limit?: number;
  categoryId?: string;
  locationId?: string;
  search?: string;
  status?: VolunteerStatusFilter;
}

/**
 * The moderation listing: suspended posts are included (the member and public
 * lists hide them), as are posts in an archived category or deactivated city.
 * Deleted posts appear only when `status=DELETED` is asked for.
 */
export async function getAdminVolunteer(
  request: Request,
  accessToken: string,
  params: VolunteerPaginationParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.categoryId) queryParams.set("categoryId", params.categoryId);
  if (params.locationId) queryParams.set("locationId", params.locationId);
  if (params.search) queryParams.set("search", params.search);
  if (params.status) queryParams.set("status", params.status);

  return apiRequestWithAccessToken<AdminVolunteerPostsResponse>(
    request,
    accessToken,
    `/admin/posts/volunteer?${queryParams.toString()}`,
    { method: "GET" },
  );
}

/**
 * Reads a post at any status — live, in progress, completed, canceled,
 * suspended, or deleted — with its suspension reason. The view count is not
 * incremented, so moderating a listing doesn't inflate its stats.
 */
export async function getAdminVolunteerById(
  request: Request,
  accessToken: string,
  opportunityId: string,
) {
  return apiRequestWithAccessToken<AdminVolunteerPostResponse>(
    request,
    accessToken,
    `/admin/posts/volunteer/${encodeURIComponent(opportunityId)}`,
    { method: "GET" },
  );
}

export async function deleteVolunteer(
  request: Request,
  accessToken: string,
  opportunityId: string,
) {
  return apiRequestWithAccessToken<AdminDeletePostResponse>(
    request,
    accessToken,
    `/admin/posts/volunteer/${encodeURIComponent(opportunityId)}`,
    { method: "DELETE" },
  );
}

export async function suspendVolunteer(
  request: Request,
  accessToken: string,
  opportunityId: string,
  body: AdminSuspendPostBody = {},
) {
  return apiRequestWithAccessToken<
    AdminSuspendVolunteerPostResponse,
    AdminSuspendPostBody
  >(
    request,
    accessToken,
    `/admin/posts/volunteer/${encodeURIComponent(opportunityId)}/suspend`,
    { method: "POST", body },
  );
}

export async function unsuspendVolunteer(
  request: Request,
  accessToken: string,
  opportunityId: string,
) {
  return apiRequestWithAccessToken<AdminSuspendVolunteerPostResponse>(
    request,
    accessToken,
    `/admin/posts/volunteer/${encodeURIComponent(opportunityId)}/unsuspend`,
    { method: "POST" },
  );
}
