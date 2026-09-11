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
  formData,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  /* A resume ping only files where the learner is; nothing this loader returns
     depends on it. Left in, it would refetch the course, its reviews and its
     recommendations every few seconds of playback. */
  if (formData?.get("intent") === "resume") return false;

  if (!formMethod && currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.course.title ?? "Course" }];
}

export default CourseLearnPage;
