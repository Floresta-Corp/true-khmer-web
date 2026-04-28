import { LaunchpadDetailLoader } from "~/routes/api/launchpad/launchpad-detail-loader";
import type { Route } from "./+types/launchpad.$id";
import LaunchpadPostPage from "../pages/launchpad-post-page";
import LaunchpadProjectDetailPage from "../pages/launchpad-project-detail-page";

export const loader = LaunchpadDetailLoader;

export default function LaunchpadDetailPage({ params }: Route.ComponentProps) {
  return <LaunchpadProjectDetailPage />;
}
