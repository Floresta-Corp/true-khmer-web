import type { Route } from "project-types/workspace/manage-volunteer/route/+types/manage-volunteer";
import z from "zod";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { myManagePost } from "~/api/manage-volunteer/manage-volunteer.server";
import {
  PostingFilterSchema,
  type ManagePost,
  type ManagePostPagination,
} from "~/features/workspace/manage-volunteer/types";

export type ManagePostLoaderData = {
  postings: ManagePost[];
  pagination: ManagePostPagination | null;
  userId: string | null;
};

export async function manageVolunteerLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;

  if (!userId) {
    return withAuthData(auth, {
      postings: [],
      pagination: null,
      userId: null,
    } satisfies ManagePostLoaderData);
  }

  const url = new URL(request.url);

  const filterParam = url.searchParams.get("filter");
  const filterResult = filterParam
    ? PostingFilterSchema.safeParse(filterParam)
    : null;
  const filter =
    filterResult?.success && filterResult.data !== "all"
      ? filterResult.data
      : undefined;

  const pageParam = url.searchParams.get("page");
  const page = pageParam
    ? z.coerce.number().int().positive().safeParse(pageParam).data
    : undefined;

  const result = await myManagePost(request, {
    search: url.searchParams.get("search") ?? undefined,
    filter,
    page,
  });

  return withAuthData(auth, {
    postings: result?.data?.postings ?? [],
    pagination: result?.data?.pagination ?? null,
    userId,
  } satisfies ManagePostLoaderData);
}
