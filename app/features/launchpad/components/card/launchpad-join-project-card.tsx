import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";
import LaunchpadSubmitApplicationDialog from "../dialog/launchpad-submit-application-dialog";
import { useLaunchpadSelectedRoles } from "../../../../stores/selected-launchpad-roles-store";
import { Star, Trash2, Send, Info } from "lucide-react";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";

interface LaunchpadJoinProjectCardProps {
  project: LaunchpadDetail;
  disableApplyButton?: boolean;
  disableButtonMessage?: string;
  onApplyNoRoles?: () => void;
  isActiveTabOpenRoles?: boolean;
  userId?: string | null;
}

export default function LaunchpadJoinProjectCard({
  project,
  disableApplyButton,
  disableButtonMessage,
  onApplyNoRoles,
  isActiveTabOpenRoles,
  userId,
}: LaunchpadJoinProjectCardProps) {
  const navigate = useNavigate();
  const { selectedRoleIds, topPickRoleId, removeRole, setTopPick } =
    useLaunchpadSelectedRoles();

  const isNoRolesSelected = selectedRoleIds.length === 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const selectedRoles = project.roles.filter((r) =>
    selectedRoleIds.includes(r.id),
  );

  const totalCapacity = project.roles.reduce(
    (sum: number, role: any) => sum + (role?.capacity ?? 0),
    0,
  );

  return (
    <Card className="rounded-2xl border-[#E7ECF3] bg-white p-5 shadow-none">
      <div className="text-[28px] leading-8.5 font-semibold text-[#0F1729]">
        Join this project
      </div>

      <div className="mt-6 space-y-3.5 pb-5 border-b border-[#f1f5f9] text-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-[#64748b]">Open Roles</span>
          <span className="flex items-center justify-center rounded-md bg-[#eff6ff] px-2.5 py-1 text-[13px] font-bold text-[#2f6fe4]">
            {totalCapacity} Spots
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#64748b]">Deadline</span>
          <span className="font-bold text-[#0f172a]">
            {formatDate(project.deadline)}
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
            <AnimatePresence mode="wait">
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
                      onClick={() => removeRole(role.id)}
                      variant={"ghost"}
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
              onClick={onApplyNoRoles}
              className="mt-5 h-10 w-full rounded-lg bg-[#2F6FE4] text-sm font-semibold text-white hover:bg-[#245cc2] gap-2"
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
            {userId ? (
              <LaunchpadSubmitApplicationDialog
                launchpadId={project.id}
                launchpadName={project.name}
                selectedRoleIds={selectedRoleIds}
                topPickRoleId={topPickRoleId}
                roles={project.roles}
                trigger={
                  <Button
                    disabled={disableApplyButton || isNoRolesSelected}
                    className="mt-5 h-10 w-full rounded-lg bg-[#2F6FE4] text-sm font-semibold text-white hover:bg-[#245cc2] disabled:opacity-50 gap-2"
                  >
                    <Send className="size-4" />
                    Apply Now
                  </Button>
                }
              />
            ) : (
              <Button
                onClick={() => {
                  const redirectTo = window.location.pathname;
                  navigate(
                    `/login?redirectTo=${encodeURIComponent(redirectTo)}`,
                  );
                }}
                className="mt-5 h-10 w-full rounded-lg bg-[#2F6FE4] text-sm font-semibold text-white hover:bg-[#245cc2] gap-2"
              >
                <Send className="size-4" />
                Apply Now
              </Button>
            )}
          </motion.div>
        )}
        {disableApplyButton && (
          <motion.div
            key="info-message"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-3 py-1.5 px-3 rounded-lg bg-amber-100 flex items-center gap-3 text-gray-500"
          >
            <Info className="size-6" />
            <p className="text-xs">{disableButtonMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
