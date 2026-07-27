import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { formatDateTime } from "~/lib/time";
import { getInitials } from "~/routes/onboarding/domain/profile/profile-utils";
import type { ContentModeratorReport } from "~/types/api-client";

export function ResolutionLog({ report }: { report: ContentModeratorReport }) {
  const fullName =
    `${report.solvedBy?.firstName ?? ""} ${report.solvedBy?.lastName ?? ""}`.trim();
  const solvedAt = formatDateTime(report.solvedAt);

  const isHidden = report.confirmStatus === "CONTENT HIDDEN";
  const actionTaken = isHidden ? "Content removed" : "Report dismissed";

  return (
    <div
      className={`space-y-3.5 rounded-2xl border p-6 ${
        isHidden
          ? "border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20"
          : "border-(--admin-border) bg-(--admin-card-bg)"
      }`}
    >
      <h3
        className={`text-lg font-semibold tracking-tight ${
          isHidden ? "text-rose-600 dark:text-rose-400" : "text-(--admin-text)"
        }`}
      >
        Action details
      </h3>

      <div className="space-y-3">
        <Row label="Action taken">
          <span className="font-medium text-(--admin-text)">{actionTaken}</span>
        </Row>

        <Row label="Reason selected">
          <span className="text-(--admin-text)">{report.type.name}</span>
        </Row>

        <Row label="Notes (optional)">
          <span className="text-(--admin-text-secondary)">
            {report.note?.trim() || "-"}
          </span>
        </Row>

        <Row label="Action taken by">
          <span className="inline-flex items-center gap-2">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-indigo-600 text-[10px] font-bold text-white">
                {getInitials(fullName) || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-(--admin-text)">
              {fullName || "Unknown Moderator"}
            </span>
          </span>
        </Row>

        <Row label="Date & time">
          <span className="text-(--admin-text)">{solvedAt || "—"}</span>
        </Row>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[14px] font-medium text-(--admin-text-secondary)">
        {label}
      </span>
      <span className="text-right text-[14px]">{children}</span>
    </div>
  );
}
