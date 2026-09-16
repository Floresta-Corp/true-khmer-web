import { manageLaunchpadLoader } from "../services/manage-launchpad.loader";
import ManagePostingPage from "../components/pages/manage-launchpad-page";

export const loader = manageLaunchpadLoader;

export function meta() {
  return [{ title: "My Launchpad | True Khmer" }];
}

export default function ManageLaunchpadPage() {
  return <ManagePostingPage />;
}
