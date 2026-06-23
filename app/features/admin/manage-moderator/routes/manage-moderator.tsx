import { manageModTeamLoader } from "../service/manage-mod-team.loader";
import { manageModTeamAction } from "../service/manage-mod-team.action";
import ManageModeratorPage from "../pages/manage-moderator-page";

export const loader = manageModTeamLoader;
export const action = manageModTeamAction;

export function meta() {
  return [{ title: "Team Management | True Khmer" }];
}

export default function ManageModPage() {
  return <ManageModeratorPage />;
}
