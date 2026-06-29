import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import QuestionVoteComponent from "../components/question-vote-component";
import AllAnswers from "../components/sections/all-answers";
import type { Route } from "./+types/forum.$id";
import { forumDetailLoader } from "../services/forum-detail.loader";
import { forumDetailAction } from "../services/forum-detail.action";
import BackToButton from "~/components/back-to-button";
import ForumDetailQuestionHeader from "../components/forum-detail-question-header";
import ReplyBox from "../components/reply-box";
import ShareQuestionDialog from "../components/dialog/share-question-dialog";
import ForumBestAnswer from "../components/sections/forum-best-answer";
import { resolveImageURL } from "~/lib/utils";
import { ImageLightbox } from "~/components/image-lightbox";
import { ForumPageLayout } from "../components/forum-page-layout";

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
// const MOCK_RELATED_DISCUSSIONS = [
//   {
//     id: "mock-1",
//     title: "Best practices for carbon-aware computing in 2026",
//     body: "Mock discussion",
//     status: "PUBLISHED" as const,
//     answerCount: 15,
//     upvoteCount: 45,
//     downvoteCount: 2,
//     score: 43,
//     viewerVote: "NONE" as const,
//     viewerSave: false,
//     bestAnswerId: null,
//     bestAnswerSelectedAt: null,
//     category: { id: "cat-1", name: "Sustainability" },
//     author: {
//       id: "auth-1",
//       name: "John Developer",
//       avatarKey: "mock-avatar-1",
//     },
//     tags: [{ id: "tag-1", name: "carbon" }],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "mock-2",
//     title: "How to measure digital sustainability metrics",
//     body: "Mock discussion",
//     status: "PUBLISHED" as const,
//     answerCount: 15,
//     upvoteCount: 32,
//     downvoteCount: 1,
//     score: 31,
//     viewerVote: "NONE" as const,
//     viewerSave: false,
//     bestAnswerId: null,
//     bestAnswerSelectedAt: null,
//     category: { id: "cat-1", name: "Sustainability" },
//     author: {
//       id: "auth-2",
//       name: "Jane Smith",
//       avatarKey: "mock-avatar-2",
//     },
//     tags: [{ id: "tag-2", name: "metrics" }],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "mock-3",
//     title: "Green coding frameworks comparison",
//     body: "Mock discussion",
//     status: "PUBLISHED" as const,
//     answerCount: 15,
//     upvoteCount: 28,
//     downvoteCount: 0,
//     score: 28,
//     viewerVote: "NONE" as const,
//     viewerSave: false,
//     bestAnswerId: null,
//     bestAnswerSelectedAt: null,
//     category: { id: "cat-2", name: "Development" },
//     author: {
//       id: "auth-3",
//       name: "Alex Code",
//       avatarKey: "mock-avatar-3",
//     },
//     tags: [{ id: "tag-3", name: "frameworks" }],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ForumDetailPage() {
  const { question, bestAnswer, answers, userId, reportReasons } =
    useLoaderData<typeof loader>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  return (
    <ForumPageLayout>
      {/* Back nav + actions */}
      <motion.div
        className="mb-8 flex items-center justify-between"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <BackToButton to="/forum" />
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
                question={question}
                isAuthenticated={Boolean(userId)}
                reportReasons={
                  reportReasons?.reportingTypes.map((v) => ({
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

              {question.imageKey ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(0)}
                    className="mt-5 w-full cursor-pointer rounded-xl bg-transparent p-0"
                    aria-label="Open image preview"
                  >
                    <img
                      src={resolveImageURL(question.imageKey)}
                      alt={question.title}
                      className="w-full aspect-video rounded-xl object-cover"
                    />
                  </button>

                  {lightboxIndex !== null && (
                    <ImageLightbox
                      images={[resolveImageURL(question.imageKey)]}
                      initialIndex={lightboxIndex}
                      alt={question.title}
                      onClose={() => setLightboxIndex(null)}
                    />
                  )}
                </>
              ) : null}

              {question.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium leading-4.5 text-[#8a93a3] sm:text-sm sm:leading-5.25">
                  {question.tags.map((tag) => (
                    <span key={tag.id}>#{tag.name}</span>
                  ))}
                </div>
              )}

              <div className="mt-5 border-t border-[#abadaf1a] pt-5 sm:mt-6 sm:pt-6">
                <div className="flex flex-wrap items-center gap-3 text-[#48566a] sm:gap-5">
                  <QuestionVoteComponent question={question} />

                  <div className="inline-flex items-center gap-2 text-xs font-medium leading-4.5 sm:text-sm sm:leading-5.25">
                    <MessageCircle className="h-5 w-5" />
                    <span>{question.answerCount} answers</span>
                  </div>

                  <ShareQuestionDialog
                    question={question}
                    className="cursor-pointer inline-flex items-center gap-2 text-xs font-medium leading-4.5 hover:text-[#245fca] sm:text-sm sm:leading-5.25"
                  />
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
            <ReplyBox question={question} />
          </motion.div>

          {bestAnswer && bestAnswer.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-6"
            >
              <ForumBestAnswer
                answer={bestAnswer?.[0]}
                userId={userId}
                question={question}
              />
            </motion.div>
          )}

          {answers && answers.length > 0 ? (
            <AllAnswers answers={answers} />
          ) : (
            <motion.p
              className="mt-8 text-center text-sm text-[#65758b]"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              No answers yet. Be the first to share your knowledge!
            </motion.p>
          )}
        </div>

        {/*<motion.aside
            className="hidden lg:block w-full xl:w-64 xl:shrink-0"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <RelatedDiscussionsCard discussions={displayedRelatedDiscussions} />
          </motion.aside> */}
      </section>
    </ForumPageLayout>
  );
}
