import type { ShouldRevalidateFunctionArgs } from "react-router";
import CourseLearnPage from "../components/pages/course-learn-page";
import { educationLearnAction } from "../services/education-learn.action";
import { educationLearnLoader } from "../services/education-learn.loader";
import type { Route } from "./+types/education.learn.$id";

export const loader = educationLearnLoader;
export const action = educationLearnAction;

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (!formMethod && currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.course.title ?? "Course" }];
}

export default CourseLearnPage;
