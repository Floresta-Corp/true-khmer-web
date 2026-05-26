import { motion, AnimatePresence } from "motion/react";
import { Link, useFetcher, useLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { loader } from "../../routes/my-applications";
import { MyApplicationActions } from "../my-application-actions";
import { resolveImageURL } from "~/lib/utils";
import type { Application } from "~/services/myspace/myspace-type";
import EmptyApplicationCard from "./empty-application-card";
import ApplicationStatusConfirmDialog from "../application-status-confirm-dialog";

function getSourceTypeStyle(sourceType: string) {
  switch (sourceType.toUpperCase()) {
    case "PROJECT":
      return {
        bg: "bg-[#EFF6FF]",
        border: "border-[#ACC5F4]",
        text: "text-blue-600",
      };
    case "VOLUNTEER":
    default:
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
      };
  }
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
        label: "Confirmed",
      };
    case "UNDER_REVIEW":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        label: "Under Review",
      };
    case "APPROVED":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
        label: "Approved",
      };
    case "DECLINED":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        label: "Declined",
      };
    case "COMPLETED":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
        label: "Completed",
      };
    case "WITHDRAWN":
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
        label: "Withdrawn",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
        label: status,
      };
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ApprovedActionPanel({
  onDecline,
  onAccept,
  isSubmitting,
}: {
  onDecline: () => void;
  onAccept: () => void;
  isSubmitting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.985 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex flex-col gap-4 rounded-2xl border border-[#D8E7FF] bg-[#EFF6FF] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
    >
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-[#2763F6] sm:text-[15px]">
          Congratulations! You&apos;ve been approved.
        </p>
        <p className="max-w-md text-sm leading-6 text-[#64748B]">
          Please confirm your participation to finalize the application.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 sm:shrink-0">
        <ApplicationStatusConfirmDialog
          action="decline"
          isSubmitting={isSubmitting}
          onConfirm={onDecline}
          trigger={
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-6 text-sm font-semibold text-[#111827] shadow-none hover:bg-[#F8FAFC]"
            >
              Decline
            </Button>
          }
        />
        <ApplicationStatusConfirmDialog
          action="accept"
          isSubmitting={isSubmitting}
          onConfirm={onAccept}
          trigger={
            <Button
              type="button"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-[#2F6FE4] px-6 text-sm font-semibold text-white shadow-[0px_12px_24px_-10px_rgba(47,111,228,0.85)] hover:bg-[#245cc2]"
            >
              Accept
            </Button>
          }
        />
      </div>
    </motion.div>
  );
}

function ApplicationCard({ app, index }: { app: Application; index: number }) {
  const fetcher = useFetcher();
  const statusStyle = getStatusStyle(app.status);
  const sourceTypeStyle = getSourceTypeStyle(app.sourceType);
  const image = resolveImageURL(app.imageKey || "");
  const normalizedSourceType = app.sourceType.toLowerCase();
  const showActionButtons =
    app.status === "COMPLETED" ||
    app.status === "WITHDRAWN" ||
    app.status === "DECLINED";
  const isApproved = app.status.toUpperCase() === "APPROVED";

  function handleChangeStatus(statusAction: "confirm" | "decline") {
    const formData = new FormData();
    formData.set("sourceType", normalizedSourceType);
    formData.set("applicationId", app.id);
    formData.set("statusAction", statusAction);

    fetcher.submit(formData, {
      method: "POST",
      action: "/api/myspace/my-application/change-status",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.15, delay: index * 0.03, ease: "easeInOut" }}
    >
      <Card className="w-full cursor-pointer bg-white rounded-2xl overflow-hidden shadow-none">
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4">
            {/* Image Section */}
            <div className="relative shrink-0">
              <img
                src={image}
                alt={app.title}
                className="w-62.75 h-39.75 object-cover rounded-lg"
              />
              {/* Category Badge */}
              <span
                className={cn(
                  "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border",
                  sourceTypeStyle.bg,
                  sourceTypeStyle.border,
                  sourceTypeStyle.text,
                )}
              >
                {app.sourceType}
              </span>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <h3 className="text-[22px] leading-8.25 font-bold text-gray-800">
                    <Link
                      to={`/my-applications/detail/${
                        app.sourceType.toLowerCase() === "project"
                          ? "projects"
                          : app.sourceType.toLowerCase()
                      }/${app.id}`}
                      className="inline-block rounded-sm transition-all duration-200 hover:text-blue-600 hover:underline hover:underline-offset-4 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {app.title}
                    </Link>
                  </h3>
                  <p className="text-sm font-medium text-gray-500">
                    Applied {formatDate(app.appliedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} rounded-full text-xs font-bold uppercase tracking-wide`}
                  >
                    {statusStyle.label}
                  </span>
                  {showActionButtons && (
                    <MyApplicationActions application={app} />
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-col pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(app.deadline)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>TBD</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{app.location.name}</span>
                </div>
              </div>
            </div>
          </div>
          <AnimatePresence initial={false} mode="wait">
            {isApproved ? (
              <ApprovedActionPanel
                key="approved-actions"
                isSubmitting={fetcher.state !== "idle"}
                onDecline={() => handleChangeStatus("decline")}
                onAccept={() => handleChangeStatus("confirm")}
              />
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MyApplicationCardList() {
  const { myApplication } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {myApplication.applications.length > 0 ? (
          myApplication.applications.map((app, index) => (
            <ApplicationCard key={app.id} app={app} index={index} />
          ))
        ) : (
          <EmptyApplicationCard />
        )}
      </AnimatePresence>
    </div>
  );
}
