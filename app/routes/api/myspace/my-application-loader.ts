import type { Route } from "project-types/myspace/routes/+types/my-applications";
import { getMyApplicationResponse } from "~/services/myspace/server/my-application.server";
import type { GetMyApplicationResponse } from "~/services/myspace/types";

interface MyApplicationLoaderResponse {
  myApplication: GetMyApplicationResponse;
}

export async function MyApplicationLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const queryParams: Record<string, any> = {};
  for (const [key, value] of url.searchParams.entries()) {
    queryParams[key] = value;
  }
  const myApplicationResult = await getMyApplicationResponse(
    request,
    queryParams,
  );
  return {
    myApplication: myApplicationResult.data,
  } satisfies MyApplicationLoaderResponse;
}
