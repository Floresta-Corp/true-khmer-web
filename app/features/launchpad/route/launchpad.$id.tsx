import { useEffect } from "react";
import { launchpadDetailLoader } from "../services/launchpad-detail.loader";
import type { Route } from "./+types/launchpad.$id";
import LaunchpadDetailPage from "../components/pages/launchpad-detail-page";
import { useLaunchpadSelectedRoles } from "~/stores/selected-launchpad-roles-store";

export const loader = launchpadDetailLoader;

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.project?.name ?? "Project Detail";
  return [
    { title: `${title} - True Khmer Launchpad` },
    {
      name: "description",
      content: loaderData?.project?.description ?? title,
    },
  ];
}

export default function LaunchpadDetail({ params }: Route.ComponentProps) {
  const clearAll = useLaunchpadSelectedRoles((s) => s.clearAll);

  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  return <LaunchpadDetailPage />;
}
