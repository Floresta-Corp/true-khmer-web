import {
  isRouteErrorResponse,
  useRouteError,
  type ShouldRevalidateFunctionArgs,
} from "react-router";

import { AccessRestricted } from "~/features/admin/components/access-restricted";
import ManageVolunteerDetailPage from "../components/pages/manage-volunteer-detail-page";
import { manageVolunteerDetailAction } from "../services/manage-volunteer-detail.action";
import { manageVolunteerDetailLoader } from "../services/manage-volunteer-detail.loader";

export function meta() {
  return [{ title: "Volunteer Opportunity | True Khmer" }];
}

export const loader = manageVolunteerDetailLoader;
export const action = manageVolunteerDetailAction;

export function shouldRevalidate({
  formData,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formData?.get("intent") === "deleteVolunteer") return false;
  return defaultShouldRevalidate;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function ManageVolunteerDetailRoute() {
  return <ManageVolunteerDetailPage />;
}
