import { isRouteErrorResponse, useRouteError } from "react-router";

import RegistrationDetailPage from "../components/pages/registration-detail-page";
import { RegistrationDetailSkeleton } from "../components/registrations-page-skeleton";
import { registrationDetailLoader } from "../services/registration-detail.loader";
import { registrationDetailAction } from "../services/registration-detail.action";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const loader = registrationDetailLoader;
export const action = registrationDetailAction;

export function meta() {
  return [{ title: "Review Partner Registration | True Khmer" }];
}

export function HydrateFallback() {
  return <RegistrationDetailSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function RegistrationDetailRoute() {
  return <RegistrationDetailPage />;
}
