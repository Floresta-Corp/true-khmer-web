import type { Route } from "./+types/education.$id";
import CourseDetailPage from "../components/pages/course-detail-page";
import { educationDetailLoader } from "../services/education-detail.loader";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd, courseJsonLd } from "~/lib/seo/structured-data";

export const loader = educationDetailLoader;

export function meta(args: Route.MetaArgs) {
  const course = args.data?.course;
  const origin = metaOrigin(args);

  if (!course) {
    return pageMeta(args, {
      title: "Course",
      description: "This course could not be found.",
      noindex: true,
    });
  }

  const path = `/education/${course.id}`;

  return pageMeta(args, {
    title: course.title,
    description: course.description,
    image: course.coverImageUrl,
    jsonLd: [
      courseJsonLd({
        origin,
        pathname: path,
        name: course.title,
        description: course.description,
        image: course.coverImageUrl,
        instructorName: course.instructor.name,
        categoryName: course.categoryName,
        level: course.level,
        price: course.price,
        rating: course.rating,
        ratingCount: course.ratingCount,
      }),
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name: "Education", path: "/education" },
        { name: course.title, path },
      ]),
    ],
  });
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
