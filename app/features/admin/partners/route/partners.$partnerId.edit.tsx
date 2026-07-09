import { isRouteErrorResponse, useRouteError } from "react-router";

import PartnerEditPage from "../components/pages/partner-edit-page";
import { PartnerDetailSkeleton } from "../components/partners-page-skeleton";
import { partnerDetailLoader } from "../services/partner-detail.loader";
import { partnerEditAction } from "../services/partner-edit.action";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const loader = partnerDetailLoader;
export const action = partnerEditAction;

export function meta() {
  return [{ title: "Edit Partner | True Khmer" }];
}

export function HydrateFallback() {
  return <PartnerDetailSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function PartnerEditRoute() {
  return <PartnerEditPage />;
}
