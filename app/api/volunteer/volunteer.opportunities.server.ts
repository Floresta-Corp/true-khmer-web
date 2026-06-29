import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  UploadOpportunityCoverImageInputSchema,
  VolunteerOpportunityInputSchema,
  type CreateVolunteerOpportunityResponse,
  type GetVolunteerOpportunitiesResponse,
  type GetVolunteerOpportunityByIdResponse,
  type UploadOpportunityCoverImageInput,
  type UploadOpportunityCoverImageResponse,
  type VolunteerOpportunityFilter,
  type VolunteerOpportunityInput,
} from "~/features/volunteer/types/volunteer-types";

function buildOpportunityQuery(filter?: VolunteerOpportunityFilter) {
  const queryParams = new URLSearchParams();

  if (filter?.cursor) queryParams.set("cursor", filter.cursor);
  if (filter?.locationId) queryParams.set("locationId", filter.locationId);
  if (filter?.categoryId) queryParams.set("categoryId", filter.categoryId);
  if (filter?.limit) queryParams.set("limit", filter.limit.toString());
  if (filter?.search) queryParams.set("search", filter.search);

  const query = queryParams.toString();
  return query ? `?${query}` : "";
}

export async function getVolunteerOpportunities(
  request: Request,
  filter?: VolunteerOpportunityFilter,
) {
  try {
    const result =
      await apiRequestWithSession<GetVolunteerOpportunitiesResponse>(
        request,
        `/volunteer/opportunities${buildOpportunityQuery(filter)}`,
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
export async function getPublicVolunteerOpportunities(
  request: Request,
  filter?: VolunteerOpportunityFilter,
) {
  try {
    const result =
      await apiRequestWithOptionalSession<GetVolunteerOpportunitiesResponse>(
        request,
        `/volunteer/public/opportunities${buildOpportunityQuery(filter)}`,
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

export async function getPublicOpportunityById(
  request: Request,
  id: string,
  filter?: VolunteerOpportunityFilter,
) {
  try {
    const result =
      await apiRequestWithOptionalSession<GetVolunteerOpportunityByIdResponse>(
        request,
        `/volunteer/public/opportunities/${id}${buildOpportunityQuery(filter)}`,
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
export async function getOpportunityById(
  request: Request,
  id: string,
  filter?: VolunteerOpportunityFilter,
) {
  try {
    const result =
      await apiRequestWithSession<GetVolunteerOpportunityByIdResponse>(
        request,
        `/volunteer/opportunities/${id}${buildOpportunityQuery(filter)}`,
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

export async function updateVolunteerOpportunity(
  request: Request,
  id: string,
  input: VolunteerOpportunityInput,
) {
  const body = VolunteerOpportunityInputSchema.parse(input);
  return await apiRequestWithSession<
    CreateVolunteerOpportunityResponse,
    VolunteerOpportunityInput
  >(request, `/volunteer/opportunities/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function createVolunteerOpportunity(
  request: Request,
  input: VolunteerOpportunityInput,
) {
  const body = VolunteerOpportunityInputSchema.parse(input);
  return await apiRequestWithSession<
    CreateVolunteerOpportunityResponse,
    VolunteerOpportunityInput
  >(request, "/volunteer/opportunities", {
    method: "POST",
    body,
  });
}

export async function uploadOpportunityCoverImage(
  request: Request,
  input: UploadOpportunityCoverImageInput,
) {
  const body = UploadOpportunityCoverImageInputSchema.parse(input);

  return await apiRequestWithSession<
    UploadOpportunityCoverImageResponse,
    UploadOpportunityCoverImageInput
  >(request, "/volunteer/opportunities/cover-image/presign", {
    method: "POST",
    body: body,
  });
}
export async function SaveVolunteerOpportunity(
  request: Request,
  opportunityId: string,
) {
  return await apiRequestWithSession<{ ok: boolean; message: string }>(
    request,
    `/volunteer/save-opportunity/${opportunityId}`,
    {
      method: "POST",
    },
  );
}

export async function UnsaveVolunteerOpportunity(
  request: Request,
  opportunityId: string,
) {
  return await apiRequestWithSession<{ ok: boolean; message: string }>(
    request,
    `/volunteer/save-opportunity/${opportunityId}`,
    {
      method: "DELETE",
    },
  );
}
