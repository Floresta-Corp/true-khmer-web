import { Link, useLoaderData, useNavigate } from "react-router";
import {
  Briefcase,
  ClipboardList,
  HandHeart,
  Target,
  UsersRound,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn, resolveImageURL } from "~/lib/utils";
import { motion } from "motion/react";
import type {
  ManagePost,
  ManagePostStatus,
  SourceType,
} from "~/features/manage-post/types";
import ManagePostOption from "../dropdown/manage-post-option";

const STATUS_STYLES: Record<ManagePostStatus, string> = {
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  LIVE: "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 border-indigo-200",
  CANCELED: "bg-red-100 text-red-700 border-red-200",
  FILLED: "bg-blue-100 text-blue-700 border-blue-200",
};

const normalizeStatus = (status: ManagePostStatus): string => {
  const statusMap: Record<ManagePostStatus, string> = {
    DRAFT: "draft",
    COMPLETED: "completed",
    LIVE: "live",
    IN_PROGRESS: "in progress",
    CANCELED: "canceled",
    FILLED: "filled",
  };

  return statusMap[status] ?? status.toLowerCase().replace("_", " ");
};

const ACTION_LABELS: Record<SourceType, string> = {
  PROJECT: "Manage Recruitment",
  VOLUNTEER: "Review Volunteers",
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
  const imageUrl = resolveImageURL(posting.imageKey ?? undefined);
  const isCompleted = posting.status === "COMPLETED";

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
        className="group relative flex h-full cursor-pointer flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-200/60"
      >
        {!isCompleted && (
          <div className="absolute right-5  z-10">
            <ManagePostOption
              title={posting.title}
              status={posting.status}
              sourceType={posting.sourceType}
              postingId={posting.id}
              currentDeadline={posting.deadline}
            />
          </div>
        )}

        <div className="flex items-center gap-3 p-1">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-9 items-center justify-center rounded-xl border ${
                posting.sourceType === "PROJECT"
                  ? "border-blue-100 bg-blue-50 text-blue-600"
                  : "border-blue-100 bg-blue-50 text-blue-600"
              }`}
            >
              {posting.sourceType === "PROJECT" ? (
                <Briefcase size={18} />
              ) : (
                <HandHeart size={18} />
              )}
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              {posting.sourceType === "PROJECT" ? "Project" : "Volunteer"}
            </span>
          </div>
          <span
            className={cn(
              "ml-auto rounded-full border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all pointer-events-none",
              !isCompleted && "mr-12",
              STATUS_STYLES[posting.status],
            )}
          >
            {normalizeStatus(posting.status).replace(" ", "-")}
          </span>
        </div>

        <div className="mt-5 aspect-[2.55/1] overflow-hidden rounded-2xl bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={posting.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-blue-50 via-slate-100 to-emerald-50 text-blue-500">
              {posting.sourceType === "PROJECT" ? (
                <Briefcase size={34} />
              ) : (
                <HandHeart size={34} />
              )}
            </div>
          )}
        </div>

        <div className="mt-5 min-h-19 grow space-y-2">
          <h3 className="line-clamp-1 text-xl font-bold leading-tight text-black transition-colors group-hover:text-blue-600">
            {posting.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
            {posting.description ?? "No description provided."}
          </p>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <UsersRound className="size-3 " />
                Roles
              </span>
              <span className="mt-1 text-2xl font-semibold leading-none text-black">
                {posting.roleCount}
              </span>
            </div>

            <div className="flex flex-col items-center border-x border-slate-200">
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <UsersRound className="size-3 " />
                Applicants
              </span>
              <span className="mt-1 text-2xl font-semibold leading-none text-black">
                {posting.applicantCount}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                <Target className="size-3 " />
                Progress
              </span>
              <span className="mt-1 text-2xl font-semibold leading-none text-black">
                {posting.confirmedCount}/{posting.capacity}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5" onClick={(e) => e.stopPropagation()}>
          {isCompleted ? (
            <Button
              variant="outline"
              className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold  tracking-wider text-slate-600 transition-all hover:bg-blue-600 hover:text-white active:scale-[0.98]"
              asChild
            >
              <Link to={cardHref}>
                <ClipboardList className="size-4" />
                View Report
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold  tracking-wider text-slate-500 transition-all hover:bg-blue-600 hover:text-white active:scale-[0.98]"
              asChild
            >
              <Link to={cardHref}>{ACTION_LABELS[posting.sourceType]}</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
