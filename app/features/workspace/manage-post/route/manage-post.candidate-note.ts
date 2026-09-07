import type { Route } from "project-types/workspace/manage-post/route/+types/manage-post.$sourceType.$id";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import { getCandidateNote } from "~/api/manage-post/manage-post.server";
import { PostingSourceSchema } from "~/features/workspace/manage-post/types";

export async function loader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const url = new URL(request.url);
  const sourceType = url.searchParams.get("sourceType");
  const postingId = url.searchParams.get("postingId");
  const candidateId = url.searchParams.get("candidateId");

  const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);
  if (!sourceTypeResult.success || !postingId || !candidateId) {
    return withAuthJson(auth, null, { status: 400 });
  }

  const result = await getCandidateNote(
    request,
    sourceTypeResult.data,
    postingId,
    candidateId,
  );

  return withAuthJson(auth, result?.data?.applicant?.privateNote?.note ?? null);
}
