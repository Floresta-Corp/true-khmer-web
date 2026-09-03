import { useLoaderData } from "react-router";
import CourseBuilderPage from "~/features/course-builder/components/pages/course-builder-page";
import { courseBuilderAction } from "~/features/course-builder/services/course-builder.action";
import { courseBuilderEditLoader } from "~/features/course-builder/services/course-builder-edit.loader";
import type { Route } from "./+types/course-builder.$id";

export const loader = courseBuilderEditLoader;
export const action = courseBuilderAction;

export function meta({ data }: Route.MetaArgs) {
  const title = data?.draft.title;
  return [
    {
      title: title ? `Edit ${title} | True Khmer` : "Edit course | True Khmer",
    },
  ];
}

export default function CourseBuilderEditRoute() {
  const {
    categories,
    draft,
    sections,
    courseStatus,
    canReplaceCurriculum,
    canReplaceQuiz,
    certificate,
    format,
    passMark,
    questions,
    courseId,
    step,
  } = useLoaderData<typeof loader>();

  return (
    <CourseBuilderPage
      categories={categories}
      initialDraft={draft}
      initialSections={sections}
      courseStatus={courseStatus}
      canReplaceCurriculum={canReplaceCurriculum}
      canReplaceQuiz={canReplaceQuiz}
      initialCertificate={certificate}
      initialFormat={format}
      initialPassMark={passMark}
      initialQuestions={questions}
      initialCourseId={courseId}
      initialStep={step}
    />
  );
}
