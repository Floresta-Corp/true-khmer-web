import { isRouteErrorResponse, useRouteError } from "react-router";

import PartnerDetailPage from "../components/pages/partner-detail-page";
import { PartnerDetailSkeleton } from "../components/partners-page-skeleton";
import { partnerDetailLoader } from "../services/partner-detail.loader";
import { partnerDetailAction } from "../services/partner-detail.action";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const loader = partnerDetailLoader;
export const action = partnerDetailAction;

export function meta() {
  return [{ title: "Partner Details | True Khmer" }];
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

export default function PartnerDetailRoute() {
  return <PartnerDetailPage />;
}
