import type { Route } from "project-types/manage-post/routes/+types/manage-post.$sourceType.$id";
import { requireUser } from "~/lib/server/route-guards.server";
import { getCandidateNote } from "~/services/manage-post/server";
import { PostingSourceSchema } from "~/services/manage-post/types/detail-post-type";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request);

  const url = new URL(request.url);
  const sourceType = url.searchParams.get("sourceType");
  const postingId = url.searchParams.get("postingId");
  const candidateId = url.searchParams.get("candidateId");

  const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);
  if (!sourceTypeResult.success || !postingId || !candidateId) {
    return Response.json(null, { status: 400 });
  }

  const result = await getCandidateNote(
    request,
    sourceTypeResult.data,
    postingId,
    candidateId,
  );

  return Response.json(result?.data?.applicant?.privateNote?.note ?? null);
}
