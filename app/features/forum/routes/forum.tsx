import { useLoaderData } from "react-router";
import ForumHeader from "../components/ForumHeader";
import ForumContent from "../components/ForumContent";
import type { Route } from ".react-router/types/app/+types/root";
import { createForumQuestion } from "~/services/forum/forum.server";
import { parseCreateForumPostForm } from "~/services/forum/utils";
import { getQuestionPagination } from "~/lib/forum";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forum & Discussions - True Khmer" },
    {
      name: "description",
      content:
        "Share knowledge, ask questions, and grow with Khmer professionals.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const result = await getQuestionPagination(request, { limit: 10 });

  return result;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const payload = parseCreateForumPostForm(formData);
  const result = await createForumQuestion(request, payload);

  return result;
}

export default function ForumPage() {
  const { data } = useLoaderData<typeof loader>();

  const handleSearch = (query: string) => {
    // TODO: Filter discussions based on search query
    console.log("Search:", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader onSearch={handleSearch} />
      <ForumContent data={data} />
    </div>
  );
}
