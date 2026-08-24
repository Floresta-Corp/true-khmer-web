import { redirect } from "react-router";

import {
  apiRequestWithAccessToken,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type {
  CreateDeveloperClientRequest,
  DeveloperClientDetailResponse,
  DeveloperClientSortField,
  DeveloperClientSortOrder,
  DeveloperClientStatusInput,
  ListDeveloperClientsResponse,
  UpdateDeveloperClientRequest,
} from "~/features/admin/developer-clients/types";

const BASE_PATH = "/admin/developer-client";

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

export interface ListDeveloperClientsQuery {
  page?: number;
  search?: string;
  status?: DeveloperClientStatusInput;
  sortField?: DeveloperClientSortField;
  sortOrder?: DeveloperClientSortOrder;
}

// GET /v1/admin/developer-client — paginated, soft-deleted rows excluded.
export async function getDeveloperClients(
  request: Request,
  query: ListDeveloperClientsQuery,
  existingAccessToken?: string,
) {
  const searchParams = new URLSearchParams();
  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.search) searchParams.set("search", query.search);
  if (query.status) searchParams.set("status", query.status);
  if (query.sortField) searchParams.set("sortField", query.sortField);
  if (query.sortOrder) searchParams.set("sortOrder", query.sortOrder);

  const queryString = searchParams.toString();

  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<ListDeveloperClientsResponse>(
        request,
        accessToken,
        `${BASE_PATH}${queryString ? `?${queryString}` : ""}`,
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

// GET /v1/admin/developer-client/{id}
export async function getDeveloperClient(
  request: Request,
  clientRowId: string,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<DeveloperClientDetailResponse>(
        request,
        accessToken,
        `${BASE_PATH}/${encodeURIComponent(clientRowId)}`,
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

// POST /v1/admin/developer-client — the API generates the client ID.
export async function createDeveloperClient(
  request: Request,
  payload: CreateDeveloperClientRequest,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<
        DeveloperClientDetailResponse,
        CreateDeveloperClientRequest
      >(request, accessToken, BASE_PATH, { method: "POST", body: payload }),
    existingAccessToken,
  );
}

// PATCH /v1/admin/developer-client/{id}
export async function updateDeveloperClient(
  request: Request,
  clientRowId: string,
  payload: UpdateDeveloperClientRequest,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<
        DeveloperClientDetailResponse,
        UpdateDeveloperClientRequest
      >(
        request,
        accessToken,
        `${BASE_PATH}/${encodeURIComponent(clientRowId)}`,
        { method: "PATCH", body: payload },
      ),
    existingAccessToken,
  );
}

// POST /v1/admin/developer-client/{id}/regenerate-client-id
export async function regenerateDeveloperClientId(
  request: Request,
  clientRowId: string,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<DeveloperClientDetailResponse>(
        request,
        accessToken,
        `${BASE_PATH}/${encodeURIComponent(clientRowId)}/regenerate-client-id`,
        { method: "POST" },
      ),
    existingAccessToken,
  );
}

// DELETE /v1/admin/developer-client/{id} — soft delete on the API side.
export async function deleteDeveloperClient(
  request: Request,
  clientRowId: string,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<{ ok: boolean }>(
        request,
        accessToken,
        `${BASE_PATH}/${encodeURIComponent(clientRowId)}`,
        { method: "DELETE" },
      ),
    existingAccessToken,
  );
}
