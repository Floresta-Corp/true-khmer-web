import { useNavigation } from "react-router";
import { workSpaceSidebarConfig } from "~/components/app-sidebar";
import CreateEventPageSkeleton from "~/features/workspace/components/create-event/create-event-page-skeleton";
import { MyBlogDetailSkeleton } from "~/features/workspace/my-blog/components/my-blog-detail-skeleton";
import SpaceLayout from "~/layout/space-layout";

const BLOG_EDIT_PATH = /^\/workspace\/khmer-voices\/[^/]+\/edit\/?$/;
const BLOG_NEW_PATH = "/workspace/khmer-voices/new";

export default function WorkspaceLayout() {
  const navigation = useNavigation();
  const pendingPath =
    navigation.state === "loading" ? navigation.location?.pathname : undefined;
  const isOpeningCreateEvent = pendingPath === "/my-events/create";
  const isOpeningNewBlog = pendingPath === BLOG_NEW_PATH;
  const isOpeningBlogDetail = Boolean(
    pendingPath && BLOG_EDIT_PATH.test(pendingPath),
  );

  if (isOpeningCreateEvent) return <CreateEventPageSkeleton />;

  /* The compose screen waits on its loader before it can render, so stand the
     skeleton up in the content area while the sidebar stays put. */
  if (isOpeningBlogDetail || isOpeningNewBlog) {
    return (
      <SpaceLayout sidebar={workSpaceSidebarConfig}>
        <MyBlogDetailSkeleton withCover={isOpeningBlogDetail} />
      </SpaceLayout>
    );
  }

  return <SpaceLayout sidebar={workSpaceSidebarConfig} />;
}
