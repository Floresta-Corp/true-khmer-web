import CourseListingPage from "../components/pages/course-listing-page";
import { courseListingAction } from "../services/course-listing.action";
import { courseListingLoader } from "../services/course-listing.loader";

export const loader = courseListingLoader;
export const action = courseListingAction;

export function meta() {
  return [{ title: "Course Listing | True Khmer" }];
}

export default function CourseListingRoute() {
  return <CourseListingPage />;
}
