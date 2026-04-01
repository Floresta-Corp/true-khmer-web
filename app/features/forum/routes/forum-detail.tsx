import { Link, useLoaderData } from "react-router";
import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import AddAnswerDialog from "../components/AddAnswerDialog";
import BackToForum from "../components/BackToForum";
import ForumPostActions from "../components/ForumPostActions";
import VoteComponent from "../components/VoteComponent";
import TopAnswer from "../components/sections/TopAnswer";
import AllAnswers from "../components/sections/AllAnswers";
import type { AnswerData } from "../components/AnswerCard";
import { Badge } from "~/components/ui/badge";
import type { Route } from ".react-router/types/app/+types/root";
import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { GetQuestionResponse } from "~/services/forum/types";

// ─── Loader ─────────────────────────────────────────────────────────────────
export async function loader({ request, params }: Route.LoaderArgs) {
  const questionId = params.questionId;

  if (!questionId) {
    throw new Error("No question ID provided");
  }

  const question = await apiRequestWithSession<GetQuestionResponse>(
    request,
    `/forum/questions/${questionId}`,
    { method: "GET" },
  );

  return { question: question.data.question };
}

export function meta({ data }: Route.MetaArgs) {
  const title = (data as any)?.data?.question?.title ?? "Forum Discussion";
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
  const { question } = useLoaderData<typeof loader>();

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

  const postedAt = new Date(question.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
                {question.status && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold bg-[#f0f6ff] text-[#2f6fe4]"
                  >
                    {question.status}
                  </Badge>
                )}
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
                {question.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md border border-[#f1f5f9] bg-[#f8fafc] px-2 py-0.5 text-xs text-[#99a1af]"
                  >
                    #{tag}
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
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(question.author.name)}`}
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
                <VoteComponent
                  score={0}
                  onUpVote={() => {
                    console.log("Up vote clicked", question.id);
                  }}
                  onDownVote={() => {
                    console.log("Down vote clicked", question.id);
                  }}
                />
              </div>

              <AddAnswerDialog />
            </div>
          </motion.article>

          {/* Top answer — fake data for development */}
          {(() => {
            const topAnswer: AnswerData = {
              id: "top-answer-1",
              body: 'The best approach here is to use the Khmer Unicode standard encoding (U+1780–U+17FF). Make sure your font stack includes Noto Sans Khmer or Khmer OS as a fallback, and set the lang attribute to "km" on the root element so the browser applies the correct shaping engine. This alone resolves most rendering inconsistencies across platforms.',
              votes: 42,
              postedAt: "Mar 15, 2025",
              author: {
                name: "Dara Sok",
                role: "Senior Developer",
                avatarUrl: undefined,
              },
            };
            return <TopAnswer answer={topAnswer} />;
          })()}

          {/* All answers — fake data for development */}
          {(() => {
            const answers: AnswerData[] = [
              {
                id: "answer-2",
                body: "You can also leverage the react-intl library with the Khmer locale (km-KH) for number and date formatting. Pair it with a custom collator (Intl.Collator('km')) for sorting strings correctly — the default JS sort order does not respect Khmer script ordering.",
                votes: 18,
                postedAt: "Mar 16, 2025",
                author: {
                  name: "Chenda Pich",
                  role: "Frontend Engineer",
                  avatarUrl: undefined,
                },
              },
              {
                id: "answer-3",
                body: "If you are working with PDF generation, make sure the Khmer font is embedded in the PDF output. Libraries like pdfmake or react-pdf let you pass a custom font file — grab Koh Santepheap from Google Fonts and register it as the default font family for Khmer text blocks.",
                votes: 9,
                postedAt: "Mar 17, 2025",
                author: {
                  name: "Virak Meas",
                  role: undefined,
                  avatarUrl: undefined,
                },
              },
              {
                id: "answer-4",
                body: "One gotcha people miss: always normalise Khmer strings to NFC (Unicode canonical composition) before comparing or storing them. JavaScript gives you String.prototype.normalize('NFC') for this. Failing to do so causes duplicate entries in databases when users type the same word through different IME key sequences.",
                votes: 5,
                postedAt: "Mar 18, 2025",
                author: {
                  name: "Sopheap Rith",
                  role: "Full-stack Developer",
                  avatarUrl: undefined,
                },
              },
            ];
            return <AllAnswers answers={answers} />;
          })()}
        </section>
      </main>
    </div>
  );
}
