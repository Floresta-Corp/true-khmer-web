import LaunchpadEditPage from "../components/pages/launchpad-edit-page";
import launchpadEditLoader from "../services/launchpad-edit.loader";
import { launchpadEditAction } from "../services/launchpad-edit.action";

export const loader = launchpadEditLoader;
export const action = launchpadEditAction;

export function meta() {
  return [{ title: "Edit Project | True Khmer Launchpad" }];
}

export default function LaunchpadEdit() {
  return <LaunchpadEditPage />;
}
