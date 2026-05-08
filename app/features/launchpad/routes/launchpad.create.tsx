import LaunchpadPostPage from "../pages/launchpad-post-page";
import launchpadCreateLoader from "~/routes/api/launchpad/launchpad-create/launchpad-create-loader";
import { launchpadCreateAction } from "~/routes/api/launchpad/launchpad-create/launchpad-create-action";
import type { Route } from "./+types/launchpad.create";

export const loader = launchpadCreateLoader;
export const action = launchpadCreateAction;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Project | True Khmer Launchpad" }];
}

export default function LaunchpadCreatePage() {
  return <LaunchpadPostPage />;
}
