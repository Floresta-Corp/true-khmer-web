import { useLoaderData } from "react-router";
import CourseBuilderPage from "~/features/course-builder/components/pages/course-builder-page";
import { courseBuilderAction } from "~/features/course-builder/services/course-builder.action";
import { courseBuilderLoader } from "~/features/course-builder/services/course-builder.loader";

export const loader = courseBuilderLoader;
export const action = courseBuilderAction;

export function meta() {
  return [{ title: "Create course | True Khmer" }];
}

export default function CourseBuilderRoute() {
  const { categories } = useLoaderData<typeof loader>();
  return <CourseBuilderPage categories={categories} />;
}
