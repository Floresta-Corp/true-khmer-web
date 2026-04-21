import { Link, useLoaderData } from "react-router";
import { MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import ForumPostActions from "../components/forum-post-action";
import QuestionVoteComponent from "../components/question-vote-component";
import AllAnswers from "../components/sections/all-answers";
import type { Route } from "./+types/forum.$id";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import { forumDetailLoader } from "~/routes/api/forum/forum-detail-loader";
import { forumDetailAction } from "~/routes/api/forum/forum-detail-action";
import BackToButton from "~/components/back-to-button";
import RelatedDiscussionsCard from "../components/card/related-discussions-card";
import ForumDetailQuestionHeader from "../components/forum-detail-question-header";

export const loader = forumDetailLoader;
export const action = forumDetailAction;

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.question?.title ?? "Forum Discussion";
  return [
    { title: `${title} - True Khmer Forum` },
    { name: "description", content: title },
  ];
}

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

// ─── Mock data for related discussions ───────────────────────────────────────
const MOCK_RELATED_DISCUSSIONS = [
  {
    id: "mock-1",
    title: "Best practices for carbon-aware computing in 2026",
    body: "Mock discussion",
    status: "PUBLISHED" as const,
    answerCount: 15,
    upvoteCount: 45,
    downvoteCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    score: 43,
    viewerVote: "NONE" as const,
    category: { id: "cat-1", name: "Sustainability" },
    author: {
      id: "auth-1",
      name: "John Developer",
      avatarKey: "mock-avatar-1",
    },
    tags: [{ id: "tag-1", name: "carbon" }],
  },
  {
    id: "mock-2",
    title: "How to measure digital sustainability metrics",
    body: "Mock discussion",
    status: "PUBLISHED" as const,
    answerCount: 15,
    upvoteCount: 32,
    downvoteCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    score: 31,
    viewerVote: "NONE" as const,
    category: { id: "cat-1", name: "Sustainability" },
    author: {
      id: "auth-2",
      name: "Jane Smith",
      avatarKey: "mock-avatar-2",
    },
    tags: [{ id: "tag-2", name: "metrics" }],
  },
  {
    id: "mock-3",
    title: "Green coding frameworks comparison",
    body: "Mock discussion",
    status: "PUBLISHED" as const,
    answerCount: 15,
    upvoteCount: 28,
    downvoteCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    score: 28,
    viewerVote: "NONE" as const,
    category: { id: "cat-2", name: "Development" },
    author: {
      id: "auth-3",
      name: "Alex Code",
      avatarKey: "mock-avatar-3",
    },
    tags: [{ id: "tag-3", name: "frameworks" }],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ForumDetailPage() {
  const { question, answers, userId } = useLoaderData<typeof loader>();
  const displayedRelatedDiscussions = MOCK_RELATED_DISCUSSIONS;

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-xl font-semibold text-[#030213]">
            Discussion not found
          </h1>
          <p className="mt-2 text-[#65758b]">
            The post you are looking for does not exist or failed to load.
          </p>
          <Link
            to="/forum"
            className="mt-4 inline-block text-[#2f6fe4] hover:underline"
          >
            Go back to Forum
          </Link>
        </motion.div>
      </div>
    );
  }

  const postedAt = formatMinutesOrHoursAgo(question.createdAt);
  const authorProfile = resolveImageURL(question.author.avatarKey);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="mx-auto w-full px-20 py-10">
        <section className="mx-auto w-full max-w-5xl">
          {/* Back nav + actions */}
          <motion.div
            className="mb-8 flex items-center justify-between"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <BackToButton text="Back to Forum" to="/forum" />
            <ForumPostActions />
          </motion.div>

          {/* Main question card */}
          <motion.article
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <div className="rounded-2xl border border-[#e1e7ef] bg-white px-8 py-8">
              <ForumDetailQuestionHeader
                authorName={question.author.name}
                authorAvatar={question.author.avatarKey}
                category={question.category.name}
                postedAt={question.createdAt}
              />

              <h1 className="mt-6 text-[40px] leading-10 font-bold tracking-[-0.2px] text-[#2c2f31]">
                {question.title}
              </h1>

              <p className="mt-6 text-lg leading-9 text-[#595c5e]">
                {question.body}
              </p>

              {question.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium leading-5.25 text-[#8a93a3]">
                  {question.tags.map((tag) => (
                    <span key={tag.id}>#{tag.name}</span>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t border-[#abadaf1a] pt-6">
                <div className="flex flex-wrap items-center gap-5 text-[#48566a]">
                  <div className="rounded-xl border border-[#f3f4f6] bg-[#f9fafb] p-px">
                    <QuestionVoteComponent
                      questionId={question.id}
                      score={question.score}
                      viewerVote={question.viewerVote}
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-medium leading-5.25">
                    <MessageCircle className="h-5 w-5" />
                    <span>{question.answerCount} answers</span>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-medium leading-5.25 hover:text-[#245fca]"
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.article>

          {answers && answers.length > 0 ? (
            <AllAnswers answers={answers} />
          ) : (
            <motion.p
              className="mt-8 text-center text-sm text-[#65758b]"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              No answers yet. Be the first to share your knowledge!
            </motion.p>
          )}
        </section>
      </main>
    </div>
  );
}
