import CourseCompletePage from "../components/pages/course-complete-page";
import { educationCertificateAction } from "../services/education-certificate.action";
import { educationCompleteLoader } from "../services/education-complete.loader";
import type { Route } from "./+types/education.complete.$id";

export const loader = educationCompleteLoader;
/* The rate dialog posts to the route it is on; rating is the same intent the
   certificate page already handles. */
export const action = educationCertificateAction;

export function meta({ data }: Route.MetaArgs) {
  return [{ title: `Class completed · ${data?.course.title ?? "Course"}` }];
}

export default CourseCompletePage;
