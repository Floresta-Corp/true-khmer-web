import LaunchpadEditPage from "../pages/launchpad-edit-page";
import launchpadEditLoader from "~/routes/api/launchpad/launchpad-edit/launchpad-edit-loader";
import { launchpadEditAction } from "~/routes/api/launchpad/launchpad-edit/launchpad-edit-action";

export const loader = launchpadEditLoader;
export const action = launchpadEditAction;

export function meta() {
  return [{ title: "Edit Project | True Khmer Launchpad" }];
}

export default function LaunchpadEdit() {
  return <LaunchpadEditPage />;
}
