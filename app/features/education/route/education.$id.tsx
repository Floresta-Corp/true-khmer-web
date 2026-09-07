import type { Route } from "./+types/education.$id";
import CourseDetailPage from "../components/pages/course-detail-page";
import { educationDetailLoader } from "../services/education-detail.loader";

export const loader = educationDetailLoader;

export function meta({ data }: Route.MetaArgs) {
  const title = data?.course.title ?? "Course";
  return [
    { title: `${title} - True Khmer` },
    { name: "description", content: data?.course.description ?? "" },
  ];
}

/**
 * One layout for every course, whatever its format.
 *
 * A single-lesson course used to lead with the player, which started it the
 * moment the page opened. Leading with the cover instead lets anyone preview
 * the course first — title, rating, learners, what it covers — and begin when
 * they choose, and a one-lesson curriculum is a list of one rather than a
 * different screen.
 */
export default function CourseDetailRoute() {
  return <CourseDetailPage />;
}
