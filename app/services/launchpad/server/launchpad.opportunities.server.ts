import {
  apiRequestWithOptionalSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type {
  GetLaunchpadResponse,
  GetLaunchpadDetailResponse,
  LaunchpadOpportunity,
  LaunchpadDetail,
} from "../types/project";

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
): Promise<{ launchpads: LaunchpadOpportunity[]; nextCursor: string | null }> {
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
    };
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return { launchpads: [], nextCursor: null };
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
