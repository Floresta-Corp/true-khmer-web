import CourseManagePage from "~/features/course-manage/components/pages/course-manage-page";
import { courseManageLoader } from "~/features/course-manage/services/course-manage.loader";
import type { Route } from "./+types/course-manage.$id";

export const loader = courseManageLoader;

export function meta({ data }: Route.MetaArgs) {
  const title = data?.course.title ?? "Course";
  return [{ title: `${title} | True Khmer` }];
}

export default function CourseManageRoute() {
  return <CourseManagePage />;
}
