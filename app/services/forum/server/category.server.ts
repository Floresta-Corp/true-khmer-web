import { apiRequestWithOptionalSession, apiRequestWithSession } from "~/lib/server/api-client.server";
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

export async function getPublicCategories(request: Request) {
  const result = await apiRequestWithOptionalSession<GetCategoriesListResponse>(
    request,
    "/forum/public/category",
    {
      method: "GET",
    },
  );

  return result;
}
