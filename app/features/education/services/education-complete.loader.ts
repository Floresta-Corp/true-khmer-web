import { data } from "react-router";
import type { Route as EducationCompleteRoute } from "project-types/education/route/+types/education.complete.$id";
import {
  getCourseCertificate,
  getOwnCourseReview,
} from "~/api/education/education.server";
import { formatDate } from "~/lib/time";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import {
  clearAndRedirectToLogin,
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { loadCourseDetail } from "./education-detail.loader";

/**
 * The "class completed" screen. It belongs to learners who have earned the
 * certificate — passing the quiz, or finishing every lesson of a course that
 * has none — so anyone else is sent back to the lessons.
 */
export async function educationCompleteLoader({
  request,
  params,
}: EducationCompleteRoute.LoaderArgs) {
  const auth = await requireUser(request);
  const apiRequest = requestWithSetCookie(request, auth.setCookie);

  const [course, certificateResponse, ownReviewResult] = await Promise.all([
    loadCourseDetail(apiRequest, params.id),
    getCourseCertificate(apiRequest, params.id).catch(async (error) => {
      if (error instanceof AuthSessionExpiredError) {
        const url = new URL(request.url);
        throw await clearAndRedirectToLogin(request, url.pathname);
      }
      if (error instanceof ProtectedApiError && error.status === 404) {
        throw data({ message: "Course not found" }, { status: 404 });
      }
      throw error;
    }),
    getOwnCourseReview(apiRequest, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const certificate = certificateResponse.data.certificate;
  if (!certificateResponse.data.earned || !certificate) {
    throw withAuthRedirect(auth, `/education/${course.id}/learn`);
  }

  return withAuthData(auth, {
    course,
    completedOn: formatDate(certificate.completedAt),
    ownReview: ownReviewResult?.data?.review ?? null,
  });
}
