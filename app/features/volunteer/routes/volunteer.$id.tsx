import { useLoaderData } from "react-router";
import { VolunteerDetailPage } from "../page/volunteer-detail-page";
import { VolunteerDetailLoader } from "~/routes/api/volunteer/volunteer-detail-loader";
import { VolunteerDetailAction } from "~/routes/api/volunteer/volunteer-detail-action";

export const loader = VolunteerDetailLoader;
export const action = VolunteerDetailAction;

export default function VolunteerOpportunityDetail() {
  const { volunteer } = useLoaderData<typeof loader>();

  return <VolunteerDetailPage volunteer={volunteer} />;
}
