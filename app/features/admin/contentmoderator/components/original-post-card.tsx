import { ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatDateTime } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import { getInitials } from "~/routes/onboarding/domain/profile/profile-utils";
import type { ContentModeratorReport } from "~/types/api-client";

interface OriginalPostCardProps {
  report: ContentModeratorReport;
  contentLabel: string;
  onPreview: () => void;
}

export function OriginalPostCard({
  report,
  contentLabel,
  onPreview,
}: OriginalPostCardProps) {
  const authorName = report.postedBy?.name ?? "Unknown";
  const canPreview =
    report.sourceLink && report.confirmStatus !== "CONTENT HIDDEN";

  return (
    <div className="space-y-2.5">
      <h3 className="text-lg font-semibold tracking-tight text-(--admin-text)">
        Original {contentLabel.toLowerCase()}
      </h3>

      <div className="rounded-2xl border border-(--admin-border) p-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage
              src={resolveImageURL(report.postedBy?.avatarKey)}
              alt={authorName}
            />
            <AvatarFallback className="bg-indigo-600 text-xs font-bold text-white">
              {getInitials(authorName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-(--admin-text)">
              {authorName}
            </p>
            <p className="text-xs font-medium text-(--admin-text-secondary)">
              {formatDateTime(report.dateTime)}
            </p>
          </div>
        </div>

        <p className="mt-2.5 text-[15px] leading-relaxed text-(--admin-text)">
          &ldquo;{report.contentPreview}&rdquo;
        </p>

        {canPreview ? (
          <div className="mt-2.5 flex items-center justify-end">
            <button
              onClick={onPreview}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              <ExternalLink size={15} className="shrink-0" />
              View on platform
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
