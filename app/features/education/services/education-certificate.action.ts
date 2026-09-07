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
  | { ok: true; courseId: string; sharedToProfile: boolean; message: string }
  | { ok: false; courseId: string; message: string };

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
      courseId,
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
          courseId,
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
          courseId,
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
        {
          status:
            error.status >= 400 && error.status < 500 ? error.status : 400,
        },
      );
    }

    throw error;
  }
}
