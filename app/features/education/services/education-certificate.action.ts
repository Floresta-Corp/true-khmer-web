import {
  shareCourseCertificate,
  submitCourseReview,
  unshareCourseCertificate,
} from "~/api/education/education.server";
import type { Route as EducationCertificateRoute } from "project-types/education/route/+types/education.certificate.$id";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import type { OwnCourseReview } from "~/features/education/types";

const MAX_COMMENT_LENGTH = 2000;

export type RateCourseActionResult =
  | { ok: true; review: OwnCourseReview; message: string }
  | { ok: false; message: string };

export type ShareCertificateActionResult =
  | { ok: true; sharedToProfile: boolean; message: string }
  | { ok: false; message: string };

/**
 * The certificate page's two mutations: rating the course, and putting the
 * certificate on the learner's profile.
 *
 * They share a route because they share a screen. `intent` picks between them,
 * and each form's result type is its own — a component reads only the shape it
 * submitted.
 */
export async function educationCertificateAction({
  request,
  params,
}: EducationCertificateRoute.ActionArgs) {
  const auth = await requireUser(request);
  const cookies = auth.setCookie ? [auth.setCookie] : [];
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "rate");

  if (intent === "share" || intent === "unshare") {
    return handleShareIntent({
      request,
      auth,
      cookies,
      courseId: params.id,
      shared: intent === "share",
    });
  }

  return handleRateIntent({
    request,
    auth,
    cookies,
    courseId: params.id,
    formData,
  });
}

type AuthContext = Awaited<ReturnType<typeof requireUser>>;

interface IntentContext {
  request: Request;
  auth: AuthContext;
  cookies: string[];
  courseId: string;
}

/**
 * Adds the certificate to the learner's profile, or takes it back off.
 *
 * The API is the authority on whether the course is actually finished, so a
 * learner who reaches this by other means gets its 403 rather than a check
 * duplicated here that could drift from the one that issues certificates.
 */
async function handleShareIntent({
  request,
  auth,
  cookies,
  courseId,
  shared,
}: IntentContext & { shared: boolean }) {
  try {
    const response = shared
      ? await shareCourseCertificate(
          requestWithSetCookie(request, auth.setCookie),
          courseId,
        )
      : await unshareCourseCertificate(
          requestWithSetCookie(request, auth.setCookie),
          courseId,
        );

    if (response.setCookie) cookies.push(response.setCookie);

    return withAuthData({ setCookie: cookies }, {
      ok: true,
      sharedToProfile: response.data.certificate.sharedToProfile,
      message: shared
        ? "Certificate added to your profile."
        : "Certificate removed from your profile.",
    } satisfies ShareCertificateActionResult);
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      return withAuthData(
        { setCookie: cookies },
        {
          ok: false,
          message: "Sign in again to update your profile.",
        } satisfies ShareCertificateActionResult,
        { status: 401 },
      );
    }

    if (error instanceof ProtectedApiError) {
      return withAuthData(
        { setCookie: cookies },
        {
          ok: false,
          message: error.message,
        } satisfies ShareCertificateActionResult,
        {
          status:
            error.status >= 400 && error.status < 500 ? error.status : 400,
        },
      );
    }

    throw error;
  }
}

/**
 * Stores the rating from the prompt shown once a certificate is issued.
 *
 * The endpoint is an upsert, so re-submitting edits the learner's existing
 * review rather than adding a second one — the dialog is safe to reopen.
 */
async function handleRateIntent({
  request,
  auth,
  cookies,
  courseId,
  formData,
}: IntentContext & { formData: FormData }) {
  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return withAuthData(
      { setCookie: cookies },
      {
        ok: false,
        message: "Choose a rating between 1 and 5 stars.",
      } satisfies RateCourseActionResult,
      { status: 400 },
    );
  }

  const comment = String(formData.get("comment") ?? "").trim();
  if (comment.length > MAX_COMMENT_LENGTH) {
    return withAuthData(
      { setCookie: cookies },
      {
        ok: false,
        message: "That comment is too long.",
      } satisfies RateCourseActionResult,
      { status: 400 },
    );
  }

  try {
    const response = await submitCourseReview(
      requestWithSetCookie(request, auth.setCookie),
      courseId,
      /* Omitted rather than sent blank: the API stores an empty comment as
         null, and leaving it out says the same thing without relying on that. */
      { rating, ...(comment ? { comment } : {}) },
    );

    if (response.setCookie) cookies.push(response.setCookie);

    return withAuthData({ setCookie: cookies }, {
      ok: true,
      review: response.data.review,
      message: "Thanks for rating this course.",
    } satisfies RateCourseActionResult);
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      return withAuthData(
        { setCookie: cookies },
        {
          ok: false,
          message: "Sign in again to submit your rating.",
        } satisfies RateCourseActionResult,
        { status: 401 },
      );
    }

    if (error instanceof ProtectedApiError) {
      return withAuthData(
        { setCookie: cookies },
        { ok: false, message: error.message } satisfies RateCourseActionResult,
        /* 403 "not enrolled" and 404 "no such course" are the API's own
           answers; they reach the dialog as its error line either way. */
        {
          status:
            error.status >= 400 && error.status < 500 ? error.status : 400,
        },
      );
    }

    throw error;
  }
}
