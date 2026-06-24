import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  GetMySpaceMeResponse,
  GetRecentActivityResponse,
  UpdateMySpaceInput,
  UpdateMySpaceResponse,
  Country,
  City,
} from "../types";
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
