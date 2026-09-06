import { useNavigation } from "react-router";
import { workSpaceSidebarConfig } from "~/components/app-sidebar";
import CreateEventPageSkeleton from "~/features/workspace/components/create-event/create-event-page-skeleton";
import SpaceLayout from "~/layout/space-layout";

export default function WorkspaceLayout() {
  const navigation = useNavigation();
  const isOpeningCreateEvent =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/my-events/create";

  if (isOpeningCreateEvent) return <CreateEventPageSkeleton />;

  return <SpaceLayout sidebar={workSpaceSidebarConfig} />;
}
