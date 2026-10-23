import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  GetMySpaceMeResponse,
  GetRecentActivityResponse,
  GetLeaderboardResponse,
  GetPointsHistoryResponse,
  GetTiersResponse,
  UpdateMySpaceInput,
  UpdateMySpaceResponse,
  Country,
  City,
} from "~/features/myspace/types";
import type { ListCertificatesResponse } from "~/api/education/education.server";
import type { SearchSkillsResponse } from "~/types/api-client";

export async function GetMyspaceMe(request: Request) {
  return await apiRequestWithSession<GetMySpaceMeResponse>(request, "/me", {
    method: "GET",
  });
}

export async function GetRecentActivity(request: Request) {
  return await apiRequestWithSession<GetRecentActivityResponse>(
    request,
    "/me/recent-activity",
    {
      method: "GET",
    },
  );
}

export async function GetPointsHistory(
  request: Request,
  params: { limit?: number; offset?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.offset) query.set("offset", String(params.offset));
  const suffix = query.size > 0 ? `?${query.toString()}` : "";

  return await apiRequestWithSession<GetPointsHistoryResponse>(
    request,
    `/me/standing/points${suffix}`,
    { method: "GET" },
  );
}

export async function GetLeaderboard(request: Request) {
  return await apiRequestWithSession<GetLeaderboardResponse>(
    request,
    "/me/standing/leaderboard",
    { method: "GET" },
  );
}

export async function GetTiers(request: Request) {
  return await apiRequestWithSession<GetTiersResponse>(
    request,
    "/me/standing/tiers",
    { method: "GET" },
  );
}

export async function GetMyCertificates(
  request: Request,
  params: { page?: number; limit?: number } = {},
) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const suffix = query.size > 0 ? `?${query.toString()}` : "";

  return await apiRequestWithSession<ListCertificatesResponse>(
    request,
    `/me/certificates${suffix}`,
    { method: "GET" },
  );
}

export async function UpdateMyspace(
  request: Request,
  payload: UpdateMySpaceInput,
) {
  return await apiRequestWithSession<UpdateMySpaceResponse, UpdateMySpaceInput>(
    request,
    "/me",
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export async function GetCountries(request: Request) {
  return await apiRequestWithSession<{ ok: boolean; countries: Country[] }>(
    request,
    "/onboarding/locations/countries",
    {
      method: "GET",
    },
  );
}

export async function GetCities(request: Request, countryId: string) {
  return await apiRequestWithSession<{ ok: boolean; cities: City[] }>(
    request,
    `/onboarding/locations/cities?countryId=${encodeURIComponent(countryId)}`,
    {
      method: "GET",
    },
  );
}

export async function SearchSkills(
  request: Request,
  search: string,
  limit = 10,
) {
  const params = new URLSearchParams({
    search,
    limit: String(limit),
  });

  return await apiRequestWithSession<SearchSkillsResponse>(
    request,
    `/me/skills/search?${params.toString()}`,
    {
      method: "GET",
    },
  );
}
