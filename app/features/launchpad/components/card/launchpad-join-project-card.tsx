import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";
import LaunchpadSubmitApplicationDialog from "../dialog/launchpad-submit-application-dialog";
import { useLaunchpadSelectedRoles } from "../../../../stores/selected-launchpad-roles-store";
import { Star, X, Send } from "lucide-react";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface LaunchpadJoinProjectCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadJoinProjectCard({
  project,
}: LaunchpadJoinProjectCardProps) {
  const { selectedRoleIds, topPickRoleId, removeRole, setTopPick } =
    useLaunchpadSelectedRoles();

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

  return (
    <Card className="rounded-2xl border-[#E7ECF3] bg-white p-5 shadow-none">
      <div className="text-[28px] leading-8.5 font-semibold text-[#0F1729]">
        Join this project
      </div>
      <Separator className="my-4 bg-[#E7ECF3]" />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9EACC0]">Seeking</span>
          <span className="font-medium text-[#0F1729]">
            {project.roles.length} roles
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9EACC0]">Deadline</span>
          <span className="font-medium text-[#0F1729]">
            {formatDate(project.deadline)}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {selectedRoles.length > 0 && (
          <motion.div
            key="role-of-interest"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mt-5 overflow-hidden"
          >
            <div className="space-y-2">
              <p className="text-sm text-[#99a1af]">Role of interest</p>
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
                      "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                      topPickRoleId === role.id
                        ? "border-[#2f6fe4] bg-[#f0f6ff]"
                        : "border-[#e1e7ef] bg-[#f8fafc]",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {topPickRoleId === role.id && (
                        <Star className="size-3.5 shrink-0 fill-[#2f6fe4] text-[#2f6fe4]" />
                      )}
                      <span className="truncate font-medium text-[#030213]">
                        {role.title}
                      </span>
                      {topPickRoleId === role.id && (
                        <span className="shrink-0 text-[10px] font-semibold text-[#2f6fe4] uppercase">
                          Top Pick
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => setTopPick(role.id)}
                        className="rounded p-1 hover:bg-[#e1e7ef] transition-colors"
                        title={topPickRoleId === role.id ? "Remove top pick" : "Set as top pick"}
                      >
                        <Star
                          className={cn(
                            "size-3.5",
                            topPickRoleId === role.id
                              ? "fill-[#2f6fe4] text-[#2f6fe4]"
                              : "text-[#99a1af]",
                          )}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRole(role.id)}
                        className="rounded p-1 hover:bg-red-50 text-[#99a1af] hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LaunchpadSubmitApplicationDialog
        launchpadId={project.id}
        launchpadName={project.name}
        selectedRoleIds={selectedRoleIds}
        topPickRoleId={topPickRoleId}
        roles={project.roles}
        trigger={
          <Button
            disabled={selectedRoleIds.length === 0}
            className="mt-5 h-10 w-full rounded-lg bg-[#2F6FE4] text-sm font-semibold text-white hover:bg-[#245cc2] disabled:opacity-50 gap-2"
          >
            <Send className="size-4" />
            Apply Now
          </Button>
        }
      />
    </Card>
  );
}
