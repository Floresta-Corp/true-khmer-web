import { AnimatePresence, motion } from "motion/react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import {
  BadgeCheck,
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn, resolveImageURL } from "~/lib/utils";
import type {
  Application,
  ApplicationRoleSummary,
  MyApplicationRequestSourceType,
} from "~/features/myspace/types";
import type { loader } from "../../route/my-applications";
import ApplicationStatusConfirmDialog from "../application-status-confirm-dialog";
import { MyApplicationActions } from "../my-application-actions";
import EmptyApplicationCard from "./empty-application-card";

function normalizeSourceType(
  sourceType: Application["sourceType"],
): MyApplicationRequestSourceType {
  return sourceType === "PROJECT" ? "projects" : "volunteer";
}

function getApplicationHref(app: Application) {
  return `/my-applications/detail/${normalizeSourceType(app.sourceType)}/${app.opportunityId}`;
}

function getListingHref(app: Application) {
  return app.sourceType === "PROJECT"
    ? `/launchpad/detail/${app.opportunityId}`
    : `/volunteer/detail/${app.opportunityId}`;
}

function getSourceTypeStyle(sourceType: Application["sourceType"]) {
  switch (sourceType.toUpperCase()) {
    case "PROJECT":
    case "PROJECTS":
      return "bg-[#E8F0FE] text-[#1A73E8]";
    case "VOLUNTEER":
    default:
      return "bg-[#E6F4EA] text-[#1E8E3E]";
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
) {
  if (!startDate && !endDate) return "-";

  const formattedStartDate = startDate ? formatDate(startDate) : null;
  const formattedEndDate = endDate ? formatDate(endDate) : null;

  if (formattedStartDate && formattedEndDate) {
    return formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedEndDate}`;
  }

  return formattedStartDate ?? formattedEndDate ?? "-";
}

function ApprovedActionPanel({
  role,
  sourceType,
  isSubmitting,
}: {
  role: ApplicationRoleSummary;
  sourceType: Application["sourceType"];
  isSubmitting: boolean;
}) {
  const fetcher = useFetcher();

  function handleChangeStatus(statusAction: "confirm" | "decline") {
    const formData = new FormData();
    formData.set("actionType", "change-status");
    formData.set("sourceType", normalizeSourceType(sourceType));
    formData.set("applicationId", role.applicationId);
    formData.set("statusAction", statusAction);

    fetcher.submit(formData, {
      method: "POST",
    });
  }

  const submitting = isSubmitting || fetcher.state !== "idle";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.985 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="rounded-2xl border border-blue-100 bg-[#F4F8FF] p-5 dark:border-blue-900/20 dark:bg-blue-900/10"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#1A73E8] dark:text-blue-400">
            Congratulations! You&apos;ve been approved.
          </p>
          <p className="text-[13px] font-medium text-[#5F6368] dark:text-slate-400">
            Please confirm your participation to finalize the application.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <ApplicationStatusConfirmDialog
            action="decline"
            isSubmitting={submitting}
            onConfirm={() => handleChangeStatus("decline")}
            trigger={
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                className="h-10 rounded-xl border-[#DADCE0] bg-white px-6 text-[13px] font-bold text-[#5F6368] shadow-none hover:bg-gray-50"
              >
                Decline
              </Button>
            }
          />
          <ApplicationStatusConfirmDialog
            action="accept"
            isSubmitting={submitting}
            onConfirm={() => handleChangeStatus("confirm")}
            trigger={
              <Button
                type="button"
                disabled={submitting}
                className="h-10 rounded-xl bg-[#1A73E8] px-6 text-[13px] font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-[#1557B0] dark:shadow-none"
              >
                Accept
              </Button>
            }
          />
        </div>
      </div>
    </motion.div>
  );
}

function ApplicationCardActions({ application }: { application: Application }) {
  const archiveFetcher = useFetcher();
  const targetHref = getApplicationHref(application);
  const isArchived = Boolean(application.archivedAt);

  function handleArchive() {
    if (archiveFetcher.state !== "idle") return;

    const formData = new FormData();
    formData.set("actionType", "archive");
    formData.set("sourceType", normalizeSourceType(application.sourceType));
    formData.set("opportunityId", application.opportunityId);
    formData.set("archiveAction", isArchived ? "unarchive" : "archive");

    archiveFetcher.submit(formData, {
      method: "POST",
    });
  }

  return (
    <div className="absolute top-5 right-5 z-10">
      <MyApplicationActions
        application={application}
        detailsHref={targetHref}
        listingHref={getListingHref(application)}
        canArchive={application.canArchive}
        isArchived={isArchived}
        isArchiving={archiveFetcher.state !== "idle"}
        onArchive={handleArchive}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="More options"
          >
            <MoreVertical className="size-4" />
          </Button>
        }
      />
    </div>
  );
}

function ApplicationGroupCard({ application }: { application: Application }) {
  const targetHref = getApplicationHref(application);
  const image = resolveImageURL(
    application.imageKey || "",
    "/images/volunteer-placeholder.svg",
  );

  return (
    <div>
      <Card className="relative overflow-hidden rounded-2xl border-none bg-white p-0 shadow-none ring-1 ring-foreground/10 transition-all hover:bg-slate-50/70 active:scale-[0.995] sm:h-46 dark:bg-slate-900 dark:hover:bg-slate-800/50">
        <CardContent className="h-full p-6">
          <ApplicationCardActions application={application} />

          <Link
            to={targetHref}
            className="group flex h-full w-full flex-col items-start gap-6 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:flex-row sm:items-center sm:gap-8"
            aria-label={`View application detail for ${
              application.opportunityTitle || "application"
            }`}
          >
            <div className="relative h-33.75 w-full shrink-0 overflow-hidden rounded-[20px] border border-gray-100/80 bg-slate-50 sm:w-60 dark:border-slate-800 dark:bg-slate-950">
              <img
                src={image}
                alt={application.opportunityTitle}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <span
                className={cn(
                  "absolute top-3 left-3 rounded-lg px-2.5 py-1 text-[9px] font-black tracking-widest uppercase shadow-sm",
                  getSourceTypeStyle(application.sourceType),
                )}
              >
                {application.sourceType}
              </span>
            </div>

            <div className="flex h-full min-w-0 flex-1 flex-col justify-center pr-10 sm:pr-12">
              <div className="flex flex-col gap-1">
                <h2 className="line-clamp-2 text-2xl leading-tight font-bold tracking-tight text-[#111827] transition-colors group-hover:text-[#1A73E8] dark:text-white">
                  {application.opportunityTitle || "Application"}
                </h2>
              </div>

              <div className="mt-4 flex flex-col items-start gap-2 text-sm font-medium text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#BDC1C6]" />
                  <span>{formatDate(application.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-[#BDC1C6]" />
                  <span>
                    {formatDateRange(
                      application.startDate,
                      application.endDate,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#BDC1C6]" />
                  <span>{application.location?.name ?? "-"}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F3F4] px-3 py-1 text-[11px] font-bold text-[#5F6368] dark:bg-slate-800 dark:text-slate-300">
                  <BadgeCheck className="size-3.5 text-blue-500" />
                  {application.totalRoleApplied} applied{" "}
                  {application.totalRoleApplied === 1 ? "role" : "roles"}
                </span>
                {application.needAttention ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <Sparkles className="size-3 text-emerald-500" />
                    Offer Received
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function ApplicationApprovedCard({
  application,
}: {
  application: Application;
}) {
  const targetHref = getApplicationHref(application);
  const image = resolveImageURL(
    application.imageKey || "",
    "/images/volunteer-placeholder.svg",
  );
  const pendingRole = application.approvedRole;

  return (
    <div>
      <Card className="relative overflow-hidden rounded-[28px] border border-[#E0E3E7] bg-white p-0 shadow-none transition-all hover:bg-[#F8F9FA] dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <ApplicationCardActions application={application} />

          <Link
            to={targetHref}
            className="group flex w-full flex-col items-start gap-6 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:flex-row sm:items-center sm:gap-8"
            aria-label={`View application detail for ${
              application.opportunityTitle || "application"
            }`}
          >
            <div className="relative h-33.75 w-full shrink-0 overflow-hidden rounded-[20px] border border-gray-100/80 bg-slate-50 sm:w-60 dark:border-slate-800 dark:bg-slate-950">
              <img
                src={image}
                alt={application.opportunityTitle}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <span
                className={cn(
                  "absolute top-3 left-3 rounded-lg px-2.5 py-1 text-[9px] font-black tracking-widest uppercase shadow-sm",
                  getSourceTypeStyle(application.sourceType),
                )}
              >
                {application.sourceType}
              </span>
            </div>

            <div className="min-w-0 flex-1 pr-10 sm:pr-12">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
                  <h2 className="text-2xl leading-tight font-bold tracking-tight text-[#111827] transition-colors group-hover:text-[#1A73E8] dark:text-white">
                    {application.opportunityTitle || "Application"}
                  </h2>
                  {pendingRole ? (
                    <span className="mt-1 inline-flex rounded-md bg-[#E6F4EA] px-3 py-1 text-[10px] font-black tracking-widest text-[#1E8E3E] uppercase">
                      Approved
                    </span>
                  ) : null}
                </div>
                {pendingRole ? (
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-[#1A73E8] dark:text-blue-400">
                      Approved Role: {pendingRole.title}
                    </p>
                    <p className="text-xs font-medium text-[#5F6368] dark:text-slate-500">
                      Applied {formatDate(pendingRole.appliedAt)}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-gray-500 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#BDC1C6]" />
                  <span>{formatDate(application.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-[#BDC1C6]" />
                  <span>
                    {formatDateRange(
                      application.startDate,
                      application.endDate,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#BDC1C6]" />
                  <span>{application.location?.name ?? "-"}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F3F4] px-3 py-1 text-[11px] font-bold text-[#5F6368] dark:bg-slate-800 dark:text-slate-300">
                  <BadgeCheck className="size-3.5 text-blue-500" />
                  {application.totalRoleApplied} applied{" "}
                  {application.totalRoleApplied === 1 ? "role" : "roles"}
                </span>
                {application.needAttention ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <Sparkles className="size-3 text-emerald-500" />
                    Offer Received
                  </span>
                ) : null}
              </div>
            </div>
          </Link>

          {pendingRole ? (
            <AnimatePresence initial={false} mode="wait">
              <ApprovedActionPanel
                key={`approved-${pendingRole.applicationId}`}
                role={pendingRole}
                sourceType={application.sourceType}
                isSubmitting={false}
              />
            </AnimatePresence>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ApplicationGroupCardSkeleton() {
  return (
    <div>
      <Card className="relative overflow-hidden rounded-[28px] border border-[#E0E3E7] bg-white p-0 shadow-none dark:border-slate-800 dark:bg-slate-900">
        <CardContent className="p-5 sm:p-6">
          <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <Skeleton className="h-33.75 w-full shrink-0 rounded-[20px] sm:w-60" />

            <div className="w-full min-w-0 flex-1 space-y-4 pr-10 sm:pr-12">
              <div className="space-y-2">
                <Skeleton className="h-7 w-4/5 max-w-130 rounded-xl" />
                <Skeleton className="h-4 w-44 rounded-lg" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-5 w-28 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-lg" />
                <Skeleton className="h-5 w-32 rounded-lg" />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-7 w-36 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MyApplicationCardList() {
  const { myApplication } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const applications = myApplication.applications ?? [];
  const isApprovedFilter = searchParams.get("filter") === "approved";
  const isFiltering =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/my-applications";

  return (
    <div className="flex flex-col gap-5">
      <AnimatePresence mode="wait">
        {isFiltering ? (
          <motion.div
            key="my-application-loading"
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            {Array.from({ length: Math.max(applications.length, 3) }).map(
              (_, index) => (
                <ApplicationGroupCardSkeleton
                  key={`application-skeleton-${index}`}
                />
              ),
            )}
          </motion.div>
        ) : applications.length > 0 ? (
          <motion.div
            key="my-application-results"
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {applications.map((application) =>
              isApprovedFilter ? (
                <ApplicationApprovedCard
                  key={application.opportunityId}
                  application={application}
                />
              ) : (
                <ApplicationGroupCard
                  key={application.opportunityId}
                  application={application}
                />
              ),
            )}
          </motion.div>
        ) : (
          <EmptyApplicationCard />
        )}
      </AnimatePresence>
    </div>
  );
}
