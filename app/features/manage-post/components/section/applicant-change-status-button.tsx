import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { CircleCheck, X, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
  Applicant,
  ApplicantStatusAction,
} from "~/features/manage-post/types";
import { Button } from "~/components/ui/button";
import ApplicantContactPopover from "./applicant-contact-popover";
import { cn } from "~/lib/utils";

type Props = {
  currentStatus: ApplicantStatusAction;
  postingId: string;
  applicationId: string;
  sourceType: string;
  applicant: Applicant;
  onDeclined?: (candidateId: string, options: { blocked: boolean }) => void;
};

type DialogMode = "process" | "confirm-approve" | "confirm-decline" | null;

const FINALIZED_APPROVED = ["CONFIRMED", "COMPLETED"] as const;
const FINALIZED_DECLINED = ["DECLINED", "WITHDRAWN"] as const;
const FINAL_STATUSES = ["DECLINED", "CONFIRMED", "COMPLETED", "APPROVED"];

const displayLabel: Record<string, string> = {
  APPROVED: "approved",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  DECLINED: "declined",
  WITHDRAWN: "withdrawn",
  UNDER_REVIEW: "under review",
  SUBMITTED: "new",
};

export default function ApplicantStatusChangeButton({
  applicationId,
  applicant,
  onDeclined,
}: Props) {
  const fetcher = useFetcher();
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [declineAll, setDeclineAll] = useState(false);
  const [blockFutureApply, setBlockFutureApply] = useState(false);

  const isLoading = fetcher.state !== "idle";
  const roles =
    applicant?.submissions.flatMap((submission) => submission.roles) ?? [];
  const hasMultipleRoles = roles.length > 1;

  const approvedRole = roles.find((r) =>
    ["APPROVED", "CONFIRMED", "COMPLETED"].includes(r.status),
  );

  const firstActiveRole = roles.find((r) => !FINAL_STATUSES.includes(r.status));

  const [selectedDialogRoleId, setSelectedDialogRoleId] = useState<
    string | null
  >(firstActiveRole?.roleId ?? null);

  useEffect(() => {
    setSelectedDialogRoleId(firstActiveRole?.roleId ?? null);
  }, [applicant.candidate.id]);

  const resolvedApplicationId = hasMultipleRoles
    ? (roles.find((r) => r.roleId === selectedDialogRoleId)?.applicationId ??
      approvedRole?.applicationId ??
      null)
    : applicationId;

  const resolvedRole =
    roles.find((r) => r.applicationId === resolvedApplicationId) ??
    firstActiveRole ??
    roles[0];

  const isFinalPending =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("statusAction") === "approve";
  const isDeclining =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("actionType") === "decline";

  const normalizedStatus = applicant?.overallStatus?.toUpperCase();
  const isServerApproved = (FINALIZED_APPROVED as readonly string[]).includes(
    normalizedStatus,
  );
  const isPendingCandidateConfirmation = normalizedStatus === "APPROVED";
  const isServerDeclined = (FINALIZED_DECLINED as readonly string[]).includes(
    normalizedStatus,
  );
  const isServerFinalized = isServerApproved || isServerDeclined;
  const isFinalStatus = isServerFinalized || isFinalPending;
  const isApprovedSide = isServerApproved || isPendingCandidateConfirmation;

  const handleApprove = () => {
    if (!resolvedApplicationId) return;
    const formData = new FormData();
    formData.append("applicationId", resolvedApplicationId);
    formData.append("statusAction", "approve");
    fetcher.submit(formData, {
      method: "POST",
      action: window.location.pathname,
    });
    setDialogMode(null);
  };

  const lastSubmittedAction = useRef<"decline" | "approve" | null>(null);
  const lastBlockFutureApply = useRef(false);
  const lastDeclinedCandidateId = useRef<string | null>(null);

  const openReprocess = () => {
    const approvedRoleId = roles.find((r) =>
      ["APPROVED"].includes(r.status),
    )?.roleId;
    if (approvedRoleId) setSelectedDialogRoleId(approvedRoleId);
    setDeclineAll(false);
    setBlockFutureApply(false);
    setDialogMode("process");
  };

  const handleDecline = () => {
    if (!resolvedApplicationId) return;
    const formData = new FormData();
    formData.append("decline", "true");
    formData.append("actionType", "decline");
    formData.append("applicationId", resolvedApplicationId);
    if (declineAll) formData.append("declineAll", "true");
    if (blockFutureApply) formData.append("blockFutureApply", "true");

    lastSubmittedAction.current = "decline";
    lastBlockFutureApply.current = blockFutureApply;
    lastDeclinedCandidateId.current = applicant.candidate.id;

    fetcher.submit(formData, {
      method: "POST",
      action: window.location.pathname,
    });
    setDialogMode(null);
  };

  const openDeclineConfirm = () => {
    setDeclineAll(false);
    setBlockFutureApply(false);
    setDialogMode("confirm-decline");
  };

  const onDeclinedRef = useRef(onDeclined);
  useEffect(() => {
    onDeclinedRef.current = onDeclined;
  }, [onDeclined]);

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data?.ok === true &&
      lastSubmittedAction.current === "decline"
    ) {
      onDeclinedRef.current?.(lastDeclinedCandidateId.current!, {
        blocked: lastBlockFutureApply.current,
      });
      lastSubmittedAction.current = null;
      lastDeclinedCandidateId.current = null;
      lastBlockFutureApply.current = false;
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <AnimatePresence>
        {dialogMode && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDialogMode(null)}
              className="fixed inset-0 z-60 bg-black/40"
            />

            {/* Process Dialog */}
            {dialogMode === "process" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                className="fixed top-1/2 left-1/2 z-70 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Process Application
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-400">
                      {applicant.candidate.name} • {applicant.candidate.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setDialogMode(null)}
                    className="cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X size={16} />
                  </Button>
                </div>

                {/* Roles list */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Applications
                  </p>
                  <div className="flex max-h-52 flex-col gap-2 overflow-y-auto pr-1">
                    {roles.map((role) => {
                      const isSelected = selectedDialogRoleId === role.roleId;
                      const isFinalized = [
                        "CONFIRMED",
                        "COMPLETED",
                        "DECLINED",
                      ].includes(role.status);
                      return (
                        <Button
                          key={role.roleId}
                          disabled={isFinalized}
                          onClick={() => setSelectedDialogRoleId(role.roleId)}
                          className={cn(
                            "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-5 text-left text-sm font-semibold transition-all",
                            isSelected
                              ? "border-blue-400 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                            isFinalized && "cursor-default opacity-40",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                                isSelected
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300",
                              )}
                            >
                              {isSelected && (
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            {role.title}
                          </div>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                              role.status === "UNDER_REVIEW"
                                ? "border-purple-200 bg-purple-50 text-purple-600"
                                : "border-gray-200 bg-gray-50 text-gray-400",
                            )}
                          >
                            {role.status === "UNDER_REVIEW"
                              ? "In Review"
                              : role.status}
                          </span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* {hasMultipleRoles && ( */}
                  <div className="mt-1 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <TriangleAlert
                      className="mt-0.5 shrink-0 text-amber-500"
                      size={14}
                    />
                    <p className="text-xs leading-relaxed text-amber-700">
                      Note: You can only approve one application per candidate.
                    </p>
                  </div>
                  {/* )} */}
                </div>

                <div className="h-px bg-gray-100" />

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    onClick={openDeclineConfirm}
                    disabled={isLoading || !resolvedApplicationId}
                    className="flex h-auto cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-red-200 bg-red-50/50 py-6 font-bold transition-all hover:bg-red-100 disabled:opacity-50"
                  >
                    <X className="size-5 text-red-500" strokeWidth={2.5} />
                    <span className="text-sm text-red-600">
                      Decline Application
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setDialogMode("confirm-approve")}
                    disabled={
                      isLoading ||
                      !resolvedApplicationId ||
                      (hasMultipleRoles && !selectedDialogRoleId) ||
                      (resolvedRole?.status &&
                        FINAL_STATUSES.includes(resolvedRole.status))
                    }
                    className="flex h-auto cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 py-6 font-bold transition-all hover:bg-emerald-100 disabled:opacity-50"
                  >
                    <CircleCheck
                      className="size-5 text-emerald-500"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-emerald-600">
                      Approve Application
                    </span>
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setDialogMode(null)}
                    className="cursor-pointer text-xs tracking-widest text-gray-500 uppercase transition-colors hover:text-gray-600"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Confirm Approve Dialog */}
            {dialogMode === "confirm-approve" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                className="fixed top-1/2 left-1/2 z-70 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                    <CircleCheck className="text-green-600" size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Confirm Approval
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      Are you sure you want to approve the application of{" "}
                      <span className="font-semibold text-gray-900">
                        {applicant.candidate.name}
                      </span>{" "}
                      for the role of{" "}
                      <span className="font-semibold text-gray-900">
                        {resolvedRole?.title}
                      </span>
                      ?
                    </p>
                  </div>
                </div>

                {/* {hasMultipleRoles && ( */}
                <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                  <TriangleAlert
                    className="mt-0.5 shrink-0 text-amber-500"
                    size={15}
                  />
                  <p className="text-xs leading-relaxed font-semibold text-amber-700">
                    Other pending applications will be marked as declined
                    automatically.
                  </p>
                </div>
                {/* )} */}

                <div className="h-px bg-gray-100" />

                <div className="flex items-center justify-end gap-3">
                  <Button
                    onClick={() => setDialogMode("process")}
                    className="h-10 cursor-pointer rounded-xl border border-gray-200 bg-white px-5 font-semibold text-gray-700 shadow-none hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="h-10 cursor-pointer rounded-xl bg-green-500 px-5 font-semibold text-white shadow-green-600/20 hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? "Approving..." : "Confirm Approval"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Confirm Decline Dialog */}
            {dialogMode === "confirm-decline" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                className="fixed top-1/2 left-1/2 z-70 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                    <TriangleAlert className="text-red-500" size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Confirm Decline
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      Are you sure you want to decline the application of{" "}
                      <span className="font-bold text-gray-900">
                        {applicant.candidate.name}
                      </span>{" "}
                      for the role of{" "}
                      <span className="font-bold text-gray-900">
                        {resolvedRole?.title}
                      </span>
                      ?
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Options */}
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                    You also can:
                  </p>

                  <Button
                    variant="ghost"
                    onClick={() => setDeclineAll((v) => !v)}
                    className="group flex cursor-pointer justify-start gap-3 text-left"
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                        declineAll
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300 bg-white group-hover:border-red-300",
                      )}
                    >
                      {declineAll && (
                        <X size={11} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      Decline all other roles
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setBlockFutureApply((v) => !v)}
                    className="group flex cursor-pointer justify-start gap-3 text-left"
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 rounded border transition-colors",
                        blockFutureApply
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300 bg-white group-hover:border-red-300",
                      )}
                    >
                      {blockFutureApply && (
                        <X size={11} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      Prevent future apply to this listing
                    </span>
                  </Button>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex items-center justify-end gap-3">
                  <Button
                    onClick={() => setDialogMode("process")}
                    className="h-10 cursor-pointer rounded-xl border border-gray-200 bg-white px-5 font-semibold text-gray-700 shadow-none hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isLoading}
                    className="h-10 cursor-pointer rounded-xl bg-red-600 px-5 font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 disabled:opacity-50"
                  >
                    {isLoading ? "Declining..." : "Confirm Decline"}
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 p-6">
        {isPendingCandidateConfirmation && !isFinalPending ? (
          <>
            <p className="text-center text-sm text-gray-400">
              This applicant has been{" "}
              <span className="text-emerald-600">approved</span>.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ApplicantContactPopover candidate={applicant.candidate} />
              <Button
                className="h-11 w-full cursor-pointer rounded-xl border border-red-200 bg-red-50 font-semibold text-red-600 transition-all hover:bg-red-100"
                onClick={openReprocess}
                disabled={isLoading}
              >
                <X className="size-4" />
                Change Decision
              </Button>
            </div>
          </>
        ) : isFinalStatus ? (
          <>
            <ApplicantContactPopover candidate={applicant.candidate} />
            <p className="text-center text-sm text-gray-400">
              This applicant has been{" "}
              <span
                className={isApprovedSide ? "text-emerald-600" : "text-red-500"}
              >
                {isFinalPending
                  ? "approved"
                  : (displayLabel[normalizedStatus] ??
                    normalizedStatus?.toLowerCase())}
              </span>
              .
            </p>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ApplicantContactPopover candidate={applicant.candidate} />
              <Button
                className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setDialogMode("process")}
                disabled={isLoading}
              >
                <CircleCheck className="mr-1.5 size-4" />
                {isFinalPending || isDeclining ? "Processing..." : "Process"}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
