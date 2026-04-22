import { Link, useLoaderData } from "react-router";
import { MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
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
import ReplyBox from "../components/reply-box";

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
  const { question, answers, userId, reportReasons } =
    useLoaderData<typeof loader>();
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
    <div className="min-h-screen bg-[#f8fafc] w-full">
      <main className="mx-auto w-full px-4 pb-10 md:px-10 xl:px-30 pt-8">
        {/* Back nav + actions */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <BackToButton text="Back to Forum" to="/forum" />
        </motion.div>
        <section className="mx-auto flex w-full flex-col items-start justify-center gap-8 xl:flex-row xl:gap-10">
          <div className="w-full">
            {/* Main question card */}
            <motion.article
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <div className="rounded-2xl border border-[#e1e7ef] bg-white p-4 sm:p-6 lg:px-8 lg:py-8">
                <ForumDetailQuestionHeader
                  questionId={question.id}
                  authorName={question.author.name}
                  authorAvatar={authorProfile}
                  category={question.category}
                  postedAt={postedAt}
                  title={question.title}
                  isAuthenticated={Boolean(userId)}
                  reportReasons={
                    reportReasons.reportingTypes.map((v) => ({
                      id: v.id,
                      reason: v.type,
                    })) || []
                  }
                />

                <h1 className="mt-5 text-2xl leading-8 font-bold text-[#2c2f31] sm:mt-6 sm:text-3xl sm:leading-9 lg:text-[40px] lg:leading-10 lg:tracking-[-0.2px]">
                  {question.title}
                </h1>

                <p className="mt-4 text-base leading-6.75 text-[#595c5e] sm:mt-6 sm:text-lg sm:leading-9">
                  {question.body}
                </p>

                {question.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium leading-4.5 text-[#8a93a3] sm:text-sm sm:leading-5.25">
                    {question.tags.map((tag) => (
                      <span key={tag.id}>#{tag.name}</span>
                    ))}
                  </div>
                )}

                <div className="mt-5 border-t border-[#abadaf1a] pt-5 sm:mt-6 sm:pt-6">
                  <div className="flex flex-wrap items-center gap-3 text-[#48566a] sm:gap-5">
                    <div className="rounded-xl border border-[#f3f4f6] bg-[#f9fafb] p-px">
                      <QuestionVoteComponent
                        questionId={question.id}
                        score={question.score}
                        viewerVote={question.viewerVote}
                      />
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-medium leading-4.5 sm:text-sm sm:leading-5.25">
                      <MessageCircle className="h-5 w-5" />
                      <span>{question.answerCount} answers</span>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-xs font-medium leading-4.5 hover:text-[#245fca] sm:text-sm sm:leading-5.25"
                    >
                      <Share2 className="h-5 w-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-6"
            >
              {/* Reply box for posting a new answer / reply */}
              <ReplyBox questionId={question.id} />
            </motion.div>

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
          </div>

          <motion.aside
            className="hidden lg:block w-full xl:w-64 xl:shrink-0"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <RelatedDiscussionsCard discussions={displayedRelatedDiscussions} />
          </motion.aside>
        </section>
      </main>
    </div>
  );
}
