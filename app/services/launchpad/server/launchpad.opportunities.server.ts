import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type {
  GetLaunchpadResponse,
  GetLaunchpadDetailResponse,
  LaunchpadOpportunity,
  LaunchpadDetail,
} from "../types/project";
import {
  LaunchpadCreateInputSchema,
  LaunchpadPresignInputSchema,
  LaunchpadUpdateInputSchema,
  type LaunchpadCoverPresignResponse,
  type LaunchpadCreateInput,
  type LaunchpadCreateResponse,
  type LaunchpadDocumentPresignResponse,
  type LaunchpadLogoPresignResponse,
  type LaunchpadPresignInput,
  type LaunchpadUpdateInput,
} from "../types/create";

export async function GetLaunchpadProjects(
  request?: Request,
): Promise<LaunchpadOpportunity[]> {
  try {
    if (!request) {
      return [];
    }

    const result = await apiRequestWithOptionalSession<GetLaunchpadResponse>(
      request,
      `/launchpad`,
      {
        method: "GET",
      },
    );
    return result.data.launchpads;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

type City = {
  id: string;
  name: string;
};

export async function GetLaunchpadProjectsPaginated(
  request: Request,
  params: {
    limit?: number;
    cursor?: string | null;
    categoryId?: string | null;
    cityId?: string | null;
    search?: string | null;
    sortBy?: "newest" | "oldest";
  } = {},
): Promise<{
  launchpads: LaunchpadOpportunity[];
  nextCursor: string | null;
  cities: City[];
}> {
  try {
    const query = new URLSearchParams();
    query.set("limit", String(params.limit ?? 9));
    if (params.cursor) query.set("cursor", params.cursor);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.cityId) query.set("cityId", params.cityId);
    if (params.search) query.set("search", params.search);
    if (params.sortBy) query.set("sortBy", params.sortBy);

    const result = await apiRequestWithOptionalSession<GetLaunchpadResponse>(
      request,
      `/launchpad?${query.toString()}`,
      { method: "GET" },
    );
    return {
      launchpads: result.data.launchpads,
      nextCursor: result.data.nextCursor,
      cities: result.data.cities ?? [],
    };
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return { launchpads: [], nextCursor: null, cities: [] };
    }
    throw error;
  }
}

export async function GetLaunchpadDetail(
  id: string,
  request?: Request,
): Promise<LaunchpadDetail | null> {
  try {
    if (!request) {
      return null;
    }

    const result =
      await apiRequestWithOptionalSession<GetLaunchpadDetailResponse>(
        request,
        `/launchpad/${id}`,
        {
          method: "GET",
        },
      );
    return result.data.launchpad;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createLaunchpad(
  request: Request,
  input: LaunchpadCreateInput,
) {
  const body = LaunchpadCreateInputSchema.parse(input);
  return apiRequestWithSession<LaunchpadCreateResponse, LaunchpadCreateInput>(
    request,
    "/launchpad",
    {
      method: "POST",
      body,
    },
  );
}

export async function uploadLaunchpadLogoPresign(
  request: Request,
  input: LaunchpadPresignInput,
) {
  const body = LaunchpadPresignInputSchema.parse(input);
  return apiRequestWithSession<
    LaunchpadLogoPresignResponse,
    LaunchpadPresignInput
  >(request, "/launchpad/logo/presign", {
    method: "POST",
    body,
  });
}

export async function uploadLaunchpadCoverPresign(
  request: Request,
  input: LaunchpadPresignInput,
) {
  const body = LaunchpadPresignInputSchema.parse(input);
  return apiRequestWithSession<
    LaunchpadCoverPresignResponse,
    LaunchpadPresignInput
  >(request, "/launchpad/cover/presign", {
    method: "POST",
    body,
  });
}

export async function uploadLaunchpadDocumentPresign(
  request: Request,
  input: LaunchpadPresignInput,
) {
  const body = LaunchpadPresignInputSchema.parse(input);
  return apiRequestWithSession<
    LaunchpadDocumentPresignResponse,
    LaunchpadPresignInput
  >(request, "/launchpad/document/presign", {
    method: "POST",
    body,
  });
}

export async function saveLaunchpad(
  request: Request,
  launchpadId: string,
): Promise<void> {
  const encodedLaunchpadId = encodeURIComponent(launchpadId);
  await apiRequestWithSession(
    request,
    `/launchpad/save/${encodedLaunchpadId}`,
    {
      method: "POST",
    },
  );
}

export async function updateLaunchpad(
  request: Request,
  id: string,
  input: LaunchpadUpdateInput,
) {
  const body = LaunchpadUpdateInputSchema.parse(input);
  const encodedId = encodeURIComponent(id);
  return apiRequestWithSession(request, `/launchpad/${encodedId}`, {
    method: "PATCH",
    body,
  });
}

export async function unsaveLaunchpad(
  request: Request,
  launchpadId: string,
): Promise<void> {
  const encodedLaunchpadId = encodeURIComponent(launchpadId);
  await apiRequestWithSession(
    request,
    `/launchpad/save/${encodedLaunchpadId}`,
    {
      method: "DELETE",
    },
  );
}
