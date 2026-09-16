import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import { getCandidateNote } from "~/api/manage-launchpad/manage-launchpad.server";

export async function loader({ request }: { request: Request }) {
  const auth = await requireUser(request);

  const url = new URL(request.url);
  const postingId = url.searchParams.get("postingId");
  const candidateId = url.searchParams.get("candidateId");

  if (!postingId || !candidateId) {
    return withAuthJson(auth, null, { status: 400 });
  }

  const result = await getCandidateNote(request, postingId, candidateId);

  return withAuthJson(auth, result?.data?.applicant?.privateNote?.note ?? null);
}
