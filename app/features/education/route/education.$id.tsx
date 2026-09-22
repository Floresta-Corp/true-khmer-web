import { useLoaderData, type ShouldRevalidateFunctionArgs } from "react-router";
import type { Route } from "./+types/education.$id";
import CourseDetailPage from "../components/pages/course-detail-page";
import CourseSingleDetailPage from "../components/pages/course-single-detail-page";
import { educationDetailLoader } from "../services/education-detail.loader";
import { educationDetailAction } from "../services/education-detail.action";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd, courseJsonLd } from "~/lib/seo/structured-data";

export const loader = educationDetailLoader;
export const action = educationDetailAction;

export function shouldRevalidate({
  formData,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formData?.get("intent") === "resume") return false;
  return defaultShouldRevalidate;
}

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
 * Two layouts behind one route: a course built as one standalone lesson leads
 * with the player, while a multi-chapter course leads with its cover and
 * curriculum. The format is the course's own, not a guess from lesson count —
 * a multi-chapter course can legitimately hold a single lesson while it is
 * still being written.
 *
 * Keyed on the course, because the recommendations rail moves between courses
 * on this same route: without it React keeps the screen mounted and hands the
 * new course the old one's state — the previous lesson's playback gate, its
 * completion, its bookmark — which is enough to record a lesson as finished
 * the moment the learner arrives at it.
 */
export default function CourseDetailRoute() {
  const { course } = useLoaderData<typeof loader>();

  return course.format === "SINGLE" ? (
    <CourseSingleDetailPage key={course.id} />
  ) : (
    <CourseDetailPage key={course.id} />
  );
}
