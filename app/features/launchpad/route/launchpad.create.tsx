import LaunchpadPostPage from "../components/pages/launchpad-post-page";
import launchpadCreateLoader from "../services/launchpad-create.loader";
import { launchpadCreateAction } from "../services/launchpad-create.action";
import type { Route } from "./+types/launchpad.create";

export const loader = launchpadCreateLoader;
export const action = launchpadCreateAction;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Project | True Khmer Launchpad" }];
}

export default function LaunchpadCreatePage() {
  return <LaunchpadPostPage />;
}
