import { Link, useLoaderData, useParams } from "react-router";
import {
  Briefcase,
  CalendarRange,
  HandHeart,
  Pencil,
  Share2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { loader } from "../../routes/manage-post.$sourceType.$id";
import ManagePostingDetailStats from "../section/posting-detail-stats";
import ManagePostingDetailTable from "../section/posting-detail-table";
import { formatDate } from "~/features/events/lib/event-formatters";
import type {
  ManagePostStatus,
  PostingType,
  SourceType,
} from "~/services/manage-post/types";
import { cn } from "~/lib/utils";
import BackToButton from "~/components/back-to-button";
import ManagePostOption from "../dropdown/manage-post-option";

const STATUS_STYLES: Record<ManagePostStatus, string> = {
  LIVE: "bg-blue-100 text-blue-700 border-blue-200",
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 border-indigo-200",
  CANCELED: "bg-red-100 text-red-700 border-red-200",
  FILLED: "bg-blue-100 text-blue-700 border-blue-200",
};

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function ManagePostingDetailPage() {
  const { postDetail } = useLoaderData<typeof loader>();
  const { sourceType, id } = useParams();
  const prefersReducedMotion = useReducedMotion();
  const postingSourceType = postDetail?.posting?.sourceType ?? sourceType;
  const isProjectPosting =
    postingSourceType === "PROJECT" || postingSourceType === "projects";
  const managePostSourceType: PostingType = isProjectPosting
    ? "projects"
    : "volunteer";
  const sourceTypeRoute = isProjectPosting ? "launchpad" : "volunteer";
  const editRoute = `/${sourceTypeRoute}/edit/${id}`;

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: prefersReducedMotion ? 0 : 0.45,
      delay: prefersReducedMotion ? 0 : delay,
      ease,
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      className="max-w-7xl w-full mx-auto "
    >
      <div className="p-4 sm:p-8 pb-24 md:p-10">
        <motion.div className="mb-6" {...fadeUp(0.05)}>
          <BackToButton to="/manage-post" />
        </motion.div>

        {/* Header Layout: Stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Metadata & Title */}
          <motion.div
            {...fadeUp(0.15)}
            className="flex flex-col gap-3 min-w-0 w-full"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isProjectPosting
                    ? "bg-blue-50 text-blue-600"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                {isProjectPosting ? (
                  <Briefcase size={18} />
                ) : (
                  <HandHeart size={18} />
                )}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {isProjectPosting ? "Project" : "Volunteer"}
              </span>
              <div className="w-px h-4 bg-gray-200" />
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border pointer-events-none",
                  STATUS_STYLES[
                    (postDetail?.posting?.status?.toUpperCase() ??
                      "DRAFT") as ManagePostStatus
                  ],
                )}
              >
                {postDetail?.posting?.status}
              </span>
            </div>

            {/* Title: Wraps on mobile, truncates cleanly on large displays if needed */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight wrap-break-word">
              {postDetail?.posting?.title}
            </h1>

            {/* Date */}
            <motion.div
              {...fadeUp(0.2)}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <CalendarRange size={13} />
              <span>
                Posted {formatDate(postDetail?.posting?.createdAt ?? "-")}
              </span>
            </motion.div>
          </motion.div>

          {/* Right: actions */}
          <motion.div
            {...fadeUp(0.2)}
            className="flex items-center gap-3 w-full sm:w-auto shrink-0 md:self-start"
          >
            {/* Edit Button */}
            <Link
              to={editRoute}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto whitespace-nowrap h-11"
            >
              <Pencil size={18} />
              Edit Posting
            </Link>

            {/* Share Button */}
            {/* <button className="h-11 w-11 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all flex items-center justify-center shrink-0 bg-white dark:bg-slate-900">
              <Share2 size={20} />
            </button> */}

            <div className="shrink-0 h-11 w-11 relative">
              {postDetail?.posting ? (
                <ManagePostOption
                  status={postDetail.posting.status as ManagePostStatus}
                  sourceType={postDetail.posting.sourceType as SourceType}
                  postingId={postDetail.posting.id ?? ""}
                  currentDeadline={postDetail.posting.deadline}
                  title={postDetail.posting.title ?? "Untitled Post"}
                />
              ) : (
                <p>Loading options...</p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.3)} className="mt-10">
          <ManagePostingDetailStats />
        </motion.div>

        {/* Note: Ensure this table container handles internal scrolling if it's wide */}
        <motion.div {...fadeUp(0.4)} className="mt-6 overflow-x-auto">
          <ManagePostingDetailTable
            applicants={postDetail?.applicants ?? []}
            postingId={postDetail?.posting?.id ?? ""}
            sourceType={managePostSourceType}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
