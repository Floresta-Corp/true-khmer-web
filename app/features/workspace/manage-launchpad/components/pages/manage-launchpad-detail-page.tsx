import { Link, useLoaderData, useParams } from "react-router";
import { Briefcase, CalendarRange, EyeOff, Pencil, Share2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ManagePostDetailLoaderData } from "../../services/manage-launchpad-detail.loader";
import ManagePostingDetailStats from "../section/posting-detail-stats";
import ManagePostingDetailTable from "../section/posting-detail-table";
import { formatDate } from "~/features/events/lib/event-formatters";
import type { ManagePostStatus } from "~/features/workspace/manage-launchpad/types";
import { cn } from "~/lib/utils";
import BackToButton from "~/components/back-to-button";
import SuspensionNoticeDialog from "~/components/suspension-notice-dialog";
import { useDismissibleNotice } from "~/hooks/use-dismissible-notice";
import ManagePostOption from "../dropdown/manage-launchpad-option";

const STATUS_STYLES: Record<ManagePostStatus, string> = {
  LIVE: "bg-blue-100 text-blue-700 border-blue-200",
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 border-indigo-200",
  CANCELED: "bg-red-100 text-red-700 border-red-200",
  FILLED: "bg-blue-100 text-blue-700 border-blue-200",
  SUSPENDED: "bg-orange-100 text-orange-700 border-orange-200",
};

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function ManagePostingDetailPage() {
  const { postDetail, suspension } =
    useLoaderData<ManagePostDetailLoaderData>();
  const { id } = useParams();
  const prefersReducedMotion = useReducedMotion();

  const isSuspended = postDetail?.posting?.status === "SUSPENDED";
  const postingNoun = "project";

  const suspensionNotice = useDismissibleNotice(
    isSuspended && postDetail?.posting
      ? `posting:${postDetail.posting.id}:${suspension?.suspendedAt ?? ""}`
      : null,
  );
  const editRoute = `/launchpad/edit/${id}`;

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
      className="mx-auto w-full max-w-7xl"
    >
      <div className="p-4 pb-24 sm:p-8 md:p-10">
        <motion.div className="mb-6" {...fadeUp(0.05)}>
          <BackToButton to="/workspace/launchpad" />
        </motion.div>

        {isSuspended && (
          <>
            <SuspensionNoticeDialog
              open={suspensionNotice.isOpen}
              onOpenChange={(open) => !open && suspensionNotice.dismiss()}
              noun={postingNoun}
              reason={suspension?.suspensionReason}
              suspendedAt={suspension?.suspendedAt}
            />

            <motion.div
              {...fadeUp(0.1)}
              className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3"
            >
              <EyeOff className="h-4 w-4 shrink-0 text-orange-600" />
              <p className="min-w-0 flex-1 text-sm font-medium text-orange-800">
                This {postingNoun} is on moderation hold — only you can see it,
                and nobody can apply while it is held.
              </p>
              <button
                type="button"
                onClick={suspensionNotice.reopen}
                className="shrink-0 cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-orange-700 ring-1 ring-orange-200 transition-colors hover:bg-orange-100"
              >
                See reason
              </button>
            </motion.div>
          </>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <motion.div
            {...fadeUp(0.15)}
            className="flex w-full min-w-0 flex-col gap-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Briefcase size={18} />
              </div>
              <span className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                Project
              </span>
              <div className="h-4 w-px bg-gray-200" />
              <span
                className={cn(
                  "pointer-events-none rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase",
                  STATUS_STYLES[
                    (postDetail?.posting?.status?.toUpperCase() ??
                      "DRAFT") as ManagePostStatus
                  ],
                )}
              >
                {postDetail?.posting?.status}
              </span>
            </div>

            <h1 className="text-2xl leading-tight font-bold wrap-break-word text-gray-900 sm:text-3xl">
              {postDetail?.posting?.title}
            </h1>

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

          <motion.div
            {...fadeUp(0.2)}
            className="flex w-full shrink-0 items-center gap-3 sm:w-auto md:self-start"
          >
            <Link
              to={editRoute}
              className="shadow-brand-blue/20 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold whitespace-nowrap text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              <Pencil size={18} />
              Edit Posting
            </Link>

            <div className="relative h-11 w-11 shrink-0">
              {postDetail?.posting ? (
                <ManagePostOption
                  status={postDetail.posting.status as ManagePostStatus}
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

        <motion.div {...fadeUp(0.4)} className="mt-6 overflow-x-auto">
          <ManagePostingDetailTable
            applicants={postDetail?.applicants ?? []}
            postingId={postDetail?.posting?.id ?? ""}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
