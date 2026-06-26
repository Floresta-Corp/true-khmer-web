import { manageModTeamLoader } from "../services/manage-mod-team.loader";
import { manageModTeamAction } from "../services/manage-mod-team.action";
import ManageModeratorPage from "../pages/manage-moderator-page";

export const loader = manageModTeamLoader;
export const action = manageModTeamAction;

export function meta() {
  return [{ title: "Team Management | True Khmer" }];
}

export default function ManageModRoute() {
  return <ManageModeratorPage />;
}
