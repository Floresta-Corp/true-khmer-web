import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import {
  getCandidateNote,
  UuidSchema,
} from "~/api/manage-volunteer/manage-volunteer.server";

export async function loader({ request }: { request: Request }) {
  const auth = await requireUser(request);

  const url = new URL(request.url);
  const postingId = UuidSchema.safeParse(url.searchParams.get("postingId"));
  const candidateId = UuidSchema.safeParse(url.searchParams.get("candidateId"));

  if (!postingId.success || !candidateId.success) {
    return withAuthJson(auth, null, { status: 400 });
  }

  const result = await getCandidateNote(
    request,
    postingId.data,
    candidateId.data,
  );

  return withAuthJson(auth, result?.data?.applicant?.privateNote?.note ?? null);
}
