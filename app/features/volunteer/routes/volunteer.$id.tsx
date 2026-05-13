import { useLoaderData } from "react-router";
import { VolunteerDetailPage } from "../page/volunteer-detail-page";
import { VolunteerDetailLoader } from "~/routes/api/volunteer/volunteer-detail-loader";
import { VolunteerDetailAction } from "~/routes/api/volunteer/volunteer-detail-action";
import type { Route } from "./+types/volunteer.$id";

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
  const { volunteer } = useLoaderData<typeof loader>();
  return <VolunteerDetailPage volunteer={volunteer} />;
}
