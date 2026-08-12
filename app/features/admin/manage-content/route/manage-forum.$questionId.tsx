import {
  isRouteErrorResponse,
  useRouteError,
  type ShouldRevalidateFunctionArgs,
} from "react-router";

import { AccessRestricted } from "~/features/admin/components/access-restricted";
import { ManageForumDetailSkeleton } from "../components/forum/manage-forum-detail-skeleton";
import ManageForumDetailPage from "../components/pages/manage-forum-detail-page";
import { manageForumDetailAction } from "../services/manage-forum-detail.action";
import { manageForumDetailLoader } from "../services/manage-forum-detail.loader";

export function meta() {
  return [{ title: "Forum Question | True Khmer" }];
}

export const loader = manageForumDetailLoader;
export const action = manageForumDetailAction;

export function shouldRevalidate({
  formData,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formData?.get("intent") === "deleteQuestion") return false;
  return defaultShouldRevalidate;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function ManageForumDetailRoute() {
  return <ManageForumDetailPage />;
}
