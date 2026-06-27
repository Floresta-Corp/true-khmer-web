import { Star, Trash2, Send, Info } from "lucide-react";
import type {
  OpportunityDetail,
  Role,
} from "~/features/volunteer/types/opportunities";
import VolunteerApplicationDialog from "../dialog/volunteer-application-dialog";
import { formatDate } from "date-fns";
import { useVolunteerSelectedRoles } from "../../../../stores/selected-volunteer-roles-store";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface ApplicationSummaryProps {
  volunteer: OpportunityDetail;
  disableApplyButton?: boolean;
  disableButtonMessage?: string;
  totalCapacity: number;
  onApplyNoRoles?: () => void;
  isActiveTabOpenRoles?: boolean;
}

export default function ApplicationSummary({
  volunteer,
  totalCapacity,
  disableApplyButton,
  disableButtonMessage,
  onApplyNoRoles,
  isActiveTabOpenRoles,
}: ApplicationSummaryProps) {
  const { selectedRoleIds, topPickRoleId, removeRole, setTopPick } =
    useVolunteerSelectedRoles();

  const selectedRoles = volunteer.roles.filter((r) =>
    selectedRoleIds.includes(r.id),
  );

  const hasAnyApplied = selectedRoleIds.some((id) => {
    const role = volunteer.roles.find((r) => r.id === id);
    return role?.viewerApplied;
  });

  return (
    <aside className="rounded-[14px] border border-[#e1e7ef] bg-white p-8 h-fit">
      <h2 className="text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        Application Summary
      </h2>

      <SummaryDetails
        volunteer={volunteer}
        totalCapacity={totalCapacity}
        selectedRoles={selectedRoles}
        topPickRoleId={topPickRoleId}
        removeRole={removeRole}
        setTopPick={setTopPick}
      />
      <ActionButtons
        roles={volunteer.roles}
        selectedRoleIds={selectedRoleIds}
        topPickRoleId={topPickRoleId}
        disableApplyButton={disableApplyButton || hasAnyApplied}
        disableButtonMessage={disableButtonMessage}
        onApplyNoRoles={onApplyNoRoles}
        isActiveTabOpenRoles={isActiveTabOpenRoles}
        opportunityTitle={volunteer.title}
      />
    </aside>
  );
}

interface SummaryDetailsProps {
  volunteer: OpportunityDetail;
  totalCapacity: number;
  selectedRoles: Role[];
  topPickRoleId: string | null;
  removeRole: (roleId: string) => void;
  setTopPick: (roleId: string) => void;
}

function SummaryDetails({
  volunteer,
  totalCapacity,
  selectedRoles,
  topPickRoleId,
  removeRole,
  setTopPick,
}: SummaryDetailsProps) {
  return (
    <div className="mt-6">
      <div className="space-y-3.5 pb-5 border-b border-[#f1f5f9] text-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-[#64748b]">Open Roles</span>
          <span className="flex items-center justify-center rounded-md bg-[#eff6ff] px-2.5 py-1 text-[13px] font-bold text-[#2f6fe4]">
            {totalCapacity} Spots
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#64748b]">Deadline</span>
          <span className="font-bold text-[#0f172a]">
            {formatDate(volunteer?.applicationDeadline, "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      <div className="pt-5">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#0f172a]">
              Selected Roles
            </h3>
            <span className="flex h-5.5 min-w-5.5 items-center justify-center rounded bg-[#f1f5f9] px-1.5 text-[12px] font-semibold text-[#475569]">
              {selectedRoles.length}
            </span>
          </div>
          <p className="text-[13px] text-[#64748b] mt-1">
            Mark your most preferred role with a star
          </p>
        </div>

        {selectedRoles.length === 0 ? (
          <div className="flex h-22 items-center justify-center rounded-[14px] border border-dashed border-[#e2e8f0] bg-[#fafafa]">
            <span className="text-[13px] text-[#94a3b8]">
              No roles selected yet
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {selectedRoles.map((role) => (
                <motion.div
                  key={role.id}
                  layout
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-center justify-between rounded-[18px] border px-5 py-4",
                    topPickRoleId === role.id
                      ? "border-[#fef08a] bg-[#fffdf5]"
                      : "border-[#f1f5f9] bg-[#fcfcfd]",
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={cn(
                        "truncate font-bold text-[15px]",
                        topPickRoleId === role.id
                          ? "text-[#c2410c]"
                          : "text-[#0f172a]",
                      )}
                    >
                      {role.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      type="button"
                      onClick={() => setTopPick(role.id)}
                      className={cn(
                        "group flex size-8 items-center justify-center rounded-full transition-colors",
                        topPickRoleId === role.id
                          ? "bg-white text-[#f59e0b] hover:bg-[#f59f0b30]"
                          : "hover:bg-gray-100 hover:text-[#f59e0b]",
                      )}
                      title="Mark as Top Pick"
                    >
                      <Star
                        className={cn(
                          "size-4 transition-colors",
                          topPickRoleId === role.id ? "fill-[#f59e0b]" : "",
                        )}
                      />
                    </button>
                    <Button
                      variant={"ghost"}
                      onClick={() => removeRole(role.id)}
                      className="flex size-8 items-center justify-center rounded-full overflow-hidden transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Remove"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  roles: Role[];
  selectedRoleIds: string[];
  topPickRoleId: string | null;
  disableApplyButton?: boolean;
  onApplyNoRoles?: () => void;
  isActiveTabOpenRoles?: boolean;
  disableButtonMessage?: string;
  opportunityTitle: string;
}

function ActionButtons({
  roles,
  selectedRoleIds,
  topPickRoleId,
  disableApplyButton,
  onApplyNoRoles,
  isActiveTabOpenRoles,
  opportunityTitle,
  disableButtonMessage,
}: ActionButtonsProps) {
  const isNoRolesSelected = selectedRoleIds.length === 0;

  return (
    <div className="mt-6 space-y-3.5">
      <AnimatePresence mode="wait" initial={false}>
        {isNoRolesSelected && !isActiveTabOpenRoles ? (
          <motion.div
            key="button-switch"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              // disabled={disableApplyButton}
              onClick={onApplyNoRoles}
              className="h-10 w-full bg-[#2f6fe4] text-sm font-medium text-[#f8fafc] hover:bg-[#245fca] gap-2"
            >
              Show Available Roles
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="dialog-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <VolunteerApplicationDialog
              roles={roles}
              selectedRoleIds={selectedRoleIds}
              topPickRoleId={topPickRoleId}
              opportunityTitle={opportunityTitle}
              trigger={
                <Button
                  disabled={disableApplyButton || isNoRolesSelected}
                  className="h-10 w-full bg-[#2f6fe4] text-sm font-medium text-[#f8fafc] hover:bg-[#245fca] gap-2"
                >
                  <Send className="size-4" />
                  Apply Now
                </Button>
              }
            />
          </motion.div>
        )}
        {disableApplyButton && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="py-1.5 px-3 rounded-lg bg-amber-100 flex items-center gap-3 text-gray-500"
          >
            <Info className="size-6" />
            <p className="text-xs">{disableButtonMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
