import { Link, useLoaderData } from "react-router";
import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import AddAnswerDialog from "../components/dialog/AddAnswerDialog";
import BackToForum from "../components/BackToForum";
import ForumPostActions from "../components/ForumPostActions";
import QuestionVoteComponent from "../components/QuestionVoteComponent";
import AllAnswers from "../components/sections/AllAnswers";
import type { Route } from "./+types/forum-detail";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import { forumDetailLoader } from "~/routes/api/forum/forumLoader";
import { forumDetailAction } from "~/routes/api/forum/forumAction";

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
  const { question, answers, userId } = useLoaderData<typeof loader>();

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
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20">
        <section className="mx-auto w-full max-w-3xl">
          {/* Back nav + actions */}
          <motion.div
            className="mb-5 flex items-center justify-between"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <BackToForum />
            <ForumPostActions />
          </motion.div>

          {/* Main question card */}
          <motion.article
            className="rounded-2xl border border-[#f1f5f9] bg-white p-4 sm:p-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {/* Category + date */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold leading-4.5 text-[#2f6fe4]">
                  {question.category.name}
                </p>
              </div>
              <p className="inline-flex items-center gap-1 text-xs font-medium text-[#9eacc0]">
                <Clock3 className="h-3.5 w-3.5" />
                {postedAt}
              </p>
            </div>

            {/* Title + body */}
            <h1 className="mt-4 text-base sm:text-lg font-semibold leading-snug text-[#030213]">
              {question.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#65758b]">
              {question.body}
            </p>

            {/* Tags */}
            {question.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {question.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-md border border-[#f1f5f9] bg-[#f8fafc] px-2 py-0.5 text-xs text-[#99a1af]"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Author + vote + answer */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#f9fafb] pt-4">
              <div className="flex items-center gap-3">
                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={authorProfile}
                    alt={question.author.name}
                    className="h-8 w-8 rounded-full border border-[#f3f4f6] object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-4 text-[#344256]">
                      {question.author.name}
                    </p>
                    {/* <p className="text-xs font-medium leading-4 text-[#9eacc0]">
                      { {question.author.role ?? "Community Member"}}
                      {"Community Member"}
                    </p> */}
                  </div>
                </div>

                {/* Vote counter */}
                <QuestionVoteComponent
                  questionId={question.id}
                  score={question.score}
                  viewerVote={question.viewerVote}
                />
              </div>

              <AddAnswerDialog
                questionId={question.id}
                isAuthenticated={Boolean(userId)}
              />
            </div>
          </motion.article>

          {answers && answers.length > 0 ? (
            <AllAnswers answers={answers}  />
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
