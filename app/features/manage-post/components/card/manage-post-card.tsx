import { Link } from "react-router";
import { HandHeart, MoreHorizontal, Rocket } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";
import type {
  ManagePost,
  SourceType,
  Status,
} from "~/services/manage-post/types";

const STATUS_STYLES: Record<Status, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
  FILLED: "bg-blue-100 text-blue-700 border-blue-200",
  ENDED: "bg-gray-100 text-gray-600 border-gray-200",
};

const TYPE_STYLES: Record<SourceType, string> = {
  PROJECT: "bg-purple-100 text-purple-700 border-purple-200",
  VOLUNTEER: "bg-pink-100 text-pink-700 border-pink-200",
};
type Props = {
  posting: ManagePost;
  index: number;
};

export default function ManagePostCard({ posting, index = 0 }: Props) {
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
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5 lg:gap-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 relative group">
        {/* More Options Button */}
        <button className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <MoreHorizontal size={16} className="sm:hidden" />
          <MoreHorizontal size={18} className="hidden sm:block" />
        </button>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge
            className={cn(
              "px-2 sm:px-2.5 py-0.5 text-[10px] font-bold border-none rounded-full uppercase tracking-wider hover:bg-gray-50",
              STATUS_STYLES[posting.status],
            )}
          >
            {posting.status}
          </Badge>
          <Badge
            className={cn(
              "px-2 sm:p-1.5 py-0.5 text-[10px] font-semibold border-none rounded-full uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 hover:bg-gray-50",
              TYPE_STYLES[posting.sourceType],
            )}
          >
            {posting.sourceType === "PROJECT" ? (
              <Rocket size={11} className="opacity-80" />
            ) : (
              <HandHeart size={11} className="opacity-80" />
            )}
            {posting.sourceType}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-1.5 sm:space-y-2 pr-6 sm:pr-8">
          <Link to={`/manage-post/${posting.id}`}>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-tight hover:text-blue-600 transition-colors">
              {posting.title}
            </h3>
          </Link>
          <p className="text-[13px] sm:text-[14px] text-slate-500 line-clamp-2 leading-relaxed">
            {posting.description ?? "No description provided."}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 sm:gap-12 border-t border-slate-100 pt-4 sm:pt-5">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Applicants
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
              {posting.applicantCount}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Views
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
              {posting.views.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Capacity
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
              {posting.capacity}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {posting.status === "FILLED" || posting.status === "ENDED" ? (
            <Button
              variant="outline"
              className="w-full h-9 sm:h-11 text-[13px] sm:text-[14px] font-bold text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg sm:rounded-xl"
              asChild
            >
              <Link to={`/manage-post/${posting.id}/report`}>View Report</Link>
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full h-9 sm:h-11 text-[13px] sm:text-[14px] font-bold text-blue-500 bg-blue-50/50 hover:bg-blue-100/70 border-none rounded-lg sm:rounded-xl transition-colors"
              asChild
            >
              <Link to={`/manage-post/${posting.id}`}>Manage Posting</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
