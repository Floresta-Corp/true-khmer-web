import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type { GetLaunchpadCategoriesResponse } from "../types/category";

export async function getVolunteerCategories(request: Request) {
  try {
    const result = await apiRequestWithSession<GetLaunchpadCategoriesResponse>(
      request,
      `/volunteer/category`,
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
export async function getPublicLaunchpadCategories(request: Request) {
  try {
    const result =
      await apiRequestWithOptionalSession<GetLaunchpadCategoriesResponse>(
        request,
        `/launchpad/public/category`,
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
