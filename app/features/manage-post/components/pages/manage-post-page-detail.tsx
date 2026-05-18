import { useLoaderData } from "react-router";
import { Clock, Pencil, Share2 } from "lucide-react";
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
  ACTIVE: "bg-green-100 text-green-700 border-green-200 hover:bg-gray-100",
  DRAFT: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-gray-100",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-gray-100",
  PUBLISHED: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-gray-100",
  CLOSED: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100",
};

export default function PostingDetailPage() {
  const { postDetail } = useLoaderData<typeof loader>();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mb-3">
        {/* Breadcrumb */}
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1.5">
            {postDetail?.posting?.title}
          </h1>
          <div className="flex items-center gap-2 mt-2.5">
            <Clock size={13} className="text-gray-400" />
            <span className="text-sm text-gray-400">
              Posted {formatDate(postDetail?.posting.createdAt ?? "-")}
            </span>
            <Badge
              className={cn(
                "px-2.5 py-0.5 text-[10px] font-black border-none rounded-full uppercase tracking-widest shadow-sm",

                STATUS_STYLES[
                  (postDetail?.posting?.status?.toUpperCase() ??
                    "DRAFT") as ManagePostStatus
                ],
              )}
            >
              {postDetail?.posting?.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            className="p-4 gap-2 text-[14px] cursor-pointer "
          >
            <Pencil size={14} />
            Edit Posting
          </Button>
          <Button className="p-4 bg-blue-600 hover:bg-blue-700 text-white gap-2 text-[14px] cursor-pointer">
            <Share2 size={14} />
            Share Link
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {/* Stats */}
        <ManagePostingDetailStats />
      </div>

      {/* Table */}
      <ManagePostingDetailTable
        applicants={postDetail?.applicants ?? []}
        postingId={postDetail?.posting.id ?? ""}
        sourceType={(postDetail?.posting.sourceType ?? "") as PostingType}
      />
    </div>
  );
}
