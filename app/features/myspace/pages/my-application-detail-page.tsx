import {
  Archive,
  BadgeCheck,
  Ban,
  CheckCircle2,
  Clock,
  Copy,
  EllipsisVertical,
  ExternalLink,
  PartyPopper,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useFetcher, useLoaderData } from "react-router";
import { toast } from "sonner";
import BackToButton from "~/components/back-to-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, resolveImageURL } from "~/lib/utils";
import { AppliedRoleCard } from "../components/applied-role-card";
import ApplicationStatusConfirmDialog from "../components/application-status-confirm-dialog";
import { DetailAndContactCard } from "../components/detail-and-contact-card";
import { ProjectOverviewCard } from "../components/project-overview-card";
import { StatusTimeline } from "../components/status-timeline";
import type { loader } from "../route/my-application.$sourceType.$postingId";

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadgeClass(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
    case "CONFIRMED":
    case "COMPLETED":
      return "bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#E6F4EA]";
    case "DECLINED":
      return "bg-[#FCE8E6] text-[#D93025] hover:bg-[#FCE8E6]";
    case "WITHDRAWN":
      return "bg-[#F1F3F4] text-[#5F6368] hover:bg-[#F1F3F4]";
    default:
      return "bg-[#E8F0FE] text-[#1A73E8] hover:bg-[#E8F0FE]";
  }
}

function getTimelineActiveStep(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return 5;
    case "CONFIRMED":
      return 4;
    case "APPROVED":
      return 3;
    case "UNDER_REVIEW":
      return 2;
    default:
      return 1;
  }
}

function buildTelegramLink(username?: string | null) {
  if (!username) return undefined;
  return `https://t.me/${username.replace("@", "")}`;
}

