import { useLoaderData } from "react-router";
import { getPostById } from "~/lib/post";
import { VolunteerDetailPage } from "../page/volunteer-detail-page";
import VolunteerPostPage from "../page/volunteer-post-page";
import type { Route } from "./+types/volunteer.$id";
import { VolunteerDetailLoader } from "~/routes/api/volunteer/volunteer-detail-loader";

export const loader = VolunteerDetailLoader;

export default function VolunteerOpportunityDetail({
  params,
}: Route.ComponentProps) {
  const { id } = params;
  const { volunteer } = useLoaderData<typeof loader>();

  return (
    <>
      {id === "post" ? (
        <VolunteerPostPage />
      ) : (
        <VolunteerDetailPage volunteer={volunteer ?? undefined} />
      )}
    </>
  );
}
