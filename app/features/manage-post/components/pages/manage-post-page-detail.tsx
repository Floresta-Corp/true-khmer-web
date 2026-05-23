import { Link, useLoaderData, useParams } from "react-router";
import {
  Briefcase,
  CalendarRange,
  HandHeart,
  MoreHorizontal,
  Pencil,
  Share2,
} from "lucide-react";
import type { loader } from "../../routes/manage-post.$sourceType.$id";
import ManagePostingDetailStats from "../section/posting-detail-stats";
import ManagePostingDetailTable from "../section/posting-detail-table";
import { formatDate } from "~/features/events/lib/event-formatters";
import type {
  ManagePostStatus,
  PostingType,
} from "~/services/manage-post/types";
import { cn } from "~/lib/utils";
import BackToButton from "~/components/back-to-button";

const STATUS_STYLES: Record<ManagePostStatus, string> = {
  LIVE: "bg-blue-100 text-blue-700 border-blue-200",
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELED: "bg-red-100 text-red-700 border-red-200",
  FILLED: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function ManagePostingDetailPage() {
  const { postDetail } = useLoaderData<typeof loader>();
  const { sourceType, id } = useParams();
  const sourceTypeRoute = sourceType === "projects" ? "launchpad" : "volunteer";
  console.log(id);
  const editRoute = `/${sourceTypeRoute}/edit/${id}`;
  return (
    <div className="max-w-7xl w-full mx-auto max-h-dvh">
      <div className="p-4 sm:p-8 md:p-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <BackToButton to="/manage-post" />
        </div>

        {/* Header Layout: Stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Metadata & Title */}
          <div className="flex flex-col gap-3 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  postDetail?.posting?.sourceType === "projects"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                {postDetail?.posting?.sourceType === "projects" ? (
                  <Briefcase size={18} />
                ) : (
                  <HandHeart size={18} />
                )}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {postDetail?.posting?.sourceType === "projects"
                  ? "Project"
                  : "Volunteer"}
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
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CalendarRange size={13} />
              <span>
                Posted {formatDate(postDetail?.posting?.createdAt ?? "-")}
              </span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to={editRoute}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto whitespace-nowrap"
            >
              <Pencil size={18} />
              Edit Posting
            </Link>
            <div>
              <button className="p-3 border border-gray-200 dark:border-slate-800 rounded-xl text-gray-400 hover:text-brand-blue hover:text-blue-600 hover:border-blue-600 transition-all flex items-center justify-center">
                <Share2 size={20} />
              </button>
            </div>

            <button className="p-3 border border-gray-200 hover:border-blue-600 rounded-xl transition-all flex items-center justify-center text-gray-400 hover:text-blue-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="mt-10">
          <ManagePostingDetailStats />
        </div>

        {/* Note: Ensure this table container handles internal scrolling if it's wide */}
        <div className="mt-6 overflow-x-auto">
          <ManagePostingDetailTable
            applicants={postDetail?.applicants ?? []}
            postingId={postDetail?.posting?.id ?? ""}
            sourceType={(postDetail?.posting?.sourceType ?? "") as PostingType}
          />
        </div>
      </div>
    </div>
  );
}
