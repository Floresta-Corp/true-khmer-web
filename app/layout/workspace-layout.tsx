import { workSpaceSidebarConfig } from "~/components/app-sidebar";
import SpaceLayout from "~/layout/space-layout";

export default function WorkspaceLayout() {
  return <SpaceLayout sidebar={workSpaceSidebarConfig} />;
}
