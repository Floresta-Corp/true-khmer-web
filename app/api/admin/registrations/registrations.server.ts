import { redirect } from "react-router";

import {
  apiRequestWithAccessToken,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type {
  ListPendingPartnersResponse,
  PartnerDetailResponse,
  PartnerRegistrationAction,
  UpdatePartnerRegistrationStatusResponse,
} from "~/features/admin/registrations/types";

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

// GET /v1/admin/partner/registrations — all PENDING registrations, newest first.
export async function getPendingPartnerRegistrations(
  request: Request,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<ListPendingPartnersResponse>(
        request,
        accessToken,
        "/admin/partner/registrations",
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

// GET /v1/admin/partner/registrations/{id} — one registration + contact persons.
export async function getPartnerRegistrationDetail(
  request: Request,
  partnerId: string,
  existingAccessToken?: string,
) {
  return retryAdminRequestAfterRefresh(
    request,
    (accessToken) =>
      apiRequestWithAccessToken<PartnerDetailResponse>(
        request,
        accessToken,
        `/admin/partner/registrations/${encodeURIComponent(partnerId)}`,
        { method: "GET" },
      ),
    existingAccessToken,
  );
}

// PATCH /v1/admin/partner/registrations/{id}
//   action "ACTIVE" -> approve, "DELETE" -> reject (hard delete).
export async function updatePartnerRegistrationStatus(
  request: Request,
  partnerId: string,
  action: PartnerRegistrationAction,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<
      UpdatePartnerRegistrationStatusResponse,
      { action: PartnerRegistrationAction }
    >(
      request,
      accessToken,
      `/admin/partner/registrations/${encodeURIComponent(partnerId)}`,
      {
        method: "PATCH",
        body: { action },
      },
    ),
  );
}
