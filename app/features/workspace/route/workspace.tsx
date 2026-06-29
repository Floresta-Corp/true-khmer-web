import WorkSpacePage from "../components/pages/workspace-page";
import { workSpaceAction } from "~/features/workspace/services/work-space-action";
import { workSpaceLoader } from "~/features/workspace/services/work-space-loader";

export const action = workSpaceAction;
export const loader = workSpaceLoader;

export function meta() {
  return [{ title: "Workspace | True Khmer" }];
}

export default function WorkspacePage() {
  return <WorkSpacePage />;
}
