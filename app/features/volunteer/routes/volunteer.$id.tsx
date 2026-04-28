import { useLoaderData } from "react-router";
import { VolunteerDetailPage } from "../page/volunteer-detail-page";
import type { Route } from "./+types/volunteer.$id";
import { VolunteerDetailLoader } from "~/routes/api/volunteer/volunteer-detail-loader";

export const loader = VolunteerDetailLoader;

export default function VolunteerOpportunityDetail({
  params,
}: Route.ComponentProps) {
  const { volunteer } = useLoaderData<typeof loader>();

  return <VolunteerDetailPage volunteer={volunteer} />;
}
