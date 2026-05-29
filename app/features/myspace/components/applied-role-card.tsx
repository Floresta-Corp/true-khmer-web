import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { ApplicationDetailRole } from "~/services/myspace/types";

interface AppliedRoleCardProps {
  roles: ApplicationDetailRole[];
  selectedApplicationId?: string;
  onSelectRole: (applicationId: string) => void;
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCompactStatus(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return {
        label: "Action Required",
        className:
          "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/40",
      };
    case "CONFIRMED":
      return {
        label: "Active",
        className: "border-green-100 bg-green-50 text-green-600 hover:bg-green-50",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        className: "border-green-100 bg-green-50 text-green-600 hover:bg-green-50",
      };
    case "WITHDRAWN":
      return {
        label: "Withdrawn",
        className: "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-50",
      };
    case "DECLINED":
      return {
        label: "Declined",
        className: "border-red-100 bg-red-50 text-red-600 hover:bg-red-50",
      };
    default:
      return {
        label: "Submitted",
        className:
          "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-50 dark:bg-blue-900/20 dark:hover:bg-blue-900/20",
      };
  }
}

export function AppliedRoleCard({
  roles,
  selectedApplicationId,
  onSelectRole,
}: AppliedRoleCardProps) {
  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Applied Roles
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Select a role to view status and details.
          </p>
        </div>

        <div className="space-y-3">
          {roles.map((role) => {
            const isSelected = role.applicationId === selectedApplicationId;
            const needsAction = role.status.toUpperCase() === "APPROVED";
            const isDeclined = role.status === "DECLINED";
            const statusStyle = getCompactStatus(role.status);

            return (
              <button
                key={role.applicationId}
                type="button"
                onClick={() => onSelectRole(role.applicationId)}
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all",
                  isSelected
                    ? needsAction
                      ? "border-amber-500 bg-amber-50/30 ring-1 ring-amber-500/30 dark:border-amber-800 dark:bg-amber-950/10"
                      : isDeclined
                        ? "border-blue-500 bg-white ring-1 ring-blue-500/20 dark:border-blue-800 dark:bg-slate-900"
                      : "border-blue-500 bg-blue-50/10 ring-1 ring-blue-500/20 dark:border-blue-800 dark:bg-blue-950/10"
                    : needsAction
                      ? "border-amber-200 bg-amber-50/10 hover:border-amber-300 dark:border-amber-900/50 dark:bg-amber-950/5"
                      : isDeclined
                        ? "border-red-100 bg-white hover:border-red-200 hover:bg-red-50/20 dark:border-red-950/40 dark:bg-slate-900 dark:hover:bg-red-950/10"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/40",
                )}
              >
                {isSelected || isDeclined ? (
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 top-0 w-1.5",
                      needsAction
                        ? "bg-amber-500"
                        : isDeclined
                          ? "bg-red-500"
                          : "bg-blue-600",
                    )}
                  />
                ) : null}
                {isDeclined ? (
                  <span className="absolute right-3 top-3 size-2 rounded-full bg-red-500" />
                ) : null}
                {needsAction ? (
                  <span className="absolute right-3 top-3 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                  </span>
                ) : null}

                <h4
                  className={cn(
                    "truncate pr-4 text-sm font-extrabold",
                    isSelected
                      ? needsAction
                        ? "text-amber-700 dark:text-amber-400"
                        : isDeclined
                          ? "text-slate-900 dark:text-slate-100"
                        : "text-blue-600 dark:text-blue-400"
                      : "text-slate-800 dark:text-slate-200",
                  )}
                >
                  {role.title}
                </h4>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Applied {formatDate(role.appliedAt)}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[9px] font-black shadow-none",
                      statusStyle.className,
                    )}
                  >
                    {statusStyle.label}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
