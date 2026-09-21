import { manageLaunchpadDetailLoader } from "../services/manage-launchpad-detail.loader";
import { manageLaunchpadDetailAction } from "../services/manage-launchpad-detail.action";
import ManagePostingDetailPage from "../components/pages/manage-launchpad-detail-page";

export const loader = manageLaunchpadDetailLoader;
export const action = manageLaunchpadDetailAction;

export default function ManageLaunchpadDetailPage() {
  return <ManagePostingDetailPage />;
}
