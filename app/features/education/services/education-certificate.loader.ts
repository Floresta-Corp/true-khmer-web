import { data } from "react-router";
import type { Route as EducationCertificateRoute } from "project-types/education/route/+types/education.certificate.$id";
import { getOwnCourseReview } from "~/api/education/education.server";
import { formatDate } from "~/lib/time";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { CourseCertificate } from "~/features/education/types";
import { loadCourseDetail } from "./education-detail.loader";

export async function educationCertificateLoader({
  request,
  params,
}: EducationCertificateRoute.LoaderArgs) {
  const { user, setCookie } = await requireUser(request);
  const apiRequest = requestWithSetCookie(request, setCookie);

  /* The learner's own rating comes along so the prompt can open pre-filled
     rather than asking again for a rating they have already given. */
  const [course, ownReviewResult] = await Promise.all([
    loadCourseDetail(apiRequest, params.id),
    getOwnCourseReview(apiRequest, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  // The API does not issue certificates yet, so the record is derived from the
  // signed-in user and the course they completed.
  const certificate: CourseCertificate = {
    recipientName: user.profile?.displayName || user.name,
    courseTitle: course.title,
    completedOn: formatDate(new Date()),
  };

  return withAuthData(
    { setCookie },
    { course, certificate, ownReview: ownReviewResult?.data?.review ?? null },
  );
}
