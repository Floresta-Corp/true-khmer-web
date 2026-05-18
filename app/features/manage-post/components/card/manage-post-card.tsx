import { Link, useNavigate } from "react-router";
import { HandHeart, MoreHorizontal, Rocket } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";
import type {
  ManagePost,
  ManagePostStatus,
  PostingFilter,
  SourceType,
} from "~/services/manage-post/types";

const STATUS_STYLES: Record<ManagePostStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
  FILLED: "bg-blue-100 text-blue-700 border-blue-200",
  ENDED: "bg-gray-100 text-gray-600 border-gray-200",
};

const TYPE_STYLES: Record<SourceType, string> = {
  PROJECT: "bg-purple-100 text-purple-700 border-purple-200",
  VOLUNTEER: "bg-pink-100 text-pink-700 border-pink-200",
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
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors z-10"
        >
          <MoreHorizontal size={20} />
        </button>

        <div className="flex gap-2 flex-wrap mb-1">
          <Badge
            className={cn(
              "px-2.5 py-0.5 text-[10px] font-black border-none rounded-full uppercase tracking-widest shadow-sm",
              STATUS_STYLES[posting.status],
            )}
          >
            {posting.status}
          </Badge>
          <Badge
            className={cn(
              "px-2.5 py-0.5 text-[10px] font-bold border-none rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
              TYPE_STYLES[posting.sourceType],
            )}
          >
            {posting.sourceType === "PROJECT" ? (
              <Rocket size={12} />
            ) : (
              <HandHeart size={12} />
            )}
            {posting.sourceType}
          </Badge>
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

        {/* stopPropagation so buttons don't double-navigate */}
        <div className="mt-6" onClick={(e) => e.stopPropagation()}>
          {posting.status === "FILLED" || posting.status === "ENDED" ? (
            <Button
              variant="outline"
              className="w-full h-10 sm:h-12 text-sm font-bold text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
              asChild
            >
              <Link to={`/manage-post/${posting.id}/report`}>View Report</Link>
            </Button>
          ) : (
            <Button
              variant="default"
              asChild
              className="w-full h-10 sm:h-12 text-sm font-bold bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-transparent rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <Link to={cardHref}>Manage Posting</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
