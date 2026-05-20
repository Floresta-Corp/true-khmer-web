import type { Route } from "project-types/manage-post/routes/+types/manage-post.$sourceType.$id";
import z from "zod";
import { getUserId } from "~/lib/server/session.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getManagePostDetail } from "~/services/manage-post/server/manage-post-detail.server";
import {
  PostingApplicantRange,
  PostingSourceSchema,
  type PostDetailPagination,
  type PostingDetail,
} from "~/services/manage-post/types/detail-post-type";

type ManagePostDetailLoaderData = {
  postDetail: PostingDetail | null;
  pagination: PostDetailPagination | null;
  userId: string | null;
};

export async function managePostDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);

  if (!userId) {
    return {
      postDetail: null,
      pagination: null,
      userId: null,
    } satisfies ManagePostDetailLoaderData;
  }

  const url = new URL(request.url);

  const sourceTypeResult = PostingSourceSchema.safeParse(params.sourceType);

  if (!sourceTypeResult.success) {
    return {
      postDetail: null,
      pagination: null,
      userId,
    } satisfies ManagePostDetailLoaderData;
  }

  const sourceType = sourceTypeResult.data;

  const rangeType = url.searchParams.get("range");
  const range = PostingApplicantRange.safeParse(rangeType).data ?? "all_time";

  const pageParam = url.searchParams.get("page");
  const page = pageParam
    ? z.coerce.number().int().positive().safeParse(pageParam).data
    : undefined;

  const result = await getManagePostDetail(
    request,
    {
      search: url.searchParams.get("search") ?? undefined,
      range,
      page,
    },
    sourceType,
    params.postingId,
  );

  return {
    postDetail: result?.data?.detail ?? null,
    pagination: result?.data?.detail?.pagination ?? null,
    userId,
  } satisfies ManagePostDetailLoaderData;
}
