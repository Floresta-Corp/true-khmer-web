import { isRouteErrorResponse, useRouteError } from "react-router";

import PartnerNewPage from "../components/pages/partner-new-page";
import { partnerNewAction } from "../services/partner-new.action";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const action = partnerNewAction;

export function meta() {
  return [{ title: "Create New Partner | True Khmer" }];
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function PartnerNewRoute() {
  return <PartnerNewPage />;
}
