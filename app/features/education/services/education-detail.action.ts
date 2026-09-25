import type { Route as EducationDetailRoute } from "project-types/education/route/+types/education.$id";
import { requireUser } from "~/lib/server/route-guards.server";
import { handleRateIntent } from "./education-certificate.action";

export async function educationDetailAction({
  request,
  params,
}: EducationDetailRoute.ActionArgs) {
  const auth = await requireUser(request);
  const cookies = auth.setCookie ? [auth.setCookie] : [];
  const formData = await request.formData();

  return handleRateIntent({
    request,
    auth,
    cookies,
    courseId: params.id,
    formData,
  });
}
