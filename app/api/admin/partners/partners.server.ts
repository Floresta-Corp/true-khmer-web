import { redirect } from "react-router";

import {
  apiRequestWithAccessToken,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type {
  CreateManagedPartnerRequest,
  CreateManagedPartnerResponse,
  ListManagedPartnersResponse,
  ManagedPartnerDetailResponse,
  PresignPartnerLogoResponse,
  PresignPartnerPhotoResponse,
  UpdateManagedPartnerRequest,
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

export interface ListManagedPartnersQuery {
  page?: number;
  search?: string;
  sortField?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// GET /v1/admin/partner — paginated ACTIVE/INACTIVE partners.
export async function getManagedPartners(
  request: Request,
  query: ListManagedPartnersQuery,
  existingAccessToken?: string,
) {
  const searchParams = new URLSearchParams();
  if (query.page) searchParams.set("page", String(query.page));
  if (query.search) searchParams.set("search", query.search);
  if (query.sortField) searchParams.set("sortField", query.sortField);
  if (query.sortOrder) searchParams.set("sortOrder", query.sortOrder);

  const queryString = searchParams.toString();

  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<ListManagedPartnersResponse>(
        request,
        accessToken,
        `/admin/partner${queryString ? `?${queryString}` : ""}`,
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

// GET /v1/admin/partner/{id} — partner + contact persons + photos.
export async function getManagedPartner(
  request: Request,
  partnerId: string,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<ManagedPartnerDetailResponse>(
        request,
        accessToken,
        `/admin/partner/${encodeURIComponent(partnerId)}`,
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

// POST /v1/admin/partner — admin-created partner (status ACTIVE).
export async function createManagedPartner(
  request: Request,
  payload: CreateManagedPartnerRequest,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<
      CreateManagedPartnerResponse,
      CreateManagedPartnerRequest
    >(request, accessToken, "/admin/partner", {
      method: "POST",
      body: payload,
    }),
  );
}

// PATCH /v1/admin/partner/{id} — edit-save, toggleStatus, togglePublish.
export async function updateManagedPartner(
  request: Request,
  partnerId: string,
  payload: UpdateManagedPartnerRequest,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<
      { ok: boolean; partner: unknown },
      UpdateManagedPartnerRequest
    >(request, accessToken, `/admin/partner/${encodeURIComponent(partnerId)}`, {
      method: "PATCH",
      body: payload,
    }),
  );
}

// DELETE /v1/admin/partner/{id}
export async function deleteManagedPartner(
  request: Request,
  partnerId: string,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<{ ok: boolean }>(
      request,
      accessToken,
      `/admin/partner/${encodeURIComponent(partnerId)}`,
      { method: "DELETE" },
    ),
  );
}

// POST /v1/admin/partner/{id}/photos
export async function addManagedPartnerPhoto(
  request: Request,
  partnerId: string,
  url: string,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<{ ok: boolean; photo: unknown }, { url: string }>(
      request,
      accessToken,
      `/admin/partner/${encodeURIComponent(partnerId)}/photos`,
      { method: "POST", body: { url } },
    ),
  );
}

// DELETE /v1/admin/partner/{id}/photos/{photoId}
export async function deleteManagedPartnerPhoto(
  request: Request,
  partnerId: string,
  photoId: string,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<{ ok: boolean }>(
      request,
      accessToken,
      `/admin/partner/${encodeURIComponent(partnerId)}/photos/${encodeURIComponent(photoId)}`,
      { method: "DELETE" },
    ),
  );
}

// POST /v1/admin/partner/{id}/logo/presign
export async function presignManagedPartnerLogo(
  request: Request,
  partnerId: string,
  input: { contentType: string; fileSize: number },
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<
        PresignPartnerLogoResponse,
        { contentType: string; fileSize: number }
      >(
        request,
        accessToken,
        `/admin/partner/${encodeURIComponent(partnerId)}/logo/presign`,
        { method: "POST", body: input },
      ),
    existingAccessToken,
  );
}

// POST /v1/admin/partner/{id}/photos/presign
export async function presignManagedPartnerPhoto(
  request: Request,
  partnerId: string,
  input: { contentType: string; fileSize: number },
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<
        PresignPartnerPhotoResponse,
        { contentType: string; fileSize: number }
      >(
        request,
        accessToken,
        `/admin/partner/${encodeURIComponent(partnerId)}/photos/presign`,
        { method: "POST", body: input },
      ),
    existingAccessToken,
  );
}
