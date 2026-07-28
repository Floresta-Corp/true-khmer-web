import { redirect } from "react-router";

import {
  apiRequestWithAccessToken,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type {
  AdminUserManagementDetailResponse,
  AdminUserManagementListResponse,
  AdminUserManagementStatsResponse,
  api,
} from "~/types/api-client";

async function retryAdminRequestAfterRefresh<T>(
  request: Request,
  execute: (accessToken: string) => Promise<T>,
  firstAccessToken?: string,
) {
  const tokenResult = firstAccessToken
    ? { accessToken: firstAccessToken, setCookie: undefined }
    : await getAdminAccessToken(request);

  if (!tokenResult.accessToken) {
    throw redirect("/tk-admin/login");
  }

  try {
    return {
      data: await execute(tokenResult.accessToken),
      setCookie: tokenResult.setCookie,
    };
  } catch (error) {
    if (!(error instanceof ProtectedApiError) || error.status !== 401) {
      throw error;
    }

    const refreshed = await getAdminAccessToken(request, {
      forceRefresh: true,
    });
    if (!refreshed.accessToken) {
      throw redirect("/tk-admin/login", {
        ...(refreshed.setCookie
          ? { headers: { "Set-Cookie": refreshed.setCookie } }
          : {}),
      });
    }

    return {
      data: await execute(refreshed.accessToken),
      setCookie: refreshed.setCookie ?? tokenResult.setCookie,
    };
  }
}

export async function getAdminUserManagement(
  request: Request,
  query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    tier?: string;
  },
  existingAccessToken?: string,
) {
  const searchParams = new URLSearchParams();

  if (query.page) searchParams.set("page", String(query.page));
  if (query.limit) searchParams.set("limit", String(query.limit));
  if (query.search) searchParams.set("search", query.search);
  if (query.status) searchParams.set("status", query.status);
  if (query.tier) searchParams.set("tier", query.tier);

  const queryString = searchParams.toString();

  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<AdminUserManagementListResponse>(
        request,
        accessToken,
        `/admin/user-management${queryString ? `?${queryString}` : ""}`,
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

export async function getAdminUserManagementStats(
  request: Request,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<AdminUserManagementStatsResponse>(
        request,
        accessToken,
        "/admin/user-management/stats",
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

export async function getAdminUserManagementDetail(
  request: Request,
  userId: string,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<AdminUserManagementDetailResponse>(
        request,
        accessToken,
        `/admin/user-management/${encodeURIComponent(userId)}`,
        {
          method: "GET",
        },
      ),
    existingAccessToken,
  );
}

export async function updateAdminUserSuspension(
  request: Request,
  userId: string,
  action: "suspend" | "unsuspend",
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<
      Awaited<ReturnType<typeof api.postV1adminuserManagementUserIdAction>>
    >(
      request,
      accessToken,
      `/admin/user-management/${encodeURIComponent(userId)}/${action}`,
      {
        method: "POST",
      },
    ),
  );
}
