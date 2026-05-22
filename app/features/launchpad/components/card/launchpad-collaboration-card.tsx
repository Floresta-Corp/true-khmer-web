import { Star, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useLaunchpadSelectedRoles } from "../../../../stores/selected-launchpad-roles-store";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface CollaborationCardProps {
  data: {
    id: string;
    title: string;
    details: string;
    availableSpot: number;
  };
  launchpadId: string;
  launchpadName?: string;
  roles?: Array<{ id: string; title: string }>;
  hideApplyButton?: boolean;
}

export default function LaunchpadCollaborationCard({
  data,
  hideApplyButton,
}: CollaborationCardProps) {
  const { addRole, removeRole, setTopPick, isRoleSelected, isTopPick } =
    useLaunchpadSelectedRoles();

  const spotLabel = data.availableSpot === 1 ? "Spot" : "Spots";
  const selected = isRoleSelected(data.id);
  const topPick = isTopPick(data.id);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-4">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#EAF2FF]">
        <Users className="size-4.25 text-blue-500" />
      </div>
      <div className="flex-1 text-sm">
        <div className="font-semibold text-[#0F1729]">{data.title}</div>
        <p className="line-clamp-1 text-[13px] text-[#94A3B8]">
          {data.details}
        </p>
      </div>
      <div className="text-right min-w-15">
        <div className="text-[#9EACC0] text-xs">Available</div>
        <p className="text-sm text-blue-500 font-semibold">
          {data.availableSpot} {spotLabel}
        </p>
      </div>
      {!hideApplyButton && (
        <div className="flex items-center gap-1.5">
          <Button
            className={cn(
              "h-8 px-4 text-sm font-medium hover:bg-blue-600",
              selected ? "bg-[#1c5dd4]" : "bg-blue-500",
            )}
            onClick={() => {
              if (!selected) addRole(data.id);
              else removeRole(data.id);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={selected ? "selected" : "select"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {selected ? "Selected" : "Select"}
              </motion.span>
            </AnimatePresence>
          </Button>
          <AnimatePresence>
            {selected && (
              <motion.div
                key="top-pick-btn"
                initial={{ opacity: 0, x: -12, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: 12, width: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Button
                  type="button"
                  variant={topPick ? "default" : "outline"}
                  className={cn(
                    "h-8 px-2 text-xs",
                    topPick
                      ? "bg-[#2f6fe4] text-white hover:bg-[#245fca]"
                      : "border-[#e1e7ef] text-[#65758b] hover:bg-[#f8fafc]",
                  )}
                  onClick={() => setTopPick(data.id)}
                >
                  <Star className={cn("size-3.5", topPick && "fill-white")} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selected && (
              <motion.div
                key="remove-btn"
                initial={{ opacity: 0, x: -12, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: 12, width: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut", delay: 0.05 }}
                className="overflow-hidden"
              >
                <Button
                  type="button"
                  variant="destructive"
                  className="h-8 px-2 text-xs border-red-200 text-red-500 hover:bg-red-50"
                  onClick={() => removeRole(data.id)}
                >
                  Remove
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
