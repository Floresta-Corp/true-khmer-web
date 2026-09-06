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

export default CourseDetailPage;
