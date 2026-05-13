import type { Route } from "project-types/manage-post/routes/+types/manage-post";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import { myManagePost } from "~/services/manage-post/server";
import type {
  ManagePost,
  ManagePostPagination,
  ManagePostStatus,
  SourceType,
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
  const result = await myManagePost(request, {
    search: url.searchParams.get("search") ?? undefined,
    source: (url.searchParams.get("tab") as SourceType) ?? undefined,
    status: (url.searchParams.get("status") as ManagePostStatus) ?? undefined,
    page: url.searchParams.get("page")
      ? Number(url.searchParams.get("page"))
      : undefined,
  });

  return {
    postings: result?.data?.postings ?? [],
    pagination: result?.data?.pagination ?? null,
    userId,
  } satisfies ManagePostLoaderData;
}
