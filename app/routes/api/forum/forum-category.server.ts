import { apiRequestWithOptionalSession, apiRequestWithSession } from "~/lib/server/api-client.server";
import type { GetCategoriesResponse } from "~/types/api-client";

export async function getCategories(request: Request) {
  const result = await apiRequestWithSession<GetCategoriesResponse>(
    request,
    "/forum/category",
    {
      method: "GET",
    },
  );

  return result;
}

export async function getPublicCategories(request: Request) {
  const result = await apiRequestWithOptionalSession<GetCategoriesResponse>(
    request,
    "/forum/public/category",
    {
      method: "GET",
    },
  );

  return result;
}
