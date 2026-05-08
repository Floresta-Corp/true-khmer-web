import WorkSpacePage from "../components/pages/workspace-page";
import { workSpaceAction } from "~/routes/api/workspace/work-space-action";
import { workSpaceLoader } from "~/routes/api/workspace/work-space-loader";
import { useLoaderData } from "react-router";

export const action = workSpaceAction;
export const loader = workSpaceLoader;

export default function WorkspacePage() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <WorkSpacePage
      questions={loaderData.questions}
      answers={loaderData.answers}
    />
  );
}
