import { ManageLaunchpadPageSkeleton } from "../components/launchpad/manage-launchpad-page-skeleton";
import ManageLaunchpadPage from "../components/pages/manage-launchpad-page";
import { manageLaunchpadAction } from "../services/manage-launchpad.action";
import { manageLaunchpadLoader } from "../services/manage-launchpad.loader";

export function meta() {
  return [{ title: "Manage Launchpad | True Khmer" }];
}

export const loader = manageLaunchpadLoader;
export const action = manageLaunchpadAction;

export function HydrateFallback() {
  return <ManageLaunchpadPageSkeleton />;
}

export default function ManageLaunchpadRoute() {
  return <ManageLaunchpadPage />;
}
