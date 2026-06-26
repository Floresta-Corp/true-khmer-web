import type { Route } from "project-types/manage-post/route/+types/manage-post";
import z from "zod";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { myManagePost } from "~/routes/api/manage-post/manage-post.server";
import {
  PostingFilterSchema,
  PostingTypeSchema,
  type ManagePost,
  type ManagePostPagination,
} from "~/features/manage-post/types";

type ManagePostLoaderData = {
  postings: ManagePost[];
  pagination: ManagePostPagination | null;
  userId: string | null;
};

export async function managePostLoader({ request }: Route.LoaderArgs) {
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

  const typeParam = url.searchParams.get("type");
  const filterParam = url.searchParams.get("filter");

  const typeResult = typeParam ? PostingTypeSchema.safeParse(typeParam) : null;
  const filterResult = filterParam
    ? PostingFilterSchema.safeParse(filterParam)
    : null;

  const type =
    typeResult?.success && typeResult.data !== "all"
      ? typeResult.data
      : undefined;
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
    type,
    filter,
    page,
  });

  return withAuthData(auth, {
    postings: result?.data?.postings ?? [],
    pagination: result?.data?.pagination ?? null,
    userId,
  } satisfies ManagePostLoaderData);
}
