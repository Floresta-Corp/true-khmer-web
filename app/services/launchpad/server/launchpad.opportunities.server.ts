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

export async function GetLaunchpadDetail(
  id: string,
  request?: Request,
): Promise<LaunchpadDetail | null> {
  try {
    if (!request) {
      return null;
    }

    const result = await apiRequestWithOptionalSession<GetLaunchpadDetailResponse>(
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
