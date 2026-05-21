import { useLoaderData } from "react-router";
import {
  Briefcase,
  CalendarRange,
  Clock,
  HandHeart,
  MoreHorizontal,
  Pencil,
  Share2,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import type { loader } from "../../routes/manage-post.$sourceType.$id";
import ManagePostingDetailStats from "../section/posting-detail-stats";
import ManagePostingDetailTable from "../section/posting-detail-table";
import { formatDate } from "~/features/events/lib/event-formatters";
import type {
  ManagePostStatus,
  PostingType,
} from "~/services/manage-post/types";
import { cn } from "~/lib/utils";

const STATUS_STYLES: Record<ManagePostStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  DRAFT: "bg-amber-100 text-amber-700 border-amber-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  PUBLISHED: "bg-amber-100 text-amber-700 border-amber-200",
  CLOSED: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function ManagePostingDetailPage() {
  const { postDetail } = useLoaderData<typeof loader>();
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/manage-post">
                Manage Posting
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{postDetail?.posting?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-3">
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

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 leading-tight truncate">
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
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto whitespace-nowrap">
            <Pencil size={18} />
            Edit Posting
          </button>
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

      <ManagePostingDetailTable
        applicants={postDetail?.applicants ?? []}
        postingId={postDetail?.posting?.id ?? ""}
        sourceType={(postDetail?.posting?.sourceType ?? "") as PostingType}
      />
    </div>
  );
}
