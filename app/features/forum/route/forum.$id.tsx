import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { EyeOff, MessageCircle } from "lucide-react";
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
import SuspensionNoticeDialog from "~/components/suspension-notice-dialog";
import { isSuspendedForViewer } from "../utils";
import { useDismissibleNotice } from "~/hooks/use-dismissible-notice";
import { useRestorationNotice } from "~/hooks/use-restoration-notice";

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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ForumDetailPage() {
  const { question, bestAnswer, answers, userId, reportReasons } =
    useLoaderData<typeof loader>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Only the author is served a suspended question, and only they see why.
  const isSuspended = isSuspendedForViewer(question, userId);
  // Keyed on the suspension, not the question: a re-suspension notifies again.
  const suspensionNotice = useDismissibleNotice(
    isSuspended && question
      ? `question:${question.id}:${question.suspendedAt ?? ""}`
      : null,
  );
  // A lifted hold leaves nothing on the payload to detect, so it is inferred
  // from having seen this question suspended earlier on this browser.
  const isAuthor = Boolean(question && userId && question.author.id === userId);
  const restorationNotice = useRestorationNotice(
    isAuthor && question ? question.id : null,
    isSuspended,
  );

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

      <SuspensionNoticeDialog
        open={restorationNotice.isOpen}
        onOpenChange={(open) => !open && restorationNotice.dismiss()}
        variant="restored"
        noun="question"
      />

      {isSuspended && (
        <>
          <SuspensionNoticeDialog
            open={suspensionNotice.isOpen}
            onOpenChange={(open) => !open && suspensionNotice.dismiss()}
            noun="question"
            reason={question.suspensionReason}
            suspendedAt={question.suspendedAt}
          />

          {/* The dialog auto-opens once; this keeps the reason reachable after. */}
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <EyeOff className="h-4 w-4 shrink-0 text-orange-600" />
            <p className="min-w-0 flex-1 text-sm font-medium text-orange-800">
              This question is on moderation hold — only you can see it.
            </p>
            <button
              type="button"
              onClick={suspensionNotice.reopen}
              className="shrink-0 cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-orange-700 ring-1 ring-orange-200 transition-colors hover:bg-orange-100"
            >
              See reason
            </button>
          </div>
        </>
      )}

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
                      className="aspect-video w-full rounded-xl object-cover"
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
                <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-4.5 font-medium text-[#8a93a3] sm:text-sm sm:leading-5.25">
                  {question.tags.map((tag) => (
                    <span key={tag.id}>#{tag.name}</span>
                  ))}
                </div>
              )}

              <div className="mt-5 border-t border-[#abadaf1a] pt-5 sm:mt-6 sm:pt-6">
                <div className="flex flex-wrap items-center gap-3 text-[#48566a] sm:gap-5">
                  <QuestionVoteComponent question={question} />

                  <div className="inline-flex items-center gap-2 text-xs leading-4.5 font-medium sm:text-sm sm:leading-5.25">
                    <MessageCircle className="h-5 w-5" />
                    <span>{question.answerCount} answers</span>
                  </div>

                  <ShareQuestionDialog
                    question={question}
                    className="inline-flex cursor-pointer items-center gap-2 text-xs leading-4.5 font-medium hover:text-[#245fca] sm:text-sm sm:leading-5.25"
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
