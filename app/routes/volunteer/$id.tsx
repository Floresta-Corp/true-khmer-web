import { useLoaderData, useParams } from "react-router";
import { getPostById } from "~/lib/post";
import { VolunteerDetailPage } from "./components/VolunteerDetailPage";
import VolunteerPostPage from "./components/VolunteerPostPage";

export async function loader({ params }: { params: { id?: string } }) {
  const routeId = params.id;

  if (routeId === "post") {
    return { volunteer: null };
  }

  const parsedId = Number(routeId);
  if (!Number.isInteger(parsedId)) {
    throw new Response("Invalid volunteer id", { status: 400 });
  }

  const { volunteer } = await getPostById(parsedId);
  return { volunteer };
}

export default function VolunteerOpportunityDetail() {
  const { id } = useParams();
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
