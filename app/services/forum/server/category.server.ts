import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { GetCategoriesListResponse } from "../types";

export async function getCategories(request: Request) {
  const result = await apiRequestWithSession<GetCategoriesListResponse>(
    request,
    "/forum/category",
    {
      method: "GET",
    },
  );

  return result;
}
