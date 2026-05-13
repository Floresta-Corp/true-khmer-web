import type { Route } from "project-types/manage-post/routes/+types/manage-post";
import z from "zod";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import { myManagePost } from "~/services/manage-post/server";
import {
  SourceTypeSchema,
  StatusSchema,
  type ManagePost,
  type ManagePostPagination,
} from "~/services/manage-post/types";

type ManagePostLoaderData = {
  postings: ManagePost[];
  pagination: ManagePostPagination | null;
  userId: string | null;
};

export async function managePostLoader({ request }: Route.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);

  if (!userId) {
    return {
      postings: [],
      pagination: null,
      userId: null,
    } satisfies ManagePostLoaderData;
  }

  const url = new URL(request.url);

  const tabParam = url.searchParams.get("tab");
  const statusParam = url.searchParams.get("status");

  const source = tabParam
    ? SourceTypeSchema.safeParse(tabParam).data
    : undefined;
  const status = statusParam
    ? StatusSchema.safeParse(statusParam).data
    : undefined;

  const pageParam = url.searchParams.get("page");
  const page = pageParam
    ? z.coerce.number().int().positive().safeParse(pageParam).data
    : undefined;

  const result = await myManagePost(request, {
    search: url.searchParams.get("search") ?? undefined,
    source,
    status,
    page,
  });

  return {
    postings: result?.data?.postings ?? [],
    pagination: result?.data?.pagination ?? null,
    userId,
  } satisfies ManagePostLoaderData;
}
