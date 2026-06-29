import { useEffect } from "react";
import { VolunteerDetailPage } from "../components/pages/volunteer-detail-page";
import { VolunteerDetailLoader } from "~/features/volunteer/services/volunteer-detail-loader";
import { VolunteerDetailAction } from "~/features/volunteer/services/volunteer-detail-action";
import type { Route } from "./+types/volunteer.$id";
import { useVolunteerSelectedRoles } from "~/stores/selected-volunteer-roles-store";

export const loader = VolunteerDetailLoader;
export const action = VolunteerDetailAction;

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.volunteer?.title ?? "Volunteer Opportunity";
  return [
    { title: `${title} | True Khmer` },
    { name: "description", content: loaderData?.volunteer?.overview ?? title },
  ];
}

export default function VolunteerOpportunityDetail() {
  const clearAll = useVolunteerSelectedRoles((s) => s.clearAll);

  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  return <VolunteerDetailPage />;
}
