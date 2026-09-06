import { data } from "react-router";
import type { Route as EducationCertificateRoute } from "project-types/education/route/+types/education.certificate.$id";
import {
  getCourseCertificate,
  getOwnCourseReview,
} from "~/api/education/education.server";
import { formatDate } from "~/lib/time";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import type { CourseCertificate } from "~/features/education/types";
import { loadCourseDetail } from "./education-detail.loader";

export async function educationCertificateLoader({
  request,
  params,
}: EducationCertificateRoute.LoaderArgs) {
  const auth = await requireUser(request);
  const apiRequest = requestWithSetCookie(request, auth.setCookie);

  /* The learner's own rating comes along so the prompt can open pre-filled
     rather than asking again for a rating they have already given. */
  const [course, certificateResult, ownReviewResult] = await Promise.all([
    loadCourseDetail(apiRequest, params.id),
    getCourseCertificate(apiRequest, params.id),
    getOwnCourseReview(apiRequest, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const issued = certificateResult?.data?.certificate ?? null;

  /* The certificate is the entitlement, so no record means no page: typing
     the URL for a course you have not finished sends you to the course rather
     than rendering a certificate with your name on it. Fails closed, so an
     unreachable certificates endpoint also denies rather than issues. The API
     mints the record on the read above, so a learner who has genuinely
     finished always has one by the time we get here. */
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