function StatusSummary({
  status,
  roleTitle,
  actions,
  isSubmitting,
  canArchive,
  isArchived,
  isArchiving,
  onStatusAction,
  onArchive,
}: {
  status: string;
  roleTitle: string;
  actions?: {
    canConfirm: boolean;
    canDecline: boolean;
    canWithdraw: boolean;
  };
  isSubmitting: boolean;
  canArchive: boolean;
  isArchived: boolean;
  isArchiving: boolean;
  onStatusAction: (action: "confirm" | "decline" | "withdraw") => void;
  onArchive: () => void;
}) {
  const normalizedStatus = status.toUpperCase();
  const isApproved = normalizedStatus === "APPROVED";
  const isConfirmed = normalizedStatus === "CONFIRMED";
  const isCompleted = normalizedStatus === "COMPLETED";
  const isWithdrawn = normalizedStatus === "WITHDRAWN";
  const isClosed = normalizedStatus === "DECLINED";
  const canConfirm = actions?.canConfirm ?? isApproved;
  const canDecline = actions?.canDecline ?? isApproved;
  const canWithdraw =
    actions?.canWithdraw ??
    (!isApproved && !isConfirmed && !isCompleted && !isClosed && !isWithdrawn);

  return (
    <Card
      className={cn(
        "rounded-3xl shadow-none",
        isApproved
          ? "border-emerald-200 bg-linear-to-r from-emerald-50 via-emerald-50/60 to-white dark:border-emerald-900/40 dark:from-emerald-950/20 dark:via-emerald-950/10 dark:to-slate-900"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
      )}
    >
      <CardContent className="flex flex-col justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              isApproved
                ? "bg-emerald-600 text-white"
                : isCompleted || isConfirmed
                  ? "bg-blue-100 text-blue-600"
                  : isClosed
                    ? "bg-red-50 text-red-600"
                    : isWithdrawn
                      ? "bg-slate-100 text-slate-500"
                      : "bg-slate-100 text-slate-600",
            )}
          >
            {isApproved ? (
              <PartyPopper className="size-5" />
            ) : isCompleted || isConfirmed ? (
              <CheckCircle2 className="size-6" />
            ) : isClosed || isWithdrawn ? (
              <Ban className="size-6" />
            ) : (
              <Clock className="size-6" />
            )}
          </div>
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "text-xs font-extrabold tracking-wider uppercase",
                  isApproved
                    ? "text-emerald-800 dark:text-emerald-300"
                    : "text-slate-400",
                )}
              >
                {isApproved ? `Offer received - ${roleTitle}` : roleTitle}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-md border-none px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-none",
                  getStatusBadgeClass(status),
                )}
              >
                {status.replaceAll("_", " ")}
              </Badge>
            </div>
            <p
              className={cn(
                "max-w-2xl text-sm leading-6 font-medium",
                isApproved
                  ? "text-emerald-900 dark:text-emerald-200"
                  : "text-slate-600 dark:text-slate-400",
              )}
            >
              {isApproved
                ? "Your application has been approved. Please review the details and confirm your participation."
                : isConfirmed
                  ? "You have officially accepted this role. You are set for participation."
                  : isCompleted
                    ? "This application has been completed."
                    : isWithdrawn
                      ? "This application has been withdrawn by you."
                      : isClosed
                        ? "This application is no longer active."
                        : "The organizer is currently evaluating your application."}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:justify-end">
          {canConfirm || canDecline ? (
            <>
              {canDecline ? (
                <ApplicationStatusConfirmDialog
                  action="decline"
                  isSubmitting={isSubmitting}
                  onConfirm={() => onStatusAction("decline")}
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      className="h-11 rounded-xl border-[#DADCE0] px-5 font-bold text-[#D93025] hover:bg-red-50"
                    >
                      Decline
                    </Button>
                  }
                />
              ) : null}
              {canConfirm ? (
                <ApplicationStatusConfirmDialog
                  action="accept"
                  isSubmitting={isSubmitting}
                  onConfirm={() => onStatusAction("confirm")}
                  trigger={
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      className="h-11 rounded-xl bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700"
                    >
                      Accept Offer
                    </Button>
                  }
                />
              ) : null}
            </>
          ) : canWithdraw ? (
            <ApplicationStatusConfirmDialog
              action="withdraw"
              isSubmitting={isSubmitting}
              onConfirm={() => onStatusAction("withdraw")}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border-slate-200 px-5 font-bold text-red-600 hover:bg-red-50"
                >
                  Withdraw Application
                </Button>
              }
            />
          ) : (
            <Button
              type="button"
              variant="ghost"
              disabled={(!isArchived && !canArchive) || isArchiving}
              onClick={onArchive}
              className={cn(
                "h-10 rounded-xl font-bold",
                canArchive || isArchived
                  ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  : "text-slate-400",
              )}
            >
              <Archive className="size-4" />
              {isArchived
                ? isArchiving
                  ? "Unarchiving..."
                  : "Unarchive"
                : canArchive
                  ? isArchiving
                    ? "Archiving..."
                    : "Archive"
                  : "Archive unavailable"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyApplicationDetailPage() {
  const { application, applicationTitle, postingId, statusLabel, sourceType } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const archiveFetcher = useFetcher();
  const pendingStatusAction = useRef<"confirm" | "decline" | "withdraw" | null>(
    null,
  );
  const pendingArchiveAction = useRef<"archive" | "unarchive" | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [copiedPostingLink, setCopiedPostingLink] = useState(false);

  const detail = application;
  const roles = useMemo(() => detail.roles, [detail.roles]);
  const initialSelectedApplicationId =
    detail.approvedRole?.applicationId ?? roles[0]?.applicationId;
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | undefined
  >(initialSelectedApplicationId);

  useEffect(() => {
    setSelectedApplicationId(initialSelectedApplicationId);
  }, [initialSelectedApplicationId]);

  useEffect(() => {
    if (
      fetcher.state !== "idle" ||
      !fetcher.data ||
      !pendingStatusAction.current
    ) {
      return;
    }

    const action = pendingStatusAction.current;
    pendingStatusAction.current = null;

    if (fetcher.data.ok) {
      const successMessages = {
        confirm: "Participation confirmed.",
        decline: "Offer declined.",
        withdraw: "Application withdrawn.",
      };
      toast.success(successMessages[action]);
      return;
    }

    toast.error(fetcher.data.error ?? "Unable to update this application.");
  }, [fetcher.data, fetcher.state]);

  useEffect(() => {
    if (
      archiveFetcher.state !== "idle" ||
      !archiveFetcher.data ||
      !pendingArchiveAction.current
    ) {
      return;
    }

    const action = pendingArchiveAction.current;
    pendingArchiveAction.current = null;

    if (archiveFetcher.data.ok) {
      toast.success(
        action === "archive"
          ? "Application archived."
          : "Application restored.",
      );
      return;
    }

    toast.error(
      archiveFetcher.data.error ?? "Unable to update the archive status.",
    );
  }, [archiveFetcher.data, archiveFetcher.state]);

  const selectedRole =
    roles.find((role) => role.applicationId === selectedApplicationId) ??
    roles[0];
  const title = detail.opportunity.title || applicationTitle || "Application";
  const roleTitle = selectedRole?.title || applicationTitle;
  const totalRoleApplied = detail.totalRoleApplied ?? roles.length;
  const overview =
    selectedRole?.description ||
    detail.opportunity.overview ||
    "No specific detailed description has been provided for this role.";
  const responsibilities = selectedRole?.responsibilities ?? [];
  const requirements = selectedRole?.requirements ?? [];
  const roleStatus = selectedRole?.status ?? statusLabel;
  const rewardPoints = Number(detail.opportunity.impactRewardPoints ?? 0);
  const scheduleLabel = [
    detail.opportunity.startDate,
    detail.opportunity.endDate,
  ]
    .filter(Boolean)
    .map((date) => formatDate(date))
    .join(" - ");
  const owner = detail.owner;
  const ownerContact = owner.contact;
  const ownerAvatar = resolveImageURL(
    owner.avatarKey,
    "/images/avatar_placeholder.webp",
  );
  const ownerRole = owner.postedCount
    ? `${owner.postedCount} posts created`
    : "Organizer";
  const inactive = ["DECLINED", "WITHDRAWN"].includes(roleStatus.toUpperCase());
  const postingDetailHref =
    sourceType === "volunteer"
      ? `/volunteer/detail/${postingId}`
      : `/launchpad/detail/${postingId}`;

  function handleStatusAction(
    statusAction: "confirm" | "decline" | "withdraw",
  ) {
    if (!selectedRole || fetcher.state !== "idle") return;

    const formData = new FormData();
    formData.set("actionType", "change-status");
    formData.set("sourceType", sourceType);
    formData.set("applicationId", selectedRole.applicationId);
    formData.set("statusAction", statusAction);
    pendingStatusAction.current = statusAction;

    fetcher.submit(formData, {
      method: "POST",
    });
  }

  function handleArchive() {
    if (archiveFetcher.state !== "idle") return;

    const archiveAction = detail.archived ? "unarchive" : "archive";
    const formData = new FormData();
    formData.set("actionType", "archive");
    formData.set("sourceType", sourceType);
    formData.set("opportunityId", postingId);
    formData.set("archiveAction", archiveAction);
    pendingArchiveAction.current = archiveAction;

    archiveFetcher.submit(formData, {
      method: "POST",
    });
  }

  async function handleSharePostingLink() {
    if (typeof window === "undefined") return;

    const shareUrl = new URL(postingDetailHref, window.location.origin).href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
        return;
      }
    }

    setCopiedPostingLink(true);
    window.setTimeout(() => setCopiedPostingLink(false), 1800);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-10 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          className="flex items-center justify-between"
        >
          <BackToButton to="/my-applications" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open application actions"
                className="size-10 rounded-2xl bg-[#F8FAFB] text-slate-400 hover:bg-[#EFF3F8] hover:text-slate-600"
              >
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-48 rounded-2xl border-[#E7ECF3] p-2 shadow-lg"
            >
              <DropdownMenuItem
                asChild
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:bg-slate-50"
              >
                <Link to={postingDetailHref}>
                  <ExternalLink className="size-4 text-[#1A73E8]" />
                  View posting detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:bg-slate-50"
                onClick={handleSharePostingLink}
              >
                <Copy className="size-4 text-[#1A73E8]" />
                {copiedPostingLink ? "Link copied" : "Share"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.05,
          }}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="mb-1 block text-xs font-bold tracking-widest text-[#1A73E8] uppercase dark:text-blue-400">
                {sourceType === "volunteer"
                  ? "Volunteer Posting"
                  : "Project Posting"}
              </span>
              <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-[#202124] sm:text-3xl dark:text-white">
                {title}
              </h1>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Applied Roles:{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {totalRoleApplied}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          <section className="order-2 flex flex-col gap-6 lg:sticky lg:top-8 lg:order-1 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
            >
              <AppliedRoleCard
                roles={roles}
                selectedApplicationId={selectedRole?.applicationId}
                onSelectRole={setSelectedApplicationId}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.28,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
            >
              <DetailAndContactCard
                date={scheduleLabel || "-"}
                location={detail.opportunity.location?.name || "-"}
                rewardPoints={rewardPoints}
                organizer={{
                  avatar: ownerAvatar,
                  name: owner.name || "Organizer",
                  role: ownerRole,
                  phone: ownerContact?.phoneNumber
                    ? `tel:${ownerContact.phoneNumber}`
                    : undefined,
                  email: ownerContact?.email
                    ? `mailto:${ownerContact.email}`
                    : undefined,
                  telegram: buildTelegramLink(ownerContact?.telegramUsername),
                }}
              />
            </motion.div>
          </section>

          <section className="order-1 flex min-w-0 flex-col gap-6 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.28,
                delay: prefersReducedMotion ? 0 : 0.05,
              }}
            >
              <StatusSummary
                status={roleStatus}
                roleTitle={roleTitle}
                actions={selectedRole?.actions}
                isSubmitting={fetcher.state !== "idle"}
                canArchive={detail.canArchive}
                isArchived={detail.archived}
                isArchiving={archiveFetcher.state !== "idle"}
                onStatusAction={handleStatusAction}
                onArchive={handleArchive}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.28,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
            >
              <StatusTimeline
                activeStep={getTimelineActiveStep(roleStatus)}
                appliedAt={selectedRole?.appliedAt}
                timeline={selectedRole?.timeline}
                inactive={inactive}
                status={roleStatus}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.28,
                delay: prefersReducedMotion ? 0 : 0.15,
              }}
            >
              <ProjectOverviewCard
                overview={overview}
                sourceType={sourceType}
                responsibilities={responsibilities}
                requirements={requirements}
              />
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
