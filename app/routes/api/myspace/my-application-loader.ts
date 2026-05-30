import type { Route } from "project-types/myspace/routes/+types/my-applications";
import {
  getMyApplicationResponse,
  type MyApplicationQueryParams,
} from "~/services/myspace/server/my-application.server";
import {
  MyApplicationFilterSchema,
  MyApplicationListTypeSchema,
  type GetMyApplicationResponse,
} from "~/services/myspace/types";

interface MyApplicationLoaderResponse {
  myApplication: GetMyApplicationResponse;
}

export async function MyApplicationLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const typeParam = url.searchParams.get("tab") || "all";
  const filterParam = url.searchParams.get("filter") || "all";
  const type = MyApplicationListTypeSchema.safeParse(typeParam);
  const filter = MyApplicationFilterSchema.safeParse(filterParam);
  const queryParams = {
    type: type.success ? type.data : "all",
    filter: filter.success ? filter.data : "all",
  } satisfies MyApplicationQueryParams;

  const myApplicationResult = await getMyApplicationResponse(
    request,
    queryParams,
  );
  return {
    myApplication: myApplicationResult.data,
  } satisfies MyApplicationLoaderResponse;
}
