import { isRouteErrorResponse, useRouteError } from "react-router";

import RegistrationsPage from "../components/pages/registrations-page";
import { RegistrationsPageSkeleton } from "../components/registrations-page-skeleton";
import { registrationsLoader } from "../services/registrations.loader";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const loader = registrationsLoader;

export function meta() {
  return [{ title: "Partner Registrations | True Khmer" }];
}

export function HydrateFallback() {
  return <RegistrationsPageSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function RegistrationsRoute() {
  return <RegistrationsPage />;
}
