import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { CircleCheck, X, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
  Applicant,
  ApplicantStatusAction,
} from "~/services/manage-post/types";
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
              className="fixed inset-0 bg-black/40 z-60"
            />

            {/* Process Dialog */}
            {dialogMode === "process" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-70 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 ">
                      Process Application
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {applicant.candidate.name} • {applicant.candidate.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setDialogMode(null)}
                    className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </Button>
                </div>

                {/* Roles list */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Applications
                  </p>
                  <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
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
                            "flex items-center justify-between cursor-pointer gap-3 w-full rounded-xl border p-5 text-left transition-all text-sm font-semibold",
                            isSelected
                              ? "border-blue-400 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                            isFinalized && "opacity-40 cursor-default",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                isSelected
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300",
                              )}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            {role.title}
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border",
                              role.status === "UNDER_REVIEW"
                                ? "bg-purple-50 text-purple-600 border-purple-200"
                                : "bg-gray-50 text-gray-400 border-gray-200",
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
                  <div className="flex gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 mt-1">
                    <TriangleAlert
                      className="text-amber-500 shrink-0 mt-0.5"
                      size={14}
                    />
                    <p className="text-xs text-amber-700 leading-relaxed">
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
                    className="py-6 h-auto rounded-2xl border cursor-pointer border-red-200 bg-red-50/50  font-bold hover:bg-red-100 transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-1.5"
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
                    className="py-6 h-auto rounded-2xl border cursor-pointer border-emerald-200 bg-emerald-50/50 font-bold hover:bg-emerald-100 transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-1.5"
                  >
                    <CircleCheck
                      className="size-5 text-emerald-500 "
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-emerald-600 ">
                      Approve Application
                    </span>
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setDialogMode(null)}
                    className="text-xs  text-gray-500 hover:text-gray-600 cursor-pointer uppercase tracking-widest transition-colors"
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-70 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <CircleCheck className="text-green-600" size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Confirm Approval
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
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
                <div className="flex gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3.5">
                  <TriangleAlert
                    className="text-amber-500 shrink-0 mt-0.5"
                    size={15}
                  />
                  <p className="text-xs text-amber-700  font-semibold leading-relaxed">
                    Other pending applications will be marked as declined
                    automatically.
                  </p>
                </div>
                {/* )} */}

                <div className="h-px bg-gray-100" />

                <div className="flex items-center justify-end gap-3">
                  <Button
                    onClick={() => setDialogMode("process")}
                    className="h-10 px-5 rounded-xl border border-gray-200 cursor-pointer bg-white text-gray-700 font-semibold hover:bg-gray-50 shadow-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="h-10 px-5 rounded-xl bg-green-500 cursor-pointer text-white font-semibold hover:bg-green-700  shadow-green-600/20 disabled:opacity-50"
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-70 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                    <TriangleAlert className="text-red-500" size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Confirm Decline
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
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
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    You also can:
                  </p>

                  <Button
                    variant="ghost"
                    onClick={() => setDeclineAll((v) => !v)}
                    className="flex justify-start cursor-pointer gap-3 text-left group"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors border",
                        declineAll
                          ? "bg-red-500 border-red-500"
                          : "bg-white border-gray-300 group-hover:border-red-300",
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
                    className="flex justify-start cursor-pointer gap-3 text-left group"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex shrink-0 transition-colors border",
                        blockFutureApply
                          ? "bg-red-500 border-red-500"
                          : "bg-white border-gray-300 group-hover:border-red-300",
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
                    className="h-10 px-5 rounded-xl border cursor-pointer border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 shadow-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isLoading}
                    className="h-10 px-5 rounded-xl cursor-pointer bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md shadow-red-600/20 disabled:opacity-50"
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
                className="h-11 w-full rounded-xl border cursor-pointer border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all"
                onClick={openReprocess}
                disabled={isLoading}
              >
                <X className="size-4 " />
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
                <CircleCheck className="size-4 mr-1.5" />
                {isFinalPending || isDeclining ? "Processing..." : "Process"}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
