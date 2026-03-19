import { redirect, useLoaderData } from "react-router";
import { motion } from "framer-motion";
import ForumHeader from "../components/ForumHeader";
import ForumContent from "../components/ForumContent";
import type { Route } from ".react-router/types/app/+types/root";
import { createForumQuestion } from "~/services/forum/forum.server";
import { parseCreateForumPostForm } from "~/services/forum/utils";
import { useReducedMotion } from "framer-motion";
import {
  apiRequestWithSession,
  AuthSessionExpiredError,
} from "~/lib/server/api-client.server";
import { getSession, destroySession } from "~/lib/server/session.server";
import type { GetQuestionpaginationResponse } from "~/services/forum/types";

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
  try {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const categoryId = url.searchParams.get("categoryId");

    const params = new URLSearchParams();
    params.set("limit", "10");
    if (cursor) params.set("cursor", cursor);
    if (categoryId) params.set("categoryId", categoryId);

    const path = `/forum/questions${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const result = await apiRequestWithSession<GetQuestionpaginationResponse>(
      request,
      path,
      {
        method: "GET",
      },
    );

    console.log({ result });

    return result;
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      const session = await getSession(request);
      throw redirect("/login", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }
    return { data: undefined };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const payload = parseCreateForumPostForm(formData);
  const result = await createForumQuestion(request, payload);
  return result;
}

export default function ForumPage() {
  const { data } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();

  const handleSearch = (query: string) => {
    // TODO: Filter discussions based on search query
    console.log("Search:", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      >
        <ForumHeader onSearch={handleSearch} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          delay: prefersReducedMotion ? 0 : 0.1,
        }}
      >
        <ForumContent data={data} />
      </motion.div>
    </div>
  );
}
