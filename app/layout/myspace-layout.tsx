import { mySpaceSidebarConfig } from "~/components/app-sidebar";
import SpaceLayout from "~/layout/space-layout";

export default function MySpaceLayout() {
  return <SpaceLayout sidebar={mySpaceSidebarConfig} />;
}
