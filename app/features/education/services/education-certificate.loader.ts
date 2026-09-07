import { data } from "react-router";
import type { Route as EducationCertificateRoute } from "project-types/education/route/+types/education.certificate.$id";
import {
  getCourseCertificate,
  getOwnCourseReview,
  type GetCourseCertificateResponse,
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
import type { CourseCertificate } from "~/features/education/types";
import { loadCourseDetail } from "./education-detail.loader";

async function readCertificate(
  request: Request,
  apiRequest: Request,
  courseId: string,
): Promise<GetCourseCertificateResponse> {
  try {
    const result = await getCourseCertificate(apiRequest, courseId);
    return result.data;
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      const url = new URL(request.url);
      throw await clearAndRedirectToLogin(
        request,
        `${url.pathname}${url.search}`,
      );
    }
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw data({ message: "Course not found" }, { status: 404 });
    }
    throw error;
  }
}

export async function educationCertificateLoader({
  request,
  params,
}: EducationCertificateRoute.LoaderArgs) {
  const auth = await requireUser(request);
  const apiRequest = requestWithSetCookie(request, auth.setCookie);

  const [course, certificateResponse, ownReviewResult] = await Promise.all([
    loadCourseDetail(apiRequest, params.id),
    readCertificate(request, apiRequest, params.id),
    getOwnCourseReview(apiRequest, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const issued = certificateResponse.certificate;

  if (!issued) {
    throw withAuthRedirect(auth, `/education/${course.id}/learn`);
  }

  const certificate: CourseCertificate = {
    courseId: issued.courseId,
    certificateNo: issued.certificateNo,
    recipientName: issued.recipientName,
    courseTitle: issued.courseTitle,
    completedOn: formatDate(issued.completedAt),
    sharedToProfile: issued.sharedToProfile,
  };

  return withAuthData(auth, {
    course,
    certificate,
    ownReview: ownReviewResult?.data?.review ?? null,
  });
}
