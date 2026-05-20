import { Link, useNavigate } from "react-router";
import { Briefcase, HandHeart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";
import type {
  ManagePost,
  ManagePostStatus,
  SourceType,
} from "~/services/manage-post/types";
import ManagePostOption from "../dropdown/manage-post-option";

const STATUS_STYLES: Record<ManagePostStatus, string> = {
  LIVE: "bg-green-100 text-green-700 border-green-200",
  DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
  // CLOSED: "bg-gray-100 text-gray-600 border-gray-200",
};

const TYPE_STYLES: Record<SourceType, string> = {
  PROJECT: "bg-blue-100 text-blue-700 border-blue-200",
  VOLUNTEER: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const SOURCE_TYPE_TO_PATH: Record<SourceType, string> = {
  PROJECT: "projects",
  VOLUNTEER: "volunteer",
};

function normalizePostingSource(sourceType: SourceType): string {
  return SOURCE_TYPE_TO_PATH[sourceType];
}

type Props = {
  posting: ManagePost;
  index: number;
};

export default function ManagePostCard({ posting, index = 0 }: Props) {
  const navigate = useNavigate();
  const cardHref = `/manage-post/${normalizePostingSource(posting.sourceType)}/${posting.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05,
      }}
      className="h-full"
    >
      <div
        onClick={() => navigate(cardHref)}
        className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 relative group cursor-pointer"
      >
        <ManagePostOption />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                posting.sourceType === "PROJECT"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                  : "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
              }`}
            >
              {posting.sourceType === "PROJECT" ? (
                <Briefcase size={18} />
              ) : (
                <HandHeart size={18} />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {posting.sourceType === "PROJECT" ? "Project" : "Volunteer"}
            </span>
          </div>
          <div className="w-px h-3 bg-gray-200 dark:bg-slate-800 mx-0.5" />
          <span
            className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all pointer-events-none",
              STATUS_STYLES[posting.status],
            )}
          >
            {posting.status}
          </span>
        </div>

        <div className="grow space-y-2 mt-2 pr-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1 sm:line-clamp-2">
            {posting.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed italic sm:not-italic">
            {posting.description ?? "No description provided."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-100 pt-5 mt-5">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter sm:tracking-widest">
              Applicants
            </span>
            <span className="text-lg sm:text-2xl font-semibold text-slate-900 leading-none mt-1">
              {posting.applicantCount}
            </span>
          </div>

          <div className="flex flex-col border-x border-slate-50 px-2 sm:px-0">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter sm:tracking-widest">
              Views
            </span>
            <span className="text-lg sm:text-2xl font-semibold text-slate-900 leading-none mt-1">
              {posting.views > 999
                ? `${(posting.views / 1000).toFixed(1)}k`
                : posting.views}
            </span>
          </div>
        </div>

        <div className="mt-6" onClick={(e) => e.stopPropagation()}>
          {posting.status === "COMPLETED" ? (
            <Button
              variant="outline"
              className="w-full h-10 sm:h-12 text-sm font-bold text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
              asChild
            >
              <Link to={`/manage-post/${posting.id}/report`}>View Report</Link>
            </Button>
          ) : (
            <Link to={cardHref}>
              <Button
                variant="ghost"
                className="w-full cursor-pointer h-10 sm:h-12 text-sm font-bold bg-gray-50 text-gray-500 rounded-xl transition-all hover:bg-blue-600 hover:text-white duration-200 active:scale-[0.98]"
              >
                Manage Posting
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
