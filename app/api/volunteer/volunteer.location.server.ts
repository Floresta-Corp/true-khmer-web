import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type {
  GetVolunteerLocationsResponse,
  LocationFilter,
} from "~/features/volunteer/types/location";

function buildLocationQuery(filter?: LocationFilter) {
  const queryParams = new URLSearchParams();

  if (filter?.cursor) queryParams.set("cursor", filter.cursor);
  if (filter?.limit) queryParams.set("limit", filter.limit.toString());
  if (filter?.search) queryParams.set("search", filter.search);

  const query = queryParams.toString();
  return query ? `?${query}` : "";
}
export async function getVolunteerLocations(
  request: Request,
  filter?: LocationFilter,
) {
  try {
    const result = await apiRequestWithSession<GetVolunteerLocationsResponse>(
      request,
      `/volunteer/locations${buildLocationQuery(filter)}`,
      {
        method: "GET",
      },
    );

    return result;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getPublicVolunteerLocations(
  request: Request,
  filter?: LocationFilter,
) {
  try {
    const result =
      await apiRequestWithOptionalSession<GetVolunteerLocationsResponse>(
        request,
        `/volunteer/public/locations${buildLocationQuery(filter)}`,
        {
          method: "GET",
        },
      );
    return result;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
