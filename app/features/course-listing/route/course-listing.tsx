import type { ShouldRevalidateFunctionArgs } from "react-router";
import CourseListingPage from "../components/pages/course-listing-page";
import { courseListingAction } from "../services/course-listing.action";
import { courseListingLoader } from "../services/course-listing.loader";

export const loader = courseListingLoader;
export const action = courseListingAction;

/** The URL with `view` removed — the params the loader actually reads. */
function loaderKey(url: URL) {
  const params = new URLSearchParams(url.search);
  params.delete("view");
  params.sort();
  return `${url.pathname}?${params.toString()}`;
}

/**
 * Switching between grid and list only moves `?view=`, which the loader does
 * not read. Skipping that revalidation keeps the toggle instant, holds on to
 * anything "Load more" has already appended, and avoids a skeleton flash.
 */
export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (!formMethod && loaderKey(currentUrl) === loaderKey(nextUrl)) return false;
  return defaultShouldRevalidate;
}

export function meta() {
  return [{ title: "Course Listing | True Khmer" }];
}

export default function CourseListingRoute() {
  return <CourseListingPage />;
}
