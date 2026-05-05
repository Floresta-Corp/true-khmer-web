import { LaunchpadDetailLoader } from "~/routes/api/launchpad/launchpad-detail-loader";
import type { Route } from "./+types/launchpad.$id";
import LaunchpadProjectDetailPage from "../pages/launchpad-project-detail-page";

export const loader = LaunchpadDetailLoader;

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.name ?? "Project Detail";
  return [
    { title: `${title} - True Khmer Launchpad` },
    { name: "description", content: loaderData?.description ?? title },
  ];
}

export default function LaunchpadDetailPage({ params }: Route.ComponentProps) {
  return <LaunchpadProjectDetailPage />;
}
