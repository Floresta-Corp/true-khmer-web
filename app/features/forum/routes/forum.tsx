import { useLoaderData } from "react-router";

import ForumHeader from "../components/ForumHeader";
import ForumContent from "../components/ForumContent";
import type { ForumContentData } from "../components/ForumContent";
import type { DiscussionPost } from "../components/DiscussionThread";
import type { Route } from ".react-router/types/app/+types/root";
import { createForumQuestion } from "~/services/forum/forum.server";
import { parseCreateForumPostForm } from "~/services/forum/utils";

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

export async function loader() {
  // Mock query result that can be replaced with a real API call later.
  const posts: DiscussionPost[] = [
    {
      id: "1",
      category: "Tech & Innovation",
      badge: "Author",
      badgeColor: "green",
      title: "The future of Sustainable Energy in Cambodia",
      description:
        "We've been mapping out potential solar farm locations across the northern provinces. The initial data looks very promising for rural electrification.",
      tags: ["# Sustainability", "# Sustainability"],
      timeAgo: "Yesterday",
      author: {
        name: "Virak Hou",
        avatar:
          "http://localhost:3845/assets/77666d26801f7bbe2c1c174a2f3612979db8e4f4.png",
        role: "Impact Founder",
      },
      likes: 89,
      answers: 24,
    },
    {
      id: "2",
      category: "Networking",
      title: "Looking for a co-founder for a FinTech project",
      description:
        "I have the MVP ready for a micro-lending platform aimed at rural farmers. Need someone with a strong background in financial regulations and electrification.",
      tags: ["# Sustainability", "# Sustainability"],
      timeAgo: "1 day ago",
      author: {
        name: "Vannak Long",
        avatar:
          "http://localhost:3845/assets/84deebc9464283edd8955ce95d024a9432e91489.png",
        role: "Entrepreneur",
      },
      likes: 28,
      answers: 12,
    },
    {
      id: "3",
      category: "Tech & Innovation",
      title: "Top 5 Tech Skills in demand for 2026 in Cambodia",
      description:
        "I have the MVP ready for a micro-lending platform aimed at rural farmers. Need someone with a strong background in financial regulations and electrification.",
      tags: ["# Sustainability", "# Sustainability"],
      timeAgo: "2 days ago",
      author: {
        name: "Sophea Rath",
        avatar:
          "http://localhost:3845/assets/8befcb6610611323e87966c7d635c0e3edd12197.png",
        role: "Tech Recruiter",
      },
      likes: 156,
      answers: 45,
    },
  ];

  const forumData: ForumContentData = { posts };

  return { forumData };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const payload = parseCreateForumPostForm(formData);
  const result = await createForumQuestion(request, payload);

  return result;
}

export default function ForumPage() {
  const { forumData } = useLoaderData<typeof loader>();

  const handleSearch = (query: string) => {
    // TODO: Filter discussions based on search query
    console.log("Search:", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader onSearch={handleSearch} />
      <ForumContent data={forumData} />
    </div>
  );
}
