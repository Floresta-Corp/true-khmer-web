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
import type { PostingType } from "~/services/manage-post/types";

export default function PostingDetailPage() {
  const { postDetail, pagination, userId } = useLoaderData<typeof loader>();

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
            <Badge className="bg-green-100 text-green-700 border-green-200 capitalize text-xs font-medium ml-1">
              {postDetail?.posting.status}
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
