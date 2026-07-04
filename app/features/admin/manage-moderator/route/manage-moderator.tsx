import { isRouteErrorResponse, useRouteError } from "react-router";

import { manageModTeamLoader } from "../services/manage-mod-team.loader";
import { manageModTeamAction } from "../services/manage-mod-team.action";
import ManageModeratorPage from "../components/pages/manage-moderator-page";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const loader = manageModTeamLoader;
export const action = manageModTeamAction;

export function meta() {
  return [{ title: "Team Management | True Khmer" }];
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function ManageModerator() {
  return <ManageModeratorPage />;
}
