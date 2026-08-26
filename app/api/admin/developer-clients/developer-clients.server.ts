import { redirect } from "react-router";

import { adminUploadPresign } from "~/api/admin/auth/admin-upload-presign.server";
import {
  apiRequestWithAccessToken,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type {
  CreateDeveloperClientRequest,
  DeveloperClientDetailResponse,
  IssuedClientSecretResponse,
  ListDeveloperClientsResponse,
  UpdateDeveloperClientRequest,
} from "~/types/api-client";
import type {
  DeveloperClientSortField,
  DeveloperClientSortOrder,
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
  status?: NonNullable<UpdateDeveloperClientRequest["status"]>;
  sortField?: DeveloperClientSortField;
  sortOrder?: DeveloperClientSortOrder;
}

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

export async function createDeveloperClient(
  request: Request,
  payload: CreateDeveloperClientRequest,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<
        IssuedClientSecretResponse,
        CreateDeveloperClientRequest
      >(request, accessToken, BASE_PATH, { method: "POST", body: payload }),
    existingAccessToken,
  );
}

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

export async function regenerateDeveloperClientSecret(
  request: Request,
  clientRowId: string,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<IssuedClientSecretResponse>(
        request,
        accessToken,
        `${BASE_PATH}/${encodeURIComponent(clientRowId)}/regenerate-secret`,
        { method: "POST" },
      ),
    existingAccessToken,
  );
}

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

/**
 * Uploads a logo and returns the stored key.
 *
 * The API has no developer-client-specific presign endpoint yet, so this
 * borrows the generic admin image presign. Swap the presign call here once a
 * dedicated endpoint exists — nothing else needs to change.
 */
export async function uploadDeveloperClientLogo(
  request: Request,
  file: File,
  accessToken: string,
) {
  const presign = await adminUploadPresign(request, accessToken, {
    contentType: file.type,
    fileSize: file.size,
  });

  if (!presign.ok) {
    throw new Error("Failed to prepare the logo upload.");
  }

  const { uploadUrl, method, requiredHeaders, avatarKey } = presign.upload;

  const uploaded = await fetch(uploadUrl, {
    method,
    body: file,
    headers: requiredHeaders,
    signal: AbortSignal.timeout(30_000),
  });

  if (!uploaded.ok) {
    throw new Error("Failed to upload the logo.");
  }

  return avatarKey;
}
