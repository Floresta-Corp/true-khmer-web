import { useLoaderData } from "react-router";
import { VolunteerDetailPage } from "../page/volunteer-detail-page";
import type { Route } from "./+types/volunteer.$id";
import { VolunteerDetailLoader } from "~/routes/api/volunteer/volunteer-detail-loader";
import { VolunteerDetailAction } from "~/routes/api/volunteer/volunteer-detail-action";

export const loader = VolunteerDetailLoader;
export const action = VolunteerDetailAction;

export default function VolunteerOpportunityDetail({
  params,
}: Route.ComponentProps) {
  const { volunteer, userId } = useLoaderData<typeof loader>();

  return <VolunteerDetailPage volunteer={volunteer} userId={userId || ""} />;
}
