import { ManageForumPageSkeleton } from "../components/forum/manage-forum-page-skeleton";
import ManageForumPage from "../components/pages/manage-forum-page";
import { manageForumAction } from "../services/manage-forum.action";
import { manageForumLoader } from "../services/manage-forum.loader";

export function meta() {
  return [{ title: "Manage Forum | True Khmer" }];
}

export const loader = manageForumLoader;
export const action = manageForumAction;

export function HydrateFallback() {
  return <ManageForumPageSkeleton />;
}

export default function ManageForumRoute() {
  return <ManageForumPage />;
}
