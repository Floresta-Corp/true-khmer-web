import { data } from "react-router";
import type { Route as EducationLearnRoute } from "project-types/education/route/+types/education.learn.$id";
import { buildActiveLesson } from "~/features/education/lib/education-fixtures";
import { loadCourseDetail } from "./education-detail.loader";

export async function educationLearnLoader({
  request,
  params,
}: EducationLearnRoute.LoaderArgs) {
  const course = await loadCourseDetail(request, params.id);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const activeLesson = buildActiveLesson(
    course,
    url.searchParams.get("lesson"),
  );

  if (!activeLesson) {
    throw data({ message: "This course has no lessons yet" }, { status: 404 });
  }

  return { course, activeLesson };
}
