import type { Route } from "project-types/manage-post/routes/+types/manage-post.$sourceType.$id";
import z from "zod";
import { getUserId } from "~/lib/server/session.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getManagePostDetail } from "~/services/manage-post/server/manage-post-detail.server";
import {
  PostingApplicantFilter,
  PostingSourceSchema,
  type PostDetailPagination,
  type PostingDetail,
} from "~/services/manage-post/types/detail-post-type";
import type { DetailCandidateResponse } from "~/services/manage-post/types";
import { getCandidateNote } from "~/services/manage-post/server";

type ManagePostDetailLoaderData = {
  postDetail: PostingDetail | null;
  pagination: PostDetailPagination | null;
  userId: string | null;
  candidateNote: DetailCandidateResponse | null;
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
      candidateNote: null,
    } satisfies ManagePostDetailLoaderData;
  }

  const url = new URL(request.url);

  const sourceTypeResult = PostingSourceSchema.safeParse(params.sourceType);

  if (!sourceTypeResult.success) {
    return {
      postDetail: null,
      pagination: null,
      userId,
      candidateNote: null,
    } satisfies ManagePostDetailLoaderData;
  }

  const sourceType = sourceTypeResult.data;

  const filterType = url.searchParams.get("filter");
  const filter = PostingApplicantFilter.safeParse(filterType).data ?? "all";

  const pageParam = url.searchParams.get("page");
  const page = pageParam
    ? z.coerce.number().int().positive().safeParse(pageParam).data
    : undefined;

  const candidateId = url.searchParams.get("candidateId");

  // run both requests if candidateId is present
  const [result, candidateNoteResult] = await Promise.all([
    getManagePostDetail(
      request,
      { search: url.searchParams.get("search") ?? undefined, filter, page },
      sourceType,
      params.id,
    ),
    candidateId
      ? getCandidateNote(request, sourceType, params.id, candidateId)
      : Promise.resolve(null),
  ]);

  return {
    postDetail: result?.data?.detail ?? null,
    pagination: result?.data?.detail?.pagination ?? null,
    userId,
    candidateNote: candidateNoteResult?.data ?? null,
  } satisfies ManagePostDetailLoaderData;
}
