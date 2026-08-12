import type { LaunchpadStatusFilter } from "~/features/admin/manage-content/types";
import type { LaunchpadSortBy } from "~/features/launchpad/types";
import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  AdminDeletePostResponse,
  AdminLaunchpadPostResponse,
  AdminLaunchpadPostsResponse,
  AdminSuspendLaunchpadPostResponse,
  AdminSuspendPostBody,
} from "~/types/api-client";

export interface LaunchpadPaginationParams {
  cursor?: string;
  limit?: number;
  categoryId?: string;
  cityId?: string;
  sortBy?: LaunchpadSortBy;
  search?: string;
  status?: LaunchpadStatusFilter;
}

export async function getAdminLaunchpad(
  request: Request,
  accessToken: string,
  params: LaunchpadPaginationParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.categoryId) queryParams.set("categoryId", params.categoryId);
  if (params.cityId) queryParams.set("cityId", params.cityId);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.search) queryParams.set("search", params.search);
  if (params.status) queryParams.set("status", params.status);

  const result = await apiRequestWithAccessToken<AdminLaunchpadPostsResponse>(
    request,
    accessToken,
    `/admin/posts/launchpad?${queryParams.toString()}`,
    { method: "GET" },
  );

  return result;
}

export async function getAdminLaunchpadById(
  request: Request,
  accessToken: string,
  launchpadId: string,
) {
  return apiRequestWithAccessToken<AdminLaunchpadPostResponse>(
    request,
    accessToken,
    `/admin/posts/launchpad/${encodeURIComponent(launchpadId)}`,
    { method: "GET" },
  );
}

export async function deleteLaunchpad(
  request: Request,
  accessToken: string,
  launchpadId: string,
) {
  return apiRequestWithAccessToken<AdminDeletePostResponse>(
    request,
    accessToken,
    `/admin/posts/launchpad/${encodeURIComponent(launchpadId)}`,
    { method: "DELETE" },
  );
}

export async function suspendLaunchpad(
  request: Request,
  accessToken: string,
  launchpadId: string,
  body: AdminSuspendPostBody = {},
) {
  return apiRequestWithAccessToken<
    AdminSuspendLaunchpadPostResponse,
    AdminSuspendPostBody
  >(
    request,
    accessToken,
    `/admin/posts/launchpad/${encodeURIComponent(launchpadId)}/suspend`,
    { method: "POST", body },
  );
}

export async function unsuspendLaunchpad(
  request: Request,
  accessToken: string,
  launchpadId: string,
) {
  return apiRequestWithAccessToken<AdminSuspendLaunchpadPostResponse>(
    request,
    accessToken,
    `/admin/posts/launchpad/${encodeURIComponent(launchpadId)}/unsuspend`,
    { method: "POST" },
  );
}
