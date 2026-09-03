import type { ShouldRevalidateFunctionArgs } from "react-router";
import CourseLearnPage from "../components/pages/course-learn-page";
import { educationLearnAction } from "../services/education-learn.action";
import { educationLearnLoader } from "../services/education-learn.loader";
import type { Route } from "./+types/education.learn.$id";

export const loader = educationLearnLoader;
export const action = educationLearnAction;

/**
 * Moving between lessons only changes `?lesson=`, and the course and its
 * curriculum are identical either way — so the loader is skipped and the new
 * lesson is resolved from the URL in the component. Without this every
 * "Next lesson" click re-ran the whole loader.
 */
export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  // Only plain navigations are skipped — a submission still revalidates.
  if (!formMethod && currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.course.title ?? "Course" }];
}

export default CourseLearnPage;
