import { data } from "react-router";
import type { Route as EducationCertificateRoute } from "project-types/education/route/+types/education.certificate.$id";
import { formatDate } from "~/lib/time";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { CourseCertificate } from "~/features/education/types";
import { loadCourseDetail } from "./education-detail.loader";

export async function educationCertificateLoader({
  request,
  params,
}: EducationCertificateRoute.LoaderArgs) {
  const { user, setCookie } = await requireUser(request);
  const course = await loadCourseDetail(request, params.id);

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

  return withAuthData({ setCookie }, { course, certificate });
}
