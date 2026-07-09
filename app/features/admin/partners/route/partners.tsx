import { isRouteErrorResponse, useRouteError } from "react-router";

import PartnersPage from "../components/pages/partners-page";
import { PartnersPageSkeleton } from "../components/partners-page-skeleton";
import { partnersLoader } from "../services/partners.loader";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const loader = partnersLoader;

export function meta() {
  return [{ title: "Partners | True Khmer" }];
}

export function HydrateFallback() {
  return <PartnersPageSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function PartnersRoute() {
  return <PartnersPage />;
}
