import {
  apiRequestWithOptionalSession,
  isResourceUnavailable,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type { GetLaunchpadCategoriesResponse } from "~/types/api-client";

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
    if (isResourceUnavailable(error, "launchpad categories")) {
      return null;
    }
    throw error;
  }
}
