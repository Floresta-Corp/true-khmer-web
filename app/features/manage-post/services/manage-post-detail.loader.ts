import type { Route } from "project-types/manage-post/route/+types/manage-post.$sourceType.$id";
import z from "zod";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  getCandidateNote,
  getManagePostDetail,
} from "~/api/manage-post/manage-post.server";
import {
  PostingApplicantFilter,
  PostingSourceSchema,
  type DetailCandidateResponse,
  type PostDetailPagination,
  type PostingDetail,
} from "~/features/manage-post/types";

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
  const auth = await requireUser(request);
  const userId = auth.user.id;

  if (!userId) {
    return withAuthData(auth, {
      postDetail: null,
      pagination: null,
      userId: null,
      candidateNote: null,
    } satisfies ManagePostDetailLoaderData);
  }

  const url = new URL(request.url);

  const sourceTypeResult = PostingSourceSchema.safeParse(params.sourceType);

  if (!sourceTypeResult.success) {
    return withAuthData(auth, {
      postDetail: null,
      pagination: null,
      userId,
      candidateNote: null,
    } satisfies ManagePostDetailLoaderData);
  }

  const sourceType = sourceTypeResult.data;

  const filterType = url.searchParams.get("filter");
  const filter = PostingApplicantFilter.safeParse(filterType).data ?? "all";

  const pageParam = url.searchParams.get("page");
  const page = pageParam
    ? z.coerce.number().int().positive().safeParse(pageParam).data
    : undefined;

  const candidateId = url.searchParams.get("candidateId");

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

  return withAuthData(auth, {
    postDetail: result?.data?.detail ?? null,
    pagination: result?.data?.detail?.pagination ?? null,
    userId,
    candidateNote: candidateNoteResult?.data ?? null,
  } satisfies ManagePostDetailLoaderData);
}
