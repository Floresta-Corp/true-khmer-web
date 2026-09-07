import { useLoaderData } from "react-router";
import type { Route } from "./+types/education.$id";
import CourseDetailPage from "../components/pages/course-detail-page";
import CourseSingleDetailPage from "../components/pages/course-single-detail-page";
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
 * Two layouts behind one route: a course built as one standalone lesson leads
 * with the player, while a multi-chapter course leads with its cover and
 * curriculum. The format is the course's own, not a guess from lesson count —
 * a multi-chapter course can legitimately hold a single lesson while it is
 * still being written.
 */
export default function CourseDetailRoute() {
  const { course } = useLoaderData<typeof loader>();

  return course.format === "SINGLE" ? (
    <CourseSingleDetailPage />
  ) : (
    <CourseDetailPage />
  );
}
