import type { ShouldRevalidateFunctionArgs } from "react-router";
import CourseManagePage from "~/features/course-manage/components/pages/course-manage-page";
import { courseManageAction } from "~/features/course-manage/services/course-manage.action";
import { courseManageLoader } from "~/features/course-manage/services/course-manage.loader";
import type { Route } from "./+types/course-manage.$id";

export const loader = courseManageLoader;
export const action = courseManageAction;

/**
 * Switching tabs only moves `?tab=`, which the loader does not read, so it
 * would otherwise refetch the course, its curriculum, its stats, its reviews
 * and a page of its roster on every click.
 */
export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (
    !formMethod &&
    currentUrl.pathname === nextUrl.pathname &&
    currentUrl.searchParams.get("tab") !== nextUrl.searchParams.get("tab")
  ) {
    return false;
  }
  return defaultShouldRevalidate;
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.course.title ?? "Course";
  return [{ title: `${title} | True Khmer` }];
}

export default function CourseManageRoute() {
  return <CourseManagePage />;
}
