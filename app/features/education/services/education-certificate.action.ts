import type { ActionFunctionArgs } from "react-router";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";

const MAX_COMMENT_LENGTH = 2000;

/**
 * Accepts the "rate this course" prompt shown after a certificate is issued.
 *
 * Course ratings have no API resource yet, so the submission is validated and
 * acknowledged but not stored. Point this at the ratings endpoint once it
 * exists — the form already posts `rating` and `comment`.
 */
export async function educationCertificateAction({
  request,
}: ActionFunctionArgs) {
  const { setCookie } = await requireUser(request);
  const formData = await request.formData();

  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return withAuthData(
      { setCookie },
      { ok: false as const, message: "Choose a rating between 1 and 5 stars." },
      { status: 400 },
    );
  }

  const comment = String(formData.get("comment") ?? "").trim();
  if (comment.length > MAX_COMMENT_LENGTH) {
    return withAuthData(
      { setCookie },
      { ok: false as const, message: "That comment is too long." },
      { status: 400 },
    );
  }

  return withAuthData(
    { setCookie },
    { ok: true as const, message: "Thanks for rating this course." },
  );
}
