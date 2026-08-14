import {
  isRouteErrorResponse,
  useRouteError,
  type ShouldRevalidateFunctionArgs,
} from "react-router";

import { AccessRestricted } from "~/features/admin/components/access-restricted";
import ManageLaunchpadDetailPage from "../components/pages/manage-launchpad-detail-page";
import { manageLaunchpadDetailAction } from "../services/manage-launchpad-detail.action";
import { manageLaunchpadDetailLoader } from "../services/manage-launchpad-detail.loader";

export function meta() {
  return [{ title: "Launchpad Project | True Khmer" }];
}

export const loader = manageLaunchpadDetailLoader;
export const action = manageLaunchpadDetailAction;

export function shouldRevalidate({
  formData,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formData?.get("intent") === "deleteLaunchpad") return false;
  return defaultShouldRevalidate;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function ManageLaunchpadDetailRoute() {
  return <ManageLaunchpadDetailPage />;
}
